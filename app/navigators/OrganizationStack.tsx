import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { useTranslation } from 'react-i18next'

import SettingsMenu from '../components/buttons/SettingsMenu'
import { useTheme } from '../contexts/theme'
import OrganizationDetails from '../screens/OrganizationDetails'
import OrganizationList from '../screens/OrganizationList'
import { HomeStackParams, Screens } from '../types/navigators'

import { createDefaultStackOptions } from './defaultStackOptions'

const OrganizationStack: React.FC = () => {
  const Stack = createStackNavigator<HomeStackParams>()
  const theme = useTheme()
  const { t } = useTranslation()
  const defaultStackOptions = createDefaultStackOptions(theme)

  return (
    <Stack.Navigator screenOptions={{ ...defaultStackOptions }}>
      <Stack.Screen
        name={Screens.Organizations}
        component={OrganizationList}
        options={() => ({
          title: t('Screens.Organization'),
          headerRight: () => null,
          headerLeft: () => <SettingsMenu />,
        })}
      />
      <Stack.Screen
        name={Screens.OrganizationsConnection}
        component={OrganizationDetails}
        options={() => ({
          title: t('Screens.OrganizationDetails'),
          headerRight: () => null,
          headerLeft: () => <SettingsMenu />,
        })}
      />
    </Stack.Navigator>
  )
}

export default OrganizationStack
