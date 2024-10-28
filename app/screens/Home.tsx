import {
  ConnectionType,
  CredentialExchangeRecord,
  CredentialState,
  DidExchangeState,
  getAllW3cCredentialRecords,
  useAdeyaAgent,
  useConnections,
  useCredentialByState,
  W3cCredentialRecord,
} from '@adeya/ssi'
import { StackScreenProps } from '@react-navigation/stack'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Dimensions, FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'

import HistoryListItem from '../components/History/HistoryListItem'
import { getGenericRecordsByQuery } from '../components/History/HistoryManager'
import { CustomRecord, RecordType } from '../components/History/types'
import ScanButton from '../components/common/ScanButton'
import { CredentialCard } from '../components/misc'
import { useConfiguration } from '../contexts/configuration'
import { useStore } from '../contexts/store'
import { useTheme } from '../contexts/theme'
import { ColorPallet, TextTheme } from '../theme'
import { HomeStackParams, Screens, Stacks, TabStacks } from '../types/navigators'
import { AdeyaAgentModules } from '../utils/agent'
import { isW3CCredential } from '../utils/credential'
import { getDefaultHolderDidDocument } from '../utils/helpers'

const { width } = Dimensions.get('window')
const offset = 25
const offsetPadding = 5

interface EnhancedW3CRecord extends W3cCredentialRecord {
  connectionLabel?: string
}
type HomeProps = StackScreenProps<HomeStackParams, Screens.Home>

const Home: React.FC<HomeProps> = ({ navigation }) => {
  const { agent } = useAdeyaAgent<AdeyaAgentModules>()
  const [connectionCount, setConnectionCount] = useState<number>(0)
  const [credentialCount, setCredentialCount] = useState<number>(0)
  const { t } = useTranslation()
  const { HomeTheme } = useTheme()
  const [store] = useStore()
  const [historyItems, setHistoryItems] = useState<CustomRecord[]>()
  const { credentialListOptions: CredentialListOptions } = useConfiguration()
  const credentials = [
    ...useCredentialByState(CredentialState.CredentialReceived),
    ...useCredentialByState(CredentialState.Done),
  ]
  const [credentialList, setCredentialList] = useState<(CredentialExchangeRecord | EnhancedW3CRecord)[] | undefined>([])
  const { records: connectionRecords } = useConnections()

  useEffect(() => {
    if (!agent) return

    const setupDefaultDid = async () => {
      await getDefaultHolderDidDocument(agent)

      let connectionCount = await agent.connections.findAllByQuery({
        state: DidExchangeState.Completed,
      })
      connectionCount = connectionCount.filter(r => !r.connectionTypes.includes(ConnectionType.Mediator))
      const credentialCount = await agent.credentials.findAllByQuery({
        state: CredentialState.Done,
      })
      setConnectionCount(connectionCount.length)
      setCredentialCount(credentialCount.length)
    }

    setupDefaultDid()
  }, [agent])

  const getHistory = async () => {
    const allRecords = await getGenericRecordsByQuery(agent, { type: RecordType.HistoryRecord })
    allRecords.sort((objA, objB) => Number(objB.content.createdAt) - Number(objA.content.createdAt))

    if (allRecords && allRecords.length) {
      const top5Records = allRecords.slice(0, 5)
      setHistoryItems(top5Records)
    }
  }
  useEffect(() => {
    getHistory()
  }, [])
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
    container: {
      flex: 1,
    },
    rowContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      paddingHorizontal: offset,
    },
    messageContainer: {
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 20,
      height: 250,
      width: 300,
    },
    header: {
      marginTop: offset,
      marginBottom: 20,
    },
    linkContainer: {
      minHeight: HomeTheme.link.fontSize,
      marginTop: 10,
    },
    link: {
      ...HomeTheme.link,
    },
    fabContainer: {
      position: 'absolute',
      bottom: 10,
      right: 10,
    },
    homeImage: {
      height: '85%',
      width: '80%',
    },
    cardView: { flexDirection: 'row', justifyContent: 'center', marginVertical: 20, width: wp('100%') },
    cardContentView: {
      backgroundColor: ColorPallet.brand.primary,
      width: wp('45%'),
      height: 80,
      marginHorizontal: 5,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
      elevation: 3,
      alignContent: 'center',
    },
    countCardText: {
      ...HomeTheme.notificationsHeader,
      color: '#fff',
    },
    cardText: {
      color: '#fff',
      fontSize: 12,
      fontWeight: '900',
      fontStyle: 'normal',
    },
    viewText: {
      ...HomeTheme.notificationsHeader,
      fontSize: 14,
      fontWeight: '500',
      fontStyle: 'normal',
      alignSelf: 'flex-end',
      marginRight: 20,
    },
    historyText: {
      ...HomeTheme.welcomeHeader,
      fontSize: 16,
      fontWeight: 'bold',
      fontStyle: 'normal',
      marginLeft: 20,
    },
    cardBottomBorder: {
      borderBottomWidth: 0.5,
      borderBottomColor: '#A0A4AB',
      marginTop: 10,
    },
    headerView: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignContent: 'center',
      alignItems: 'center',
      marginVertical: 10,
    },
    title: {
      marginTop: 16,
    },
    welcomeText: {
      ...HomeTheme.notificationsHeader,
      fontSize: 24,
      fontWeight: 'bold',
      fontStyle: 'normal',
      marginHorizontal: 20,
      justifyContent: 'center',
      alignContent: 'center',
      alignSelf: 'center',
      paddingVertical: 20,
    },
    credentialsCardList: { flexGrow: 0, marginLeft: 15 },
    renderView: {
      marginRight: 15,
      marginTop: 15,
      width: wp('85%'),
      // marginBottom: index === credentials.length - 1 ? 45 : 0,
    },
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
    favContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      minHeight: 180,
    },
  })

  const renderEmptyListComponent = () => {
    return (
      <View style={{ alignContent: 'center', justifyContent: 'center', alignSelf: 'center' }}>
        <Text style={[styles.title, TextTheme.normal]}>{t('ActivityHistory.NoHistory')}</Text>
      </View>
    )
  }

  const renderHistoryListItem = (item: CustomRecord) => {
    return <HistoryListItem item={item} />
  }
  const renderHistoryView = () => {
    return (
      <View>
        <FlatList
          showsVerticalScrollIndicator={false}
          style={{ flexGrow: 0, paddingHorizontal: 20 }}
          data={historyItems}
          ListEmptyComponent={renderEmptyListComponent}
          renderItem={element => renderHistoryListItem(element.item)}
        />
      </View>
    )
  }
  return (
    <View style={styles.container}>
      <CredentialListOptions />
      <View style={styles.cardView}>
        <TouchableOpacity
          style={styles.cardContentView}
          onPress={() => {
            navigation.navigate(Stacks.ContactStack, { screen: Screens.Contacts, params: { navigation: navigation } })
          }}>
          <Text style={styles.countCardText}>{`${connectionCount}`}</Text>
          <Text style={styles.cardText}>{t('Home.ConnectionsCount')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cardContentView}
          onPress={() => {
            navigation.navigate(TabStacks.CredentialStack, { screen: Screens.Credentials })
          }}>
          <Text style={styles.countCardText}>{`${credentialCount}`}</Text>
          <Text style={styles.cardText}>{t('Home.CredentialsCount')}</Text>
        </TouchableOpacity>
      </View>

      {/* {credentialList && credentialList?.length >0 && */}
      <View style={styles.headerView}>
        <Text style={styles.historyText}>{t('Global.Credentials')}</Text>

        {credentialList && credentialList?.length > 0 && (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate(TabStacks.CredentialStack, { screen: Screens.Credentials })
            }}>
            <Text style={styles.viewText}>{t('Home.ViewAll')}</Text>
          </TouchableOpacity>
        )}
      </View>
      {/* <View style={styles.cardBottomBorder} /> */}
      {/* } */}
      <View style={styles.favContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEnabled={credentialList?.length > 0 ? true : false}
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
          data={credentialList?.sort((a, b) => new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf())}
          keyExtractor={credential => credential.id}
          renderItem={({ item: credential }) => (
            <View style={styles.renderView}>
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
                  schemaId={credential?.credential?.type[1]}
                  connectionLabel={credential?.connectionLabel}
                  credential={credential}
                  onPress={() => navigation.navigate(Screens.CredentialDetailsW3C, { credential: credential })}
                />
              )}
            </View>
          )}
        />
      </View>

      {/* {historyItems && historyItems.length && */}
      <View>
        <View style={styles.headerView}>
          <Text style={styles.historyText}>{t('Global.History')}</Text>
          {historyItems && historyItems.length && (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate(Stacks.HistoryStack, { screen: Screens.HistoryPage })
              }}>
              <Text style={styles.viewText}>{t('Home.ViewAll')}</Text>
            </TouchableOpacity>
          )}
        </View>
        {/* <View style={styles.cardBottomBorder} /> */}
      </View>
      {/* } */}

      <ScrollView>
        {historyItems && historyItems.length && store.preferences.useHistoryCapability ? (
          renderHistoryView()
        ) : (
          <View style={styles.messageContainer}>
            <Image source={require('../assets/img/homeimage.png')} resizeMode="contain" style={styles.homeImage} />
          </View>
        )}
      </ScrollView>

      {/* <Button title="Create did" onPress={createDid} /> */}
      <View style={styles.fabContainer}>
        <ScanButton />
      </View>
    </View>
  )
}

export default Home
