import type { W3cCredentialRecord } from '@adeya/ssi'

import {
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
import { heightPercentageToDP } from 'react-native-responsive-screen'

import ScanButton from '../components/common/ScanButton'
import CredentialCard from '../components/misc/CredentialCard'
import { useConfiguration } from '../contexts/configuration'
import { useTheme } from '../contexts/theme'
import { CredentialStackParams, Screens } from '../types/navigators'
import { useAppAgent } from '../utils/agent'
import { isW3CCredential } from '../utils/credential'

interface EnhancedW3CRecord extends W3cCredentialRecord {
  connectionLabel?: string
}
const style = StyleSheet.create({
  fabConatiner: {
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
    position: 'absolute',

    flex: 1,
    top: heightPercentageToDP('73%'),
    zIndex: 1,
  },
})

const ListCredentials: React.FC = () => {
  const { t } = useTranslation()
  const { agent } = useAppAgent()
  const { credentialListOptions: CredentialListOptions, credentialEmptyList: CredentialEmptyList } = useConfiguration()
  const credentials = [
    ...useCredentialByState(CredentialState.CredentialReceived),
    ...useCredentialByState(CredentialState.Done),
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

  return (
    <View>
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
              {credential instanceof CredentialExchangeRecord ? (
                <CredentialCard
                  credential={credential}
                  onPress={() =>
                    navigation.navigate(Screens.CredentialDetails, {
                      credential: credential as CredentialExchangeRecord,
                    })
                  }
                />
              ) : (
                <CredentialCard
                  schemaId={credential.credential.type[1]}
                  connectionLabel={credential.connectionLabel}
                  credential={credential}
                  onPress={() => navigation.navigate(Screens.CredentialDetailsW3C, { credential: credential })}
                />
              )}
            </View>
          )
        }}
        ListEmptyComponent={() => <CredentialEmptyList message={t('Credentials.EmptyList')} />}
      />
      <CredentialListOptions />
      <View style={style.fabConatiner}>
        <ScanButton />
      </View>
    </View>
  )
}

export default ListCredentials
