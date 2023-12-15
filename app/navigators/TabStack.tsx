import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Text, useWindowDimensions, View, StyleSheet, ImageBackground } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { AttachTourStep } from '../components/tour/AttachTourStep'
import { useTheme } from '../contexts/theme'
import ListContacts from '../screens/ListContacts'
import { Assets } from '../theme'
import { TabStackParams, TabStacks } from '../types/navigators'
import { isTablet, orientation, Orientation } from '../utils/helpers'
import { testIdWithKey } from '../utils/testable'

import CredentialStack from './CredentialStack'
import HomeStack from './HomeStack'
import OrganizationStack from './OrganizationStack'

const TabStack: React.FC = () => {
  const { width, height } = useWindowDimensions()
  const { t } = useTranslation()
  const Tab = createBottomTabNavigator<TabStackParams>()
  const { ColorPallet, TabTheme } = useTheme()
  const { fontScale } = useWindowDimensions()

  const showLabels = fontScale * TabTheme.tabBarTextStyle.fontSize < 18
  const styles = StyleSheet.create({
    tabBarIcon: {
      flex: 1,
      zIndex: 1,
    },
  })

  const leftMarginForDevice = (width: number, height: number) => {
    if (isTablet(width, height)) {
      return orientation(width, height) === Orientation.Portrait ? 130 : 170
    }

    return 0
  }
  const CustomTabBar = () => {
    return (
      <View>
        <ImageBackground
          source={require('../assets/img/Rectangle.png')}
          style={{
            height: 30,
          }}
        />
      </View>
    )
  }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: ColorPallet.brand.primary }}>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: {
            ...TabTheme.tabBarStyle,
          },
          tabBarBackground: () => <CustomTabBar />,
          tabBarActiveTintColor: TabTheme.tabBarActiveTintColor,
          tabBarInactiveTintColor: TabTheme.tabBarInactiveTintColor,
          header: () => null,
        }}>
        <Tab.Screen
          name={TabStacks.HomeStack}
          component={HomeStack}
          options={{
            tabBarIconStyle: styles.tabBarIcon,
            tabBarIcon: ({ focused }) => (
              <View style={{ ...TabTheme.tabBarContainerStyle, justifyContent: showLabels ? 'flex-end' : 'center' }}>
                {focused ? <Assets.svg.HomeIconActive /> : <Assets.svg.HomeIcon />}
                {showLabels && (
                  <Text
                    style={{
                      ...TabTheme.tabBarTextStyle,
                      color: focused ? TabTheme.tabBarActiveTintColor : TabTheme.tabBarInactiveTintColor,
                    }}>
                    {t('TabStack.Home')}
                  </Text>
                )}
              </View>
            ),

            tabBarShowLabel: false,
            tabBarAccessibilityLabel: `${t('TabStack.Home')} `,
            tabBarTestID: testIdWithKey(t('TabStack.Home')),
            tabBarBadgeStyle: {
              marginLeft: leftMarginForDevice(width, height),
              backgroundColor: ColorPallet.semantic.error,
            },
          }}
        />
        <Tab.Screen
          name={TabStacks.OrganizationStack}
          component={OrganizationStack}
          options={{
            tabBarIconStyle: styles.tabBarIcon,
            tabBarIcon: ({ focused }) => (
              <View style={{ ...TabTheme.tabBarContainerStyle, justifyContent: showLabels ? 'flex-end' : 'center' }}>
                {focused ? <Assets.svg.ExploreIconActive /> : <Assets.svg.ExploreIcon />}
                {showLabels && (
                  <Text
                    style={{
                      ...TabTheme.tabBarTextStyle,
                      color: focused ? TabTheme.tabBarActiveTintColor : TabTheme.tabBarInactiveTintColor,
                    }}>
                    {t('TabStack.Explore')}
                  </Text>
                )}
              </View>
            ),
            tabBarShowLabel: false,

            tabBarTestID: testIdWithKey(t('TabStack.Explore')),
          }}
        />
        <Tab.Screen
          name={TabStacks.ContactStack}
          component={ListContacts}
          options={{
            tabBarIconStyle: styles.tabBarIcon,
            tabBarIcon: ({ focused }) => (
              <AttachTourStep index={2}>
                <View style={{ ...TabTheme.tabBarContainerStyle, justifyContent: showLabels ? 'flex-end' : 'center' }}>
                  {focused ? <Assets.svg.ConnectionIconActive /> : <Assets.svg.Connection />}
                  {showLabels && (
                    <Text
                      style={{
                        ...TabTheme.tabBarTextStyle,
                        color: focused ? TabTheme.tabBarActiveTintColor : TabTheme.tabBarInactiveTintColor,
                      }}>
                      {t('TabStack.Connections')}
                    </Text>
                  )}
                </View>
              </AttachTourStep>
            ),
            tabBarShowLabel: false,
            tabBarAccessibilityLabel: t('TabStack.Credentials'),
            tabBarTestID: testIdWithKey(t('TabStack.Credentials')),
          }}
        />
        <Tab.Screen
          name={TabStacks.CredentialStack}
          component={CredentialStack}
          options={{
            tabBarIconStyle: styles.tabBarIcon,
            tabBarIcon: ({ focused }) => (
              <AttachTourStep index={2}>
                <View style={{ ...TabTheme.tabBarContainerStyle, justifyContent: showLabels ? 'flex-end' : 'center' }}>
                  {focused ? <Assets.svg.CredentialIconActive /> : <Assets.svg.Credential />}
                  {showLabels && (
                    <Text
                      style={{
                        ...TabTheme.tabBarTextStyle,
                        color: focused ? TabTheme.tabBarActiveTintColor : TabTheme.tabBarInactiveTintColor,
                      }}>
                      {t('TabStack.Credentials')}
                    </Text>
                  )}
                </View>
              </AttachTourStep>
            ),
            tabBarShowLabel: false,
            tabBarAccessibilityLabel: t('TabStack.Credentials'),
            tabBarTestID: testIdWithKey(t('TabStack.Credentials')),
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  )
}

export default TabStack
