import { StackScreenProps } from '@react-navigation/stack'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DeviceEventEmitter, FlatList, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import RecordLoading from '../components/animated/RecordLoading'
import { CredentialCard } from '../components/misc'
import { EventTypes } from '../constants'
import { useTheme } from '../contexts/theme'
import { useAllCredentialsForProof } from '../hooks/proofs'
import { BifoldError } from '../types/error'
import { ProofRequestsStackParams, Screens } from '../types/navigators'
import { ProofCredentialItems } from '../types/proof-items'
import { testIdWithKey } from '../utils/testable'

type ProofChangeProps = StackScreenProps<ProofRequestsStackParams, Screens.ProofChangeCredential>

const ProofChangeCredentialW3C: React.FC<ProofChangeProps> = ({ route, navigation }) => {
  if (!route?.params) {
    throw new Error('Change credential route params were not set properly')
  }
  const proofId = route.params.proofId
  const selectedCred = route.params.selectedCred
  const altCredentials = route.params.altCredentials
  const onCredChange = route.params.onCredChange
  const { ColorPallet, TextTheme } = useTheme()
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [proofItems, setProofItems] = useState<ProofCredentialItems[]>([])
  const credProofPromise = useAllCredentialsForProof(proofId)
  const styles = StyleSheet.create({
    pageContainer: {
      flex: 1,
    },
    pageMargin: {
      marginHorizontal: 20,
    },
    cardLoading: {
      backgroundColor: ColorPallet.brand.secondaryBackground,
      flex: 1,
      flexGrow: 1,
      marginVertical: 35,
      borderRadius: 15,
      paddingHorizontal: 10,
    },
    selectedCred: {
      borderWidth: 5,
      borderRadius: 15,
      borderColor: ColorPallet.semantic.focus,
    },
  })

  useEffect(() => {
    setLoading(true)

    credProofPromise
      ?.then(value => {
        if (value) {
          const { groupedProof } = value
          setLoading(false)

          const activeCreds = groupedProof.filter(proof => altCredentials.includes(proof.credId))

          setProofItems(activeCreds)
        }
      })
      .catch((err: unknown) => {
        const error = new BifoldError(
          t('Error.Title1026'),
          t('Error.Message1026'),
          (err as Error)?.message ?? err,
          1026,
        )
        DeviceEventEmitter.emit(EventTypes.ERROR_ADDED, error)
      })
  }, [])

  const listHeader = () => {
    return (
      <View style={{ ...styles.pageMargin, marginVertical: 20 }}>
        {loading ? (
          <View style={styles.cardLoading}>
            <RecordLoading />
          </View>
        ) : (
          <Text style={TextTheme.normal}>{t('ProofRequest.MultipleCredentials')}</Text>
        )}
      </View>
    )
  }

  const changeCred = (credId: string) => {
    onCredChange(credId)
    navigation.goBack()
  }

  return (
    <SafeAreaView style={styles.pageContainer} edges={['bottom', 'left', 'right']}>
      <FlatList
        data={proofItems}
        ListHeaderComponent={listHeader}
        renderItem={({ item }) => {
          return (
            <View style={styles.pageMargin}>
              <View
                testID={testIdWithKey(`select:${item.credId}`)}
                style={[item.credId === selectedCred ? styles.selectedCred : {}, { marginBottom: 10 }]}>
                <CredentialCard
                  credential={item.credExchangeRecord}
                  credDefId={item.credDefId}
                  schemaId={item.schemaId}
                  displayItems={[...(item.attributes ?? [])]}
                  credName={item.credName}
                  existsInWallet={true}
                  satisfiedPredicates={true}
                  proof={true}
                  onPress={() => changeCred(item.credId ?? '')}
                />
              </View>
            </View>
          )
        }}></FlatList>
    </SafeAreaView>
  )
}

export default ProofChangeCredentialW3C
