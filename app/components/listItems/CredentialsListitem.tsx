import {
  CredentialExchangeRecord,
  CredentialState,
  getAllW3cCredentialRecords,
  useAdeyaAgent,
  useConnections,
  useCredentialByState,
  W3cCredentialRecord,
} from '@adeya/ssi'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Dimensions, FlatList, StyleSheet, Text, View } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'

import { useConfiguration } from '../../contexts/configuration'
import { AdeyaAgentModules } from '../../utils/agent'
import { isW3CCredential } from '../../utils/credential'
import { CredentialCard } from '../misc'

interface EnhancedW3CRecord extends W3cCredentialRecord {
  connectionLabel?: string
}
interface Props {
  isHorizontal?: boolean
  onPress: (credential: CredentialExchangeRecord) => void
}

const { width } = Dimensions.get('window')
const offset = 25
const offsetPadding = 5

const CredentialsListItem: React.FC<Props> = ({ isHorizontal = false, onPress }) => {
  const { t } = useTranslation()
  const { agent } = useAdeyaAgent<AdeyaAgentModules>()

  const credentials = [
    ...useCredentialByState(CredentialState.CredentialReceived),
    ...useCredentialByState(CredentialState.Done),
  ]
  const [credentialList, setCredentialList] = useState<(CredentialExchangeRecord | EnhancedW3CRecord)[] | undefined>([])
  const { records: connectionRecords } = useConnections()
  const { credentialEmptyList: CredentialEmptyList } = useConfiguration()

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
      setCredentialList(updatedCredentials?.slice(-3, 3))
    })
  }, [credentials])

  const styles = StyleSheet.create({
    credentialList: { flexGrow: 0 },
    credentialsCardList: { flexGrow: 0, marginLeft: 15 },
    noFavContainer: {
      flexDirection: 'column',
      justifyContent: 'center',
      width: wp('95%'),
    },
    noFav: {
      fontWeight: '700',
      fontSize: 24,
      textAlign: 'center',
    },
    renderView: {
      marginRight: 15,
      marginTop: 15,
      width: isHorizontal ? wp('85%') : 'auto',
    },
  })

  return (
    <FlatList
      horizontal={isHorizontal}
      showsHorizontalScrollIndicator={false}
      scrollEnabled={!!credentialList?.length}
      style={isHorizontal ? styles.credentialsCardList : styles.credentialList}
      snapToOffsets={[
        0,
        ...Array(credentialList?.length)
          .fill(0)
          .map((n: number, i: number) => i * (width - 2 * (offset - offsetPadding)))
          .slice(1),
      ]}
      decelerationRate="fast"
      ListEmptyComponent={
        <View>
          {!isHorizontal ? (
            <CredentialEmptyList message={t('Credentials.EmptyCredentailsList')} />
          ) : (
            <View style={styles.noFavContainer}>
              <Text style={styles.noFav}>{t('Home.DontHaveCredentials')}</Text>
            </View>
          )}
        </View>
      }
      data={credentialList?.sort((a, b) => new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf())}
      keyExtractor={credential => credential?.id}
      renderItem={({ item: credential }) => (
        <View style={styles.renderView}>
          {credential instanceof CredentialExchangeRecord ? (
            <CredentialCard credential={credential} onPress={() => onPress(credential)} />
          ) : (
            <CredentialCard
              schemaId={credential?.credential?.type[1]}
              connectionLabel={credential?.connectionLabel}
              credential={credential}
              onPress={() => onPress(credential)}
            />
          )}
        </View>
      )}
    />
  )
}

export default CredentialsListItem
