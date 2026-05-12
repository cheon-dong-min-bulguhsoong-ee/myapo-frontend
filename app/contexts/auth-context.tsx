'use client'
import { createContext, useCallback, useContext, useEffect, useRef, useState, ReactNode } from 'react'
import { Web3Auth } from '@web3auth/modal'
import { AuthAdapter } from '@web3auth/auth-adapter'
import { XrplPrivateKeyProvider } from '@web3auth/xrpl-provider'
import {
  ADAPTER_STATUS,
  CHAIN_NAMESPACES,
  WEB3AUTH_NETWORK,
  type IProvider,
} from '@web3auth/base'
import { Wallet } from 'xrpl'
import ECDSA from 'xrpl/dist/npm/ECDSA'
import {
  clearMyApoAccessToken,
  getStoredMyApoAccessToken,
  logoutFromMyApo,
  MYAPO_AUTH_TOKEN_EXPIRED_EVENT,
  persistMyApoAccessToken,
  signInWithExternalToken,
  type MyApoAuthRes,
} from '@/lib/myapo-api'

const CLIENT_ID = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID ?? ''
const NETWORK_KEY = (process.env.NEXT_PUBLIC_WEB3AUTH_NETWORK ?? 'sapphire_mainnet').toUpperCase() as keyof typeof WEB3AUTH_NETWORK
const DEFAULT_NATIONALITY = 'KR'

const xrplChainConfig = {
  chainNamespace: CHAIN_NAMESPACES.XRPL,
  chainId: '0x2',
  rpcTarget: 'https://testnet-ripple-node.tor.us',
  wsTarget: 'wss://s.altnet.rippletest.net:51233',
  ticker: 'XRP',
  tickerName: 'XRPL',
  displayName: 'XRPL Testnet',
  blockExplorerUrl: 'https://testnet.xrpl.org/',
}

const WALLET_STORAGE_KEY = 'myapo_wallet'
const WEB3AUTH_JWT_STORAGE_KEY = 'web3auth_jwt_token'

interface UserInfo {
  name?: string
  email?: string
  profileImage?: string
  typeOfLogin?: string
  idToken?: string
  oAuthIdToken?: string
  oAuthAccessToken?: string
}

interface WalletKeys {
  address: string | null
  publicKey: string | null
  privateKey: string | null
}

interface AuthContextType {
  isReady: boolean
  isLoggedIn: boolean
  userInfo: UserInfo | null
  myApoUser: MyApoAuthRes | null
  accessToken: string | null
  wallet: WalletKeys
  login: () => Promise<boolean>
  logout: () => Promise<void>
}

const EMPTY_WALLET: WalletKeys = { address: null, publicKey: null, privateKey: null }

const AuthContext = createContext<AuthContextType>({
  isReady: false,
  isLoggedIn: false,
  userInfo: null,
  myApoUser: null,
  accessToken: null,
  wallet: EMPTY_WALLET,
  login: async () => false,
  logout: async () => {},
})

// v9 xrpl-provider doesn't register a `private_key` JSON-RPC handler (it falls
// through to rippled), nor expose the key on a public field. Capture it the only
// reliable way: hook setupProvider(), which the AuthAdapter calls with the key.
const capturedPrivateKey = new WeakMap<XrplPrivateKeyProvider, string>()

function instrumentPrivateKeyProvider(provider: XrplPrivateKeyProvider) {
  const original = provider.setupProvider.bind(provider)
  provider.setupProvider = (async (pk: string) => {
    if (typeof pk === 'string' && pk.length > 0) capturedPrivateKey.set(provider, pk)
    return original(pk)
  }) as typeof provider.setupProvider
}

function extractPrivateKey(privateKeyProvider: XrplPrivateKeyProvider): string | null {
  return capturedPrivateKey.get(privateKeyProvider) ?? null
}

function normalizeUserInfo(value: unknown): UserInfo | null {
  if (!value || typeof value !== 'object') return null

  const obj = value as Record<string, unknown>
  return {
    name: typeof obj.name === 'string' ? obj.name : undefined,
    email: typeof obj.email === 'string' ? obj.email : undefined,
    profileImage: typeof obj.profileImage === 'string' ? obj.profileImage : undefined,
    typeOfLogin: typeof obj.typeOfLogin === 'string' ? obj.typeOfLogin : undefined,
    idToken: typeof obj.idToken === 'string' ? obj.idToken : undefined,
    oAuthIdToken: typeof obj.oAuthIdToken === 'string' ? obj.oAuthIdToken : undefined,
    oAuthAccessToken: typeof obj.oAuthAccessToken === 'string' ? obj.oAuthAccessToken : undefined,
  }
}

function normalizeToken(value: string | null | undefined) {
  const token = value?.trim()
  return token && token.length > 0 ? token : null
}

function extractWeb3AuthIdToken(value: unknown): string | null {
  if (!value || typeof value !== 'object') return null
  const obj = value as Record<string, unknown>
  return typeof obj.idToken === 'string' ? normalizeToken(obj.idToken) : null
}

function getExternalToken(authResult: unknown, userInfo: UserInfo | null) {
  return extractWeb3AuthIdToken(authResult)
    ?? normalizeToken(userInfo?.idToken)
    ?? normalizeToken(userInfo?.oAuthIdToken)
}

function describeTokenAvailability(authResult: unknown, userInfo: UserInfo | null) {
  return {
    authenticateUserIdToken: Boolean(extractWeb3AuthIdToken(authResult)),
    userInfoIdToken: Boolean(normalizeToken(userInfo?.idToken)),
    userInfoOAuthIdToken: Boolean(normalizeToken(userInfo?.oAuthIdToken)),
    userInfoOAuthAccessToken: Boolean(normalizeToken(userInfo?.oAuthAccessToken)),
  }
}

function isWeb3AuthConnected(web3auth: Web3Auth) {
  return web3auth.status === ADAPTER_STATUS.CONNECTED && web3auth.connected
}

async function readWeb3AuthSession(web3auth: Web3Auth) {
  const rawInfo = await web3auth.getUserInfo()
  const info = normalizeUserInfo(rawInfo)
  const authResult = await web3auth.authenticateUser().catch((err: unknown) => {
    console.error('Web3Auth authenticateUser failed:', err)
    return null
  })
  const externalToken = getExternalToken(authResult, info)

  if (!externalToken) {
    console.error('Web3Auth token fields are empty:', describeTokenAvailability(authResult, info))
    throw new Error('Web3Auth id token is missing')
  }

  return { info, externalToken }
}

async function readWalletKeys(
  provider: IProvider,
  privateKeyProvider: XrplPrivateKeyProvider,
): Promise<WalletKeys> {
  let address: string | null = null
  let publicKey: string | null = null
  const privateKey: string | null = extractPrivateKey(privateKeyProvider)

  try {
    const accounts = await provider.request<unknown, unknown[]>({ method: 'xrpl_getAccounts' })
    const first = Array.isArray(accounts) ? accounts[0] : null
    if (typeof first === 'string') {
      address = first
    } else if (first && typeof first === 'object') {
      const obj = first as Record<string, string | undefined>
      address = obj.classicAddress ?? obj.address ?? obj.Account ?? null
      publicKey = obj.publicKey ?? null
    }
  } catch {
    /* ignore */
  }

  if (privateKey && (!publicKey || !address)) {
    try {
      const hex = privateKey.startsWith('0x') ? privateKey.slice(2) : privateKey
      const bytes = new Uint8Array(hex.length / 2)
      for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16)
      const wallet = Wallet.fromEntropy(bytes, { algorithm: ECDSA.secp256k1 })
      publicKey = publicKey ?? wallet.publicKey
      address = address ?? wallet.classicAddress
    } catch {
      /* derivation failed; fall through with whatever we have */
    }
  }

  return { address, publicKey, privateKey }
}

function persistWallet(keys: WalletKeys) {
  if (typeof window === 'undefined') return
  // ⚠ Testnet demo only. Storing private keys in localStorage exposes them to any XSS on this origin.
  localStorage.setItem(WALLET_STORAGE_KEY, JSON.stringify(keys))
}

function clearWallet() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(WALLET_STORAGE_KEY)
}

function persistWeb3AuthJwtToken(token: string) {
  if (typeof window === 'undefined') return
  localStorage.setItem(WEB3AUTH_JWT_STORAGE_KEY, token)
}

function clearWeb3AuthJwtToken() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(WEB3AUTH_JWT_STORAGE_KEY)
}

async function createMyApoSession(externalToken: string, userInfo: UserInfo | null, wallet: WalletKeys) {
  const myApoUser = await signInWithExternalToken(externalToken, {
    name: userInfo?.name,
    nationality: DEFAULT_NATIONALITY,
    xrplAddress: wallet.address ?? undefined,
    publicKey: wallet.publicKey ?? undefined,
  })
  persistWeb3AuthJwtToken(externalToken)
  persistMyApoAccessToken(myApoUser.accessToken)
  return myApoUser
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [myApoUser, setMyApoUser] = useState<MyApoAuthRes | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(() => getStoredMyApoAccessToken())
  const [wallet, setWallet] = useState<WalletKeys>(EMPTY_WALLET)
  const initRef = useRef(false)
  const privateKeyProviderRef = useRef<XrplPrivateKeyProvider | null>(null)

  const expireMyApoSession = useCallback(() => {
    setIsLoggedIn(false)
    setMyApoUser(null)
    setAccessToken(null)
    clearMyApoAccessToken()

    if (typeof window === 'undefined') return
    const currentPath = `${window.location.pathname}${window.location.search}`
    if (window.location.pathname === '/login') return
    window.location.assign(`/login?reason=expired&next=${encodeURIComponent(currentPath)}`)
  }, [])

  useEffect(() => {
    if (initRef.current) return
    initRef.current = true

    ;(async () => {
      try {
        const privateKeyProvider = new XrplPrivateKeyProvider({
          config: { chainConfig: xrplChainConfig },
        })
        instrumentPrivateKeyProvider(privateKeyProvider)
        privateKeyProviderRef.current = privateKeyProvider

        const network = WEB3AUTH_NETWORK[NETWORK_KEY] ?? WEB3AUTH_NETWORK.SAPPHIRE_MAINNET
        const instance = new Web3Auth({
          clientId: CLIENT_ID,
          web3AuthNetwork: network,
          privateKeyProvider,
        })

        const authAdapter = new AuthAdapter({
          privateKeyProvider,
          adapterSettings: { uxMode: 'redirect' },
        })
        instance.configureAdapter(authAdapter)

        await instance.initModal()
        setWeb3auth(instance)

        if (isWeb3AuthConnected(instance) && instance.provider) {
          const [{ info, externalToken }, keys] = await Promise.all([
            readWeb3AuthSession(instance),
            readWalletKeys(instance.provider, privateKeyProvider),
          ])
          const myApoSession = await createMyApoSession(externalToken, info, keys)
          setUserInfo(info)
          setMyApoUser(myApoSession)
          setAccessToken(myApoSession.accessToken)
          setWallet(keys)
          persistWallet(keys)
          setIsLoggedIn(true)
        }
      } catch (err) {
        console.error('Web3Auth init failed:', err)
      } finally {
        setIsReady(true)
      }
    })()
  }, [])

  useEffect(() => {
    window.addEventListener(MYAPO_AUTH_TOKEN_EXPIRED_EVENT, expireMyApoSession)
    return () => window.removeEventListener(MYAPO_AUTH_TOKEN_EXPIRED_EVENT, expireMyApoSession)
  }, [expireMyApoSession])

  const login = useCallback(async (): Promise<boolean> => {
    if (!web3auth || !privateKeyProviderRef.current) return false
    try {
      const privateKeyProvider = privateKeyProviderRef.current
      const provider = isWeb3AuthConnected(web3auth) && web3auth.provider
        ? web3auth.provider
        : await web3auth.connect()
      if (!provider || !isWeb3AuthConnected(web3auth)) return false
      const [{ info, externalToken }, keys] = await Promise.all([
        readWeb3AuthSession(web3auth),
        readWalletKeys(provider, privateKeyProvider),
      ])
      const myApoSession = await createMyApoSession(externalToken, info, keys)
      setUserInfo(info)
      setMyApoUser(myApoSession)
      setAccessToken(myApoSession.accessToken)
      setWallet(keys)
      persistWallet(keys)
      setIsLoggedIn(true)
      return true
    } catch (err) {
      console.error('Web3Auth login failed:', err)
      return false
    }
  }, [web3auth])

  const logout = useCallback(async () => {
    if (!web3auth) return
    const tokenToRevoke = accessToken
    try {
      if (tokenToRevoke) await logoutFromMyApo(tokenToRevoke)
      await web3auth.logout()
    } catch (err) {
      console.error('Web3Auth logout failed:', err)
    }
    setIsLoggedIn(false)
    setUserInfo(null)
    setMyApoUser(null)
    setAccessToken(null)
    setWallet(EMPTY_WALLET)
    clearWallet()
    clearWeb3AuthJwtToken()
    clearMyApoAccessToken()
    if (typeof window !== 'undefined') {
      localStorage.removeItem('myapo_persona')
    }
  }, [accessToken, web3auth])

  return (
    <AuthContext.Provider value={{ isReady, isLoggedIn, userInfo, myApoUser, accessToken, wallet, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
