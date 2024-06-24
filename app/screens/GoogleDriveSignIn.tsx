import AsyncStorage from '@react-native-async-storage/async-storage'
import { GoogleSignin, GoogleSigninButton, statusCodes, User } from '@react-native-google-signin/google-signin'
import { useNavigation } from '@react-navigation/core'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View, StyleSheet, Alert } from 'react-native'

import { useAuth } from '../contexts/auth'
import { useTheme } from '../contexts/theme'
import { Screens } from '../types/navigators'

const GoogleDriveSignIn: React.FC = () => {
  const [, setUserInfo] = useState<User | null>(null)
  const { ColorPallet } = useTheme()
  const navigation = useNavigation()
  const { t } = useTranslation()
  const { signIn } = useAuth()
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: ColorPallet.brand.primaryBackground,
    },
  })

  const authenticateWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices()
      const userInfo = await GoogleSignin.signIn()
      setUserInfo(userInfo)
      await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo))
      signIn()
      navigation.replace(Screens.ExportWallet, { backupType: 'google_drive' })
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert('Sign-In Cancelled', t('GoogleDrive.SignInCancelled'))
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert('Sign-In In Progress', t('GoogleDrive.SignInProgress'))
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('Play Services Not Available', t('GoogleDrive.PlayServicesNotAvailable'))
      } else {
        Alert.alert('Sign-In Error', t('GoogleDrive.SignInError'))
      }
    }
  }

  return (
    <View style={styles.container}>
      <GoogleSigninButton
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={authenticateWithGoogle}
        disabled={false}
      />
    </View>
  )
}

export default GoogleDriveSignIn
