import { Client, Wallet } from 'xrpl'
import ECDSA from 'xrpl/dist/npm/ECDSA'
import type { XrplSignableTransaction } from '@/lib/myapo-api'

type AutofillFields = {
  Fee?: unknown
  Sequence?: unknown
  LastLedgerSequence?: unknown
}

function hexToBytes(hexPrivateKey: string) {
  const hex = hexPrivateKey.startsWith('0x') ? hexPrivateKey.slice(2) : hexPrivateKey
  if (hex.length === 0 || hex.length % 2 !== 0) {
    throw new Error('XRPL private key format is invalid')
  }

  const bytes = new Uint8Array(hex.length / 2)
  for (let index = 0; index < bytes.length; index += 1) {
    bytes[index] = Number.parseInt(hex.slice(index * 2, index * 2 + 2), 16)
  }
  return bytes
}

function hasReliableSubmissionFields(transaction: XrplSignableTransaction) {
  const fields = transaction as XrplSignableTransaction & AutofillFields
  return fields.Fee !== undefined && fields.Sequence !== undefined && fields.LastLedgerSequence !== undefined
}

async function autofillTransaction(transaction: XrplSignableTransaction, network: string | null) {
  if (hasReliableSubmissionFields(transaction)) return transaction
  if (!network) {
    throw new Error('XRPL 네트워크 정보가 없어 서명 트랜잭션을 준비하지 못했어요')
  }

  const client = new Client(network)
  await client.connect()
  try {
    return await client.autofill(transaction)
  } finally {
    await client.disconnect()
  }
}

export async function signXrplTransactionBlob(
  privateKey: string,
  transaction: XrplSignableTransaction,
  network: string | null,
) {
  const wallet = Wallet.fromEntropy(hexToBytes(privateKey), { algorithm: ECDSA.secp256k1 })
  const autofilledTransaction = await autofillTransaction(transaction, network)
  return wallet.sign(autofilledTransaction).tx_blob
}
