import {
  CredentialExchangeRecord,
  CredentialRecordBinding,
  CredentialState,
  W3cCredentialRecord,
  W3cCredentialService,
} from '@aries-framework/core'
import { useAgent, useCredentialByState } from '@aries-framework/react-hooks'
import { useNavigation } from '@react-navigation/core'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, View } from 'react-native'

import CredentialCard from '../components/misc/CredentialCard'
import { useConfiguration } from '../contexts/configuration'
import { useTheme } from '../contexts/theme'
import { CredentialStackParams, Screens } from '../types/navigators'

export interface ModifiedW3cCredentialRecord extends W3cCredentialRecord {
  credentials: CredentialRecordBinding[]
}

const ListCredentials: React.FC = () => {
  const { t } = useTranslation()
  const { agent } = useAgent()
  const { credentialListOptions: CredentialListOptions, credentialEmptyList: CredentialEmptyList } = useConfiguration()
  const credentials = [
    ...useCredentialByState(CredentialState.CredentialReceived),
    ...useCredentialByState(CredentialState.Done),
  ]
  const [credentialList, setCredentialList] = useState<
    (CredentialExchangeRecord | ModifiedW3cCredentialRecord)[] | undefined
  >([])

  const navigation = useNavigation<StackNavigationProp<CredentialStackParams>>()
  const { ColorPallet } = useTheme()

  useEffect(() => {
    const updateCredentials = async () => {
      if (!agent) {
        return
      }
      const w3cCredentialService = await agent.dependencyManager.resolve(W3cCredentialService)

      const updatedCredentials = await Promise.all(
        credentials.map(async credential => {
          if (credential.credentials[0].credentialRecordType == 'w3c') {
            const credentialRecordId = credential.credentials[0].credentialRecordId

            try {
              const record = await w3cCredentialService.getCredentialRecordById(agent.context, credentialRecordId)
              return {
                ...record,
                credentials: credential.credentials,
              } as ModifiedW3cCredentialRecord
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
              {credential.credentials[0].credentialRecordType == 'anoncreds' ||
              credential.credentials[0].credentialRecordType == 'indy' ? (
                <CredentialCard
                  credential={credential as CredentialExchangeRecord}
                  onPress={() =>
                    navigation.navigate(Screens.CredentialDetails, {
                      credential: credential as CredentialExchangeRecord,
                    })
                  }
                />
              ) : (
                <CredentialCard
                  schemaId={(credential as ModifiedW3cCredentialRecord).credential.type[1] as string}
                  onPress={() => navigation.navigate(Screens.CredentialDetailsJSONLD, { credential: credential })}
                />
              )}
            </View>
          )
        }}
        ListEmptyComponent={() => <CredentialEmptyList message={t('Credentials.EmptyList')} />}
      />
      <CredentialListOptions />
    </View>
  )
}

export default ListCredentials
