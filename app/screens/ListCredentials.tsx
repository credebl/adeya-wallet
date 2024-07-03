import {
  ClaimFormat,
  JsonTransformer,
  W3cCredentialRecord,
  useCredentialByState,
  CredentialExchangeRecord,
  CredentialState,
  findConnectionById,
  getW3cCredentialRecordById,
} from '@adeya/ssi'
import { useNavigation } from '@react-navigation/core'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, StyleSheet, View } from 'react-native'

import ScanButton from '../components/common/ScanButton'
import CredentialCard from '../components/misc/CredentialCard'
import { useW3cCredentialRecords } from '../contexts/W3cCredentialsProvider'
import { useConfiguration } from '../contexts/configuration'
import { useTheme } from '../contexts/theme'
import { CredentialStackParams, Screens } from '../types/navigators'
import { useAppAgent } from '../utils/agent'
import { isW3CCredential } from '../utils/credential'
import {
  W3cCredentialJson,
  getOpenId4VcCredentialMetadata,
  getW3cCredentialDisplay,
  getW3cIssuerDisplay,
} from '../utils/helpers'

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
  const { t } = useTranslation()
  const { agent } = useAppAgent()
  const { credentialListOptions: CredentialListOptions, credentialEmptyList: CredentialEmptyList } = useConfiguration()
  const { w3cCredentialRecords } = useW3cCredentialRecords()

  // Skipping indy credentials as we get them in credential exchange records
  const w3cCredentialRecordsList = w3cCredentialRecords.filter(
    credential => !credential.credential.issuerId.includes('did:indy'),
  )

  const credentials = [
    ...useCredentialByState(CredentialState.CredentialReceived),
    ...useCredentialByState(CredentialState.Done),
    ...w3cCredentialRecordsList,
  ]
  const [credentialList, setCredentialList] = useState<(CredentialExchangeRecord | EnhancedW3CRecord)[] | undefined>([])

  const navigation = useNavigation<StackNavigationProp<CredentialStackParams>>()
  const { ColorPallet } = useTheme()

  useEffect(() => {
    const updateCredentials = async () => {
      if (!agent) {
        return
      }

      const updatedCredentials = await Promise.all(
        credentials.map(async credential => {
          if (credential instanceof W3cCredentialRecord) {
            return credential
          }

          if (isW3CCredential(credential)) {
            const credentialRecordId = credential.credentials[0].credentialRecordId
            try {
              const record = await getW3cCredentialRecordById(agent, credentialRecordId)
              if (!credential?.connectionId) {
                throw new Error('Connection Id notfound')
              }
              const connection = await findConnectionById(agent, credential?.connectionId)
              const enhancedRecord = record as EnhancedW3CRecord
              enhancedRecord.connectionLabel = connection?.theirLabel
              return enhancedRecord
            } catch (e: unknown) {
              throw new Error(`${e}`)
            }
          }
          return credential
        }),
      )
      return updatedCredentials
    }

    updateCredentials().then(updatedCredentials => {
      setCredentialList(updatedCredentials)
    })
  }, [])

  const getCredentialDisplay = (credential: CredentialExchangeRecord | W3cCredentialRecord | EnhancedW3CRecord) => {
    const openId4VcMetadata = getOpenId4VcCredentialMetadata(credential as W3cCredentialRecord)

    if (credential instanceof CredentialExchangeRecord) {
      return (
        <CredentialCard
          credential={credential}
          onPress={() =>
            navigation.navigate(Screens.CredentialDetails, {
              credential: credential as CredentialExchangeRecord,
            })
          }
        />
      )
    } else if (openId4VcMetadata) {
      const credentialRecord = JsonTransformer.toJSON(
        (credential as W3cCredentialRecord).credential.claimFormat === ClaimFormat.JwtVc
          ? credential.credential.credential
          : credential.credential,
      ) as W3cCredentialJson

      const issuerDisplay = getW3cIssuerDisplay(credentialRecord, openId4VcMetadata)
      const credentialDisplay = getW3cCredentialDisplay(credentialRecord, openId4VcMetadata)
      return (
        <CredentialCard
          schemaId={credentialDisplay.name}
          connectionLabel={issuerDisplay.name}
          credential={credential}
          onPress={() => navigation.navigate(Screens.CredentialDetailsW3C, { credential: credential })}
        />
      )
    } else {
      return (
        <CredentialCard
          schemaId={credential.credential.type[1]}
          connectionLabel={credential.connectionLabel}
          credential={credential}
          onPress={() => navigation.navigate(Screens.CredentialDetailsW3C, { credential: credential })}
        />
      )
    }
  }

  return (
    <View style={styles.container}>
      <FlatList
        style={{ backgroundColor: ColorPallet.brand.primaryBackground }}
        data={credentialList?.sort((a, b) => new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf())}
        keyExtractor={credential => credential.id}
        renderItem={({ item: credential, index }) => {
          return (
            <View
              style={{
                marginHorizontal: 15,
                marginTop: 15,
                marginBottom: index === credentials.length - 1 ? 45 : 0,
              }}>
              {getCredentialDisplay(credential)}
            </View>
          )
        }}
        ListEmptyComponent={() => <CredentialEmptyList message={t('Credentials.EmptyCredentailsList')} />}
      />
      <CredentialListOptions />
      <View style={styles.scanContainer}>
        <ScanButton />
      </View>
    </View>
  )
}

export default ListCredentials
