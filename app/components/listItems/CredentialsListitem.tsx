import { CredentialExchangeRecord, W3cCredentialRecord } from '@adeya/ssi'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Dimensions, FlatList, StyleSheet, Text, View } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'

import { CredentialCard } from '../misc'

interface EnhancedW3CRecord extends W3cCredentialRecord {
  connectionLabel?: string
}
interface Props {
  credentialList: (CredentialExchangeRecord | EnhancedW3CRecord)[] | undefined
  isHorizontal?: boolean
  onPress: (credential: CredentialExchangeRecord) => void
}

const { width } = Dimensions.get('window')
const offset = 25
const offsetPadding = 5

const CredentialsListItem: React.FC<Props> = ({ credentialList, isHorizontal = false, onPress }) => {
  const { t } = useTranslation()

  const styles = StyleSheet.create({
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
      style={styles.credentialsCardList}
      snapToOffsets={[
        0,
        ...Array(credentialList?.length)
          .fill(0)
          .map((n: number, i: number) => i * (width - 2 * (offset - offsetPadding)))
          .slice(1),
      ]}
      decelerationRate="fast"
      ListEmptyComponent={() => (
        <View style={styles.noFavContainer}>
          <Text style={styles.noFav}>{t('Home.DontHaveCredentials')}</Text>
        </View>
      )}
      data={credentialList}
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
