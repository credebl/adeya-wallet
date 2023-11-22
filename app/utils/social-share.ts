import { useState } from 'react'
import { Config } from 'react-native-config'
import Share from 'react-native-share'
import Toast from 'react-native-toast-message'

import { USER_CERTIFICATE } from '../api/api-constants'
import { ToastType } from '../components/toast/BaseToast'
import { CredentialData } from '../types/share'

export const useSocialShare = () => {
  const [loading, setLoading] = useState(false)

  const socialShare = async (credentialData: CredentialData) => {
    setLoading(true)
    try {
      const url = `${Config.PUBLIC_ORG}${USER_CERTIFICATE}`
      const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }
      const options = {
        method: 'POST',
        headers,
        body: JSON.stringify(credentialData),
      }

      const response = await fetch(url, options)

      if (!response.ok) {
        Toast.show({
          type: ToastType.Error,
          text1: 'Failed to fetch social share content for this credential.',
        })

        setLoading(false)
        return
      }

      const data = await response.json()
      const shareOptions = { message: data?.label, url: data?.data, mimeType: 'image/jpeg' }
      await Share.open(shareOptions)
      return data
    } catch (error) {
      setLoading(false)
    }
  }

  return { socialShare, loading }
}
