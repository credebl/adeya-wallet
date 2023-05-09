import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native'
import * as React from 'react'
import { useEffect, useMemo } from 'react'
import { StatusBar } from 'react-native'
import SplashScreen from 'react-native-splash-screen'
import Toast from 'react-native-toast-message'

import {
  AgentProvider,
  TourProvider,
  homeTourSteps,
  CommonUtilProvider,
  AuthProvider,
  ConfigurationProvider,
  NetworkProvider,
  StoreProvider,
  ThemeProvider,
  theme,
  initLanguages,
  initStoredLanguage,
  translationResources,
  ErrorModal,
  toastConfig,
  RootStack,
  NetInfo,
  defaultConfiguration,
  NavigationTheme,
} from './core/App'

initLanguages(translationResources)

const navigationTheme = {
  ...NavigationTheme,
}

const App = () => {
  useMemo(() => {
    initStoredLanguage().then()
  }, [])

  const navigationRef = useNavigationContainerRef()

  useEffect(() => {
    // Hide the native splash / loading screen so that our
    // RN version can be displayed.
    SplashScreen.hide()
  }, [])

  return (
    <NavigationContainer ref={navigationRef} theme={navigationTheme}>
      <StoreProvider>
        <AgentProvider>
          <ThemeProvider value={theme}>
            <ConfigurationProvider value={defaultConfiguration}>
              <CommonUtilProvider>
                <AuthProvider>
                  <NetworkProvider>
                    <StatusBar
                      hidden={false}
                      barStyle="light-content"
                      backgroundColor={theme.ColorPallet.brand.primary}
                      translucent={false}
                    />
                    <NetInfo />
                    <ErrorModal />
                    <TourProvider steps={homeTourSteps} overlayColor={'gray'} overlayOpacity={0.7}>
                      <RootStack />
                    </TourProvider>
                    <Toast topOffset={15} config={toastConfig} />
                  </NetworkProvider>
                </AuthProvider>
              </CommonUtilProvider>
            </ConfigurationProvider>
          </ThemeProvider>
        </AgentProvider>
      </StoreProvider>
    </NavigationContainer>
  )
}

export default App
