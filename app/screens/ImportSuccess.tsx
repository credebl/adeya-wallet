import { CommonActions, useNavigation } from '@react-navigation/core'
import React, { useEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'

import { useTheme } from '../contexts/theme'
import { Assets } from '../theme'
import { Screens } from '../types/navigators'

const ImportSuccess: React.FC = () => {
  const { TextTheme } = useTheme()
  const navigation = useNavigation()
  const styles = StyleSheet.create({
    container: {
      justifyContent: 'center',
      height: '100%',
      flex: 1,
      alignSelf: 'center',
    },
    labelText: {
      alignSelf: 'center',
      padding: 20,
      fontSize: 20,
    },
  })

  useEffect(() => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: Screens.Credentials }],
      }),
    )
  })
  return (
    <View style={styles.container}>
      <Assets.svg.BackupSuccess height={225} width={230} />
      <Text style={(TextTheme.labelText, styles.labelText)}>Wallet Restored successfully</Text>
    </View>
  )
}

export default ImportSuccess
