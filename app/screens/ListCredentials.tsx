import { CredentialExchangeRecord } from '@adeya/ssi'
import { useNavigation } from '@react-navigation/core'
import { StackNavigationProp } from '@react-navigation/stack'
import React from 'react'
import { StyleSheet, View } from 'react-native'

import ScanButton from '../components/common/ScanButton'
import CredentialsListItem from '../components/listItems/CredentialsListitem'
import { useConfiguration } from '../contexts/configuration'
import { CredentialStackParams, Screens } from '../types/navigators'

const styles = StyleSheet.create({
  container: { flex: 1 },
  scanContainer: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
})

const ListCredentials: React.FC = () => {
  const { credentialListOptions: CredentialListOptions } = useConfiguration()
  const navigation = useNavigation<StackNavigationProp<CredentialStackParams>>()

  return (
    <View style={styles.container}>
      <CredentialsListItem
        onPress={credential => {
          credential instanceof CredentialExchangeRecord
            ? navigation.navigate(Screens.CredentialDetails, {
                credential: credential as CredentialExchangeRecord,
              })
            : navigation.navigate(Screens.CredentialDetailsW3C, { credential: credential })
        }}
      />
      <CredentialListOptions />
      <View style={styles.scanContainer}>
        <ScanButton />
      </View>
    </View>
  )
}

export default ListCredentials
