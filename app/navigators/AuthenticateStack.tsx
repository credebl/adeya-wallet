import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { useTheme } from '../contexts/theme'
import AttemptLockout from '../screens/AttemptLockout'
import CreateWallet from '../screens/CreateWallet'
import ImportSuccess from '../screens/ImportSuccess'
import ImportWalletVerify from '../screens/ImportWalletConfirmation'
import PINEnter from '../screens/PINEnter'
import { AuthenticateStackParams, Screens } from '../types/navigators'
import { testIdWithKey } from '../utils/testable'

import { createDefaultStackOptions } from './defaultStackOptions'

interface AuthenticateStackProps {
  setAuthenticated: (status: boolean) => void
}

const AuthenticateStack: React.FC<AuthenticateStackProps> = ({ setAuthenticated }) => {
  const Stack = createStackNavigator<AuthenticateStackParams>()
  const theme = useTheme()
  const { t } = useTranslation()
  const defaultStackOptions = createDefaultStackOptions(theme)

  return (
    <Stack.Navigator screenOptions={{ ...defaultStackOptions, presentation: 'transparentModal', headerShown: false }}>
      <Stack.Screen name={Screens.EnterPIN} component={PINEnter} initialParams={{ setAuthenticated }} />
      <Stack.Screen name={Screens.AttemptLockout} component={AttemptLockout} />
      <Stack.Screen
        name={Screens.ImportWalletVerify}
        component={ImportWalletVerify}
        options={{ title: t('Screens.CreateWallet'), headerBackTestID: testIdWithKey('Back') }}
      />
      <Stack.Screen name={Screens.ImportSuccess} component={ImportSuccess} options={{ title: t('Screens.Success') }} />
      <Stack.Screen
        name={Screens.WalletOptions}
        component={CreateWallet}
        options={{ title: t('Screens.CreateWallet') }}
      />
    </Stack.Navigator>
  )
}

export default AuthenticateStack
