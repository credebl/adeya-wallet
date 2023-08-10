import { CommonActions, useNavigation, useRoute } from '@react-navigation/core'
import React, { useEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'

import { useTheme } from '../contexts/theme'
import { Assets, ColorPallet } from '../theme'
import { Stacks } from '../types/navigators'

const Success: React.FC = () => {
  const { TextTheme } = useTheme()
  const navigation = useNavigation()
  const parms = useRoute()
  const styles = StyleSheet.create({
    container: {
      justifyContent: 'center',
      height: '100%',
      flex: 1,
      alignSelf: 'center',
    },
    labeltext: {
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
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: Stacks.TabStack }],
      }),
    )
  }, [])
  return (
    <View style={styles.container}>
      <Assets.svg.BackupSuccess height={225} width={230} style={{ alignSelf: 'center', alignItems: 'center' }} />
      <Text style={(TextTheme.labelText, styles.labeltext)}>Exported successfully</Text>
      {/* <Text style={styles.namefiletext}>{parms?.params?.encryptedFileLocation}</Text> */}
    </View>
  )
}

export default Success
