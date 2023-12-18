import { StackScreenProps } from '@react-navigation/stack'
import React, { ReactNode } from 'react'
import { FlatList, StyleSheet, View, Dimensions, Image } from 'react-native'

import ScanButton from '../components/common/ScanButton'
import NotificationListItem, { NotificationType } from '../components/listItems/NotificationListItem'
import NoNewUpdates from '../components/misc/NoNewUpdates'
import { useConfiguration } from '../contexts/configuration'
import { useTheme } from '../contexts/theme'
import { HomeStackParams, Screens } from '../types/navigators'

const { width } = Dimensions.get('window')
const offset = 10
const offsetPadding = 5

type HomeProps = StackScreenProps<HomeStackParams, Screens.Home>

const Home: React.FC<HomeProps> = () => {
  const { useCustomNotifications } = useConfiguration()
  const { notifications } = useCustomNotifications()
  // This syntax is required for the jest mocks to work
  // eslint-disable-next-line import/no-named-as-default-member
  const { HomeTheme } = useTheme()

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
      bottom: 1,
      alignSelf: 'center',
    },
    homeImage: {
      height: '85%',
      width: '80%',
    },
  })

  const DisplayListItemType = (item: any): ReactNode => {
    let component: ReactNode = <View style={{ backgroundColor: 'red', height: 30 }} />
    if (item.type === 'CredentialRecord') {
      let notificationType = NotificationType.CredentialOffer
      if (item.revocationNotification) {
        notificationType = NotificationType.Revocation
      }
      component = <NotificationListItem notificationType={notificationType} notification={item} />
    } else if (item.type === 'CustomNotification') {
      component = <NotificationListItem notificationType={NotificationType.Custom} notification={item} />
    } else {
      component = <NotificationListItem notificationType={NotificationType.ProofRequest} notification={item} />
    }
    return component
  }

  return (
    <View style={styles.container}>
      <View style={{ marginTop: 20 }}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEnabled={notifications?.length > 0 ? true : false}
          style={{ flexGrow: 0 }}
          snapToOffsets={[
            0,
            ...Array(notifications?.length)
              .fill(0)
              .map((n: number, i: number) => i * (width - 2 * (offset - offsetPadding)))
              .slice(1),
          ]}
          decelerationRate="fast"
          ListEmptyComponent={() => (
            <View style={{ marginHorizontal: offset, width: width - 2 * offset }}>
              <View>
                <NoNewUpdates />
              </View>
            </View>
          )}
          data={notifications}
          keyExtractor={item => item.id}
          renderItem={({ item, index }) => (
            <View
              style={{
                width: width - 2 * offset,
                marginLeft: !index ? offset : offsetPadding,
                marginRight: index === notifications?.length - 1 ? offset : offsetPadding,
              }}>
              {DisplayListItemType(item)}
            </View>
          )}
        />
      </View>
      <View style={styles.messageContainer}>
        <Image source={require('../assets/img/homeimage.png')} resizeMode="contain" style={styles.homeImage} />
      </View>
      <View style={styles.fabContainer}>
        <ScanButton />
      </View>
    </View>
  )
}

export default Home
