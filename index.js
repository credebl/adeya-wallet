import './shim'
import 'react-native-get-random-values'
import 'react-native-gesture-handler'
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native'
import * as React from 'react'
import { AppRegistry, LogBox } from 'react-native'

import App from './App.tsx'
import { NavigationTheme } from './app/theme.ts'
import { name as appName } from './app.json'

const navigationTheme = {
  ...NavigationTheme,
}

LogBox.ignoreAllLogs()

const Base = () => {
  const navigationRef = useNavigationContainerRef()
  return (
    <NavigationContainer ref={navigationRef} theme={navigationTheme}>
      <App />
    </NavigationContainer>
  )
}

AppRegistry.registerComponent(appName, () => Base)
