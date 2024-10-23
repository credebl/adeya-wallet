import { createHash } from 'crypto'
import argon2 from 'react-native-argon2'

export const hashPIN = async (PIN: string, salt: string): Promise<string> => {
  const result = await argon2(PIN, salt, {})
  const { rawHash } = result

  return rawHash
}

export const base64UrlEncodeWithoutPadding = (input: Buffer): string => {
  return input.toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

export const generateCodeChallenge = (codeVerifier: string): string => {
  const hash = createHash('sha256').update(codeVerifier).digest()
  return base64UrlEncodeWithoutPadding(hash)
}
