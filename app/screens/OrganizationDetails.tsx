import { useConnections } from '@adeya/ssi'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/core'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View, StyleSheet, Text, Image, ScrollView } from 'react-native'
import Toast from 'react-native-toast-message'

import useOrganizationDetailData from '../api/organizationDetailHelper'
import Button, { ButtonType } from '../components/buttons/Button'
import { ToastType } from '../components/toast/BaseToast'
import { useTheme } from '../contexts/theme'
import { BifoldError } from '../types/error'
import { Screens, Stacks } from '../types/navigators'
import { useAppAgent } from '../utils/agent'
import { connectFromInvitation, getJson, getUrl, receiveMessageFromUrlRedirect } from '../utils/helpers'
import { testIdWithKey } from '../utils/testable'

interface OrganizationDetailProps {
  name: string
  description: string
  logoUrl: string
  orgSlug: string
}

const OrganizationDetails: React.FC = () => {
  const { ColorPallet, ListItems, TextTheme } = useTheme()
  const { agent } = useAppAgent()
  const navigation = useNavigation()
  const { t } = useTranslation()
  const params = useRoute<RouteProp<Record<string, OrganizationDetailProps>, string>>().params
  const [containerHeight, setContainerHeight] = useState(100)
  const { organizationDetailData, credentialDetailData } = useOrganizationDetailData(params?.orgSlug)
  const { records } = useConnections()
  const connections = records
  const orglabel = connections?.map(item => item.theirLabel)
  const isOrgLabelIncluded = orglabel.includes(params?.name)
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      height: '100%',
      margin: '2.5%',
    },

    headerTextView: {
      justifyContent: 'center',
      alignSelf: 'center',
    },
    titleText: {
      fontSize: 20,
      fontWeight: '400',
      alignSelf: 'center',
      color: ColorPallet.brand.primary,
      marginTop: 5,
    },
    avatarContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      width: 80,
      height: 80,
      borderRadius: 40,
      borderColor: ListItems.avatarCircle.borderColor,
      borderWidth: 1,
      flexDirection: 'row',
      marginLeft: 20,
    },
    descriptionlabel: {
      marginLeft: 20,
      marginTop: 10,
    },
    orgHeaderText: {
      fontSize: 17,
      color: ColorPallet.brand.primary,
      fontWeight: '700',
    },
    avatarOrgImage: {
      alignItems: 'center',
      justifyContent: 'center',
      width: 80,
      height: 80,
      borderRadius: 40,
      borderColor: ListItems.avatarCircle.borderColor,
      borderWidth: 1,
    },
    orgNameContainner: {
      height: containerHeight,
      width: '100%',
      margin: 10,
      flexShrink: 0,
      borderWidth: 1,
      borderRadius: 10,
      borderColor: ColorPallet.brand.primaryLight,
      alignSelf: 'center',
      justifyContent: 'center',
      marginVertical: 20,
      backgroundColor: ColorPallet.brand.secondaryBackground,
    },
    orgDescriptionContainner: {
      height: containerHeight,
      width: '100%',
      margin: 10,
      flexShrink: 0,
      borderWidth: 1,
      borderRadius: 10,
      borderColor: ColorPallet.brand.primaryLight,
      alignSelf: 'center',
      backgroundColor: ColorPallet.brand.secondaryBackground,
    },
    credentialContainner: {
      height: containerHeight,
      width: '100%',
      margin: 10,
      flexShrink: 0,
      borderWidth: 1,
      borderRadius: 10,
      borderColor: ColorPallet.brand.primaryLight,
      alignSelf: 'center',
      backgroundColor: ColorPallet.brand.secondaryBackground,
    },
    labeltext: {
      justifyContent: 'center',
      marginTop: 10,
      marginLeft: 20,
      fontSize: 16,
    },
    avatarOrgPlaceholder: {
      ...TextTheme.headingFour,
    },
    orgContainer: {
      marginTop: 20,
      marginLeft: 10,
      marginRight: 5,
      fontWeight: '600',
      color: ColorPallet.brand.primary,
      fontSize: 17,
    },
    button: {
      margin: 20,
      flex: 1,
      justifyContent: 'flex-end',
    },
    credLabel: {
      fontSize: 18,
      fontWeight: '600',
      width: '90%',
      marginHorizontal: 10,
      marginBottom: 10,
    },
    orgLabelContainer: { width: '75%' },
    credContainer: {
      flexDirection: 'column',
    },
  })
  const organaizationLabelAbbr = useMemo(() => params?.name?.charAt(0).toUpperCase(), [params])
  const handleInvitation = async (value: string): Promise<void> => {
    try {
      const { connectionRecord } = await connectFromInvitation(agent, value)

      navigation.getParent()?.navigate(Stacks.ConnectionStack, {
        screen: Screens.Connection,
        params: { connectionId: connectionRecord?.id },
      })
    } catch (err: unknown) {
      try {
        const json = getJson(value)
        if (json) {
          await agent?.receiveMessage(json)
          navigation.getParent()?.navigate(Stacks.ConnectionStack, {
            screen: Screens.Connection,
            params: { threadId: json['@id'] },
          })
          return
        }
        const url = getUrl(value)
        if (url) {
          const message = await receiveMessageFromUrlRedirect(value, agent)
          navigation.getParent()?.navigate(Stacks.ConnectionStack, {
            screen: Screens.Connection,
            params: { threadId: message['@id'] },
          })
          return
        }
      } catch (err: unknown) {
        const error = new BifoldError(t('Error.Title1031'), t('Error.Message1031'), (err as Error).message, 1031)
        throw error
      }
    }
  }
  const connectOrganization = async () => {
    if (isOrgLabelIncluded) {
      Toast.show({
        type: ToastType.Error,
        text1: 'You are already connected with organization',
      })
    } else {
      try {
        const agentInvitations = organizationDetailData.map(item => item?.agent_invitations)

        if (!agentInvitations || agentInvitations.length === 0) {
          Toast.show({
            type: ToastType.Error,
            text1: 'No agent invitations available',
          })
          return
        }

        const lastArray = agentInvitations[0]

        if (!lastArray || lastArray.length === 0) {
          Toast.show({
            type: ToastType.Error,
            text1: 'No connection invitations available',
          })
          return
        }

        const lastItem = lastArray[lastArray.length - 1]

        if (!lastItem?.connectionInvitation) {
          Toast.show({
            type: ToastType.Error,
            text1: 'No last connection invitation available',
          })
          return
        }

        const lastConnectionInvitation = lastItem.connectionInvitation
        await handleInvitation(lastConnectionInvitation)
      } catch (error) {
        Toast.show({
          type: ToastType.Error,
          text1: 'No agent invitations available',
        })
      }
    }
  }
  const setDynamicHeight = () => {
    if (credentialDetailData.length > 2) {
      const calculatedHeight = credentialDetailData.length * 50
      setContainerHeight(calculatedHeight)
    }
  }
  return (
    <View style={styles.container}>
      <View style={styles.headerTextView}>
        <Text style={styles.titleText}>{t('Organizations.TitleDetail')}</Text>
      </View>
      <View style={{ margin: 3 }}>
        <View onLayout={setDynamicHeight} style={styles.orgNameContainner}>
          <View style={{ flexDirection: 'row' }}>
            <View style={styles.avatarContainer}>
              {params?.logoUrl ? (
                <Image style={styles.avatarOrgImage} source={{ uri: params.logoUrl }} />
              ) : (
                <Text style={styles.avatarOrgPlaceholder}>{organaizationLabelAbbr}</Text>
              )}
            </View>
            <View style={styles.orgLabelContainer}>
              <Text style={styles.orgContainer} numberOfLines={7}>
                {params?.name}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.orgDescriptionContainner}>
          <View>
            <View style={styles.descriptionlabel} onLayout={setDynamicHeight}>
              <Text style={styles.orgHeaderText}>About Organization</Text>
            </View>
            <Text style={styles.labeltext} numberOfLines={4}>
              {params?.description}
            </Text>
          </View>
        </View>
        {credentialDetailData.length > 0 && (
          <ScrollView showsHorizontalScrollIndicator={false} style={styles.credentialContainner}>
            <View>
              <View style={styles.descriptionlabel}>
                <Text style={styles.orgHeaderText}>Available Credentials</Text>
              </View>
              <View style={styles.credContainer}>
                <ScrollView onLayout={setDynamicHeight}>
                  {credentialDetailData.map((item, index) => (
                    <View key={index}>
                      <Text style={styles.labeltext}>{item?.tag}</Text>
                    </View>
                  ))}
                </ScrollView>
              </View>
            </View>
          </ScrollView>
        )}
      </View>
      {credentialDetailData.length > 0 && (
        <View style={styles.button}>
          <Button
            onPress={connectOrganization}
            title={'Connect'}
            accessibilityLabel={'Connect'}
            testID={testIdWithKey('Connect')}
            buttonType={ButtonType.Primary}
          />
        </View>
      )}
    </View>
  )
}

export default OrganizationDetails
