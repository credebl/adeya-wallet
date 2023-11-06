import { useNavigation } from '@react-navigation/core'
import React from 'react'
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native'

import { useNetwork } from '../../contexts/network'
import { Screens, Stacks } from '../../types/navigators'

const ScanButton: React.FC = () => {
  const navigation = useNavigation()
  const { assertConnectedNetwork } = useNetwork()
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'flex-end',
      marginTop: 'auto',
    },
    imageContainer: {
      width: 81,
      height: 81,
    },
  })
  const navigateToconnect = e => {
    e.preventDefault()
    if (!assertConnectedNetwork()) {
      return
    }

    navigation.navigate(Stacks.ConnectStack, { screen: Screens.Scan })
  }
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={e => navigateToconnect(e)}>
        <Image style={styles.imageContainer} source={require('../../assets/img/Scanbutton.png')} />
      </TouchableOpacity>
    </View>
  )
}

export default ScanButton
