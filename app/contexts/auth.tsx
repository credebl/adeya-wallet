// eslint-disable-next-line import/no-extraneous-dependencies
import 'reflect-metadata'

import { isWalletPinCorrect } from '@adeya/ssi'
import React, { PropsWithChildren, createContext, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DeviceEventEmitter } from 'react-native'

import { EventTypes } from '../constants'
import {
  secretForPIN,
  storeWalletSecret,
  loadWalletSecret,
  loadWalletSalt,
  isBiometricsActive,
  wipeWalletKey,
} from '../services/keychain'
import { WalletSecret } from '../types/security'
import { hashPIN } from '../utils/crypto'

import { DispatchAction } from './reducers/store'
import { useStore } from './store'

export interface AuthContext {
  checkPIN: (PIN: string) => Promise<boolean>
  getWalletCredentials: () => Promise<WalletSecret | undefined>
  removeSavedWalletSecret: () => void
  disableBiometrics: () => Promise<void>
  setPIN: (PIN: string) => Promise<void>
  commitPIN: (useBiometry: boolean) => Promise<boolean>
  isBiometricsActive: () => Promise<boolean>
}

export const AuthContext = createContext<AuthContext>(null as unknown as AuthContext)

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [walletSecret, setWalletSecret] = useState<WalletSecret>()
  const [, dispatch] = useStore()
  const { t } = useTranslation()

  const setPIN = async (PIN: string): Promise<void> => {
    const secret = await secretForPIN(PIN)
    await storeWalletSecret(secret)
  }

  const getWalletCredentials = async (): Promise<WalletSecret | undefined> => {
    if (walletSecret && walletSecret.key) {
      return walletSecret
    }

    const { secret, err } = await loadWalletSecret(
      t('Biometry.UnlockPromptTitle'),
      t('Biometry.UnlockPromptDescription'),
    )

    DeviceEventEmitter.emit(EventTypes.BIOMETRY_ERROR, err !== undefined)

    if (!secret) {
      return
    }
    setWalletSecret(secret)

    return secret
  }

  const commitPIN = async (useBiometry: boolean): Promise<boolean> => {
    const secret = await getWalletCredentials()
    if (!secret) {
      return false
    }
    // set did authenticate to true if we can get wallet credentials
    dispatch({
      type: DispatchAction.DID_AUTHENTICATE,
    })
    if (useBiometry) {
      await storeWalletSecret(secret, useBiometry)
    } else {
      // erase wallet key if biometrics is disabled
      await wipeWalletKey(useBiometry)
    }
    return true
  }

  const checkPIN = async (PIN: string): Promise<boolean> => {
    try {
      const secret = await loadWalletSalt()

      if (!secret || !secret.salt) {
        return false
      }

      const hash = await hashPIN(PIN, secret.salt)

      // NOTE: a custom wallet is used to check if the wallet key is correct. This is different from the wallet used in the rest of the app.
      // We create an AskarWallet instance and open the wallet with the given secret.
      const response = await isWalletPinCorrect({
        id: secret.id,
        key: hash,
      })

      if (!response) {
        throw new Error('Invalid PIN')
      }

      const fullSecret = await secretForPIN(PIN, secret.salt)
      setWalletSecret(fullSecret)
      return true
    } catch (e) {
      return false
    }
  }

  const removeSavedWalletSecret = () => {
    setWalletSecret(undefined)
  }

  const disableBiometrics = async () => {
    await wipeWalletKey(true)
  }

  return (
    <AuthContext.Provider
      value={{
        checkPIN,
        getWalletCredentials,
        removeSavedWalletSecret,
        disableBiometrics,
        commitPIN,
        setPIN,
        isBiometricsActive,
      }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
