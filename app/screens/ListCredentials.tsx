import type { W3cCredentialRecord } from '@adeya/ssi'

import {
  CredentialExchangeRecord,
  CredentialState,
  getAllW3cCredentialRecords,
  useConnections,
  useCredentialByState,
} from '@adeya/ssi'
import { useNavigation } from '@react-navigation/core'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'

import ScanButton from '../components/common/ScanButton'
import CredentialsListItem from '../components/listItems/CredentialsListitem'
import { useConfiguration } from '../contexts/configuration'
import { CredentialStackParams, Screens } from '../types/navigators'
import { useAppAgent } from '../utils/agent'
import { isW3CCredential } from '../utils/credential'

interface EnhancedW3CRecord extends W3cCredentialRecord {
  connectionLabel?: string
}
const styles = StyleSheet.create({
  container: { flex: 1 },
  scanContainer: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
})

const ListCredentials: React.FC = () => {
  const { agent } = useAppAgent()
  const { credentialListOptions: CredentialListOptions } = useConfiguration()
  const credentials = [
    ...useCredentialByState(CredentialState.CredentialReceived),
    ...useCredentialByState(CredentialState.Done),
  ]
  const [credentialList, setCredentialList] = useState<(CredentialExchangeRecord | EnhancedW3CRecord)[] | undefined>([])
  const { records: connectionRecords } = useConnections()

  const navigation = useNavigation<StackNavigationProp<CredentialStackParams>>()

  useEffect(() => {
    const updateCredentials = async () => {
      if (!agent) {
        return
      }

      const w3cCredentialRecords = await getAllW3cCredentialRecords(agent)

      const updatedCredentials = credentials.map(credential => {
        if (isW3CCredential(credential)) {
          const credentialRecordId = credential.credentials[0].credentialRecordId
          try {
            const record = w3cCredentialRecords.find(record => record.id === credentialRecordId)
            if (!credential?.connectionId) {
              throw new Error('Connection Id notfound')
            }
            const connection = connectionRecords.find(connection => connection.id === credential?.connectionId)
            const enhancedRecord = record as EnhancedW3CRecord
            enhancedRecord.connectionLabel = connection?.theirLabel
            return enhancedRecord
          } catch (e: unknown) {
            throw new Error(`${e}`)
          }
        }
        return credential
      })
      return updatedCredentials
    }

    updateCredentials().then(updatedCredentials => {
      setCredentialList(updatedCredentials)
    })
  }, [credentials])

  return (
    <View style={styles.container}>
      <CredentialsListItem
        credentialList={credentialList?.sort(
          (a, b) => new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf(),
        )}
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
