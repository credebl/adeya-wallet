// import { useNavigation } from '@react-navigation/core'
import React from 'react'
import { View, StyleSheet } from 'react-native'

import { useTheme } from '../contexts/theme'

const OrganizationConnection: React.FC = () => {
  const { ColorPallet } = useTheme()
  //   const navigation = useNavigation()
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      height: '100%',
    },
    titleText: {
      fontSize: 32,
      fontWeight: '500',
      alignSelf: 'center',
      color: ColorPallet.brand.primary,
      marginTop: 20,
    },
    walletButtonView: {
      marginTop: 'auto',
      margin: 20,
    },
    restoreWalletView: {
      marginTop: 20,
    },
  })
  return <View style={styles.container}></View>
}

export default OrganizationConnection
