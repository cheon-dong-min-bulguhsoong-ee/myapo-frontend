'use client'
import { createContext, useCallback, useContext, useEffect, useRef, useState, ReactNode } from 'react'
import { Web3Auth } from '@web3auth/modal'
import { AuthAdapter } from '@web3auth/auth-adapter'
import { XrplPrivateKeyProvider } from '@web3auth/xrpl-provider'
import {
  CHAIN_NAMESPACES,
  WEB3AUTH_NETWORK,
  type IProvider,
} from '@web3auth/base'
import { Wallet } from 'xrpl'

const CLIENT_ID = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID ?? ''
const NETWORK_KEY = (process.env.NEXT_PUBLIC_WEB3AUTH_NETWORK ?? 'sapphire_mainnet').toUpperCase() as keyof typeof WEB3AUTH_NETWORK

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

interface UserInfo {
  name?: string
  email?: string
  profileImage?: string
  typeOfLogin?: string
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
  wallet: WalletKeys
  login: () => Promise<boolean>
  logout: () => Promise<void>
}

const EMPTY_WALLET: WalletKeys = { address: null, publicKey: null, privateKey: null }

const AuthContext = createContext<AuthContextType>({
  isReady: false,
  isLoggedIn: false,
  userInfo: null,
  wallet: EMPTY_WALLET,
  login: async () => false,
  logout: async () => {},
})

async function readWalletKeys(provider: IProvider): Promise<WalletKeys> {
  let address: string | null = null
  let publicKey: string | null = null
  let privateKey: string | null = null

  try {
    privateKey = (await provider.request<unknown, string>({ method: 'private_key' })) ?? null
  } catch {
    privateKey = null
  }

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
      const wallet = Wallet.fromEntropy(privateKey)
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [wallet, setWallet] = useState<WalletKeys>(EMPTY_WALLET)
  const initRef = useRef(false)

  useEffect(() => {
    if (initRef.current) return
    initRef.current = true

    ;(async () => {
      try {
        const privateKeyProvider = new XrplPrivateKeyProvider({
          config: { chainConfig: xrplChainConfig },
        })

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

        if (instance.connected && instance.provider) {
          const [info, keys] = await Promise.all([
            instance.getUserInfo().catch(() => null),
            readWalletKeys(instance.provider),
          ])
          setUserInfo((info as UserInfo) ?? null)
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

  const login = useCallback(async (): Promise<boolean> => {
    if (!web3auth) return false
    try {
      const provider = await web3auth.connect()
      if (!provider) return false
      const [info, keys] = await Promise.all([
        web3auth.getUserInfo().catch(() => null),
        readWalletKeys(provider),
      ])
      setUserInfo((info as UserInfo) ?? null)
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
    try {
      await web3auth.logout()
    } catch (err) {
      console.error('Web3Auth logout failed:', err)
    }
    setIsLoggedIn(false)
    setUserInfo(null)
    setWallet(EMPTY_WALLET)
    clearWallet()
    if (typeof window !== 'undefined') {
      localStorage.removeItem('myapo_persona')
    }
  }, [web3auth])

  return (
    <AuthContext.Provider value={{ isReady, isLoggedIn, userInfo, wallet, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
