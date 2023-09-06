import { CommonActions, useNavigation, useRoute, RouteProp } from '@react-navigation/core'
import React, { useEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'

import { useTheme } from '../contexts/theme'
import { Assets, ColorPallet } from '../theme'
import { Stacks } from '../types/navigators'

interface SuccessProps {
  encryptedFileLocation: string
}

const Success: React.FC<SuccessProps> = () => {
  const { TextTheme } = useTheme()
  const params = useRoute<RouteProp<Record<string, SuccessProps>, string>>().params
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
      color: ColorPallet.brand.primary,
    },
    namefiletext: {
      alignSelf: 'center',
      margin: 20,
      fontSize: 20,
      color: ColorPallet.brand.primary,
    },
  })

  useEffect(() => {
    const delay = 5000
    const timeoutId = setTimeout(() => {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: Stacks.TabStack }],
        }),
      )
    }, delay)
    return () => {
      clearTimeout(timeoutId)
    }
  }, [])

  return (
    <View style={styles.container}>
      <Assets.svg.BackupSuccess height={225} width={230} style={{ alignSelf: 'center', alignItems: 'center' }} />
      <Text style={[TextTheme.labelText, styles.labelText]}>Exported successfully</Text>
      <Text style={styles.namefiletext}>{params?.encryptedFileLocation}</Text>
    </View>
  )
}

export default Success
