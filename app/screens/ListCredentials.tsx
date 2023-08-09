import { CredentialExchangeRecord, CredentialState, W3cCredentialRecord } from '@aries-framework/core'
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
import { isW3CCredential } from '../utils/credential'

const ListCredentials: React.FC = () => {
  const { t } = useTranslation()
  const { agent } = useAgent()
  const { credentialListOptions: CredentialListOptions, credentialEmptyList: CredentialEmptyList } = useConfiguration()
  const credentials = [
    ...useCredentialByState(CredentialState.CredentialReceived),
    ...useCredentialByState(CredentialState.Done),
  ]
  const [credentialList, setCredentialList] = useState<(CredentialExchangeRecord | W3cCredentialRecord)[] | undefined>(
    [],
  )

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
              const record = await agent.w3cCredentials.getCredentialRecordById(credentialRecordId)
              return record
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
                  connectionLabel={credential.credential.issuerId}
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
    </View>
  )
}

export default ListCredentials
