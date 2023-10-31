import { RouteProp, useNavigation, useRoute } from '@react-navigation/core'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View, StyleSheet, Text, Image, ScrollView } from 'react-native'
import Toast from 'react-native-toast-message'

import Button, { ButtonType } from '../components/buttons/Button'
import { ToastType } from '../components/toast/BaseToast'
import { useTheme } from '../contexts/theme'
import { BifoldError } from '../types/error'
import { Screens, Stacks } from '../types/navigators'
import { fetchOrganizationDetail } from '../utils/Organization'
import { useAppAgent } from '../utils/agent'
import { connectFromInvitation, getJson, getUrl, receiveMessageFromUrlRedirect } from '../utils/helpers'
import { testIdWithKey } from '../utils/testable'

interface OrgnizationDetailsProps {
  name: string
  description: string
  logoUrl: any
  OrgSlug: string
}
interface CredentialDetail {
  tag: string
  credentialDefinitionId: string
  schemaLedgerId: string
  revocable: boolean
  createDateTime: string
}
const OrganizationDetails: React.FC<OrgnizationDetailsProps> = () => {
  const { ColorPallet, ListItems, TextTheme } = useTheme()
  const { agent } = useAppAgent()
  const [orgnizationDetailData, setOrgnizationDetailData] = useState([])
  const [credentialDetailData, setCredentialDetailData] = useState<CredentialDetail[]>([])
  const navigation = useNavigation()
  const { t } = useTranslation()
  const params = useRoute<RouteProp<Record<string, OrgnizationDetailsProps>, string>>().params
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
      fontWeight: '600',
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
      height: 100,
      width: '100%',
      margin: 10,
      maxHeight: 165,
      flexShrink: 0,
      borderWidth: 1,
      borderRadius: 10,
      borderColor: ColorPallet.brand.primaryLight,
      alignSelf: 'center',
      justifyContent: 'center',
      backgroundColor: ColorPallet.brand.secondaryBackground,
    },
    orgDescriptionContainner: {
      height: 'auto',
      width: '100%',
      margin: 10,
      flexShrink: 0,
      borderWidth: 1,
      borderRadius: 10,
      borderColor: ColorPallet.brand.primaryLight,
      alignSelf: 'center',
      flex: 1,
      backgroundColor: ColorPallet.brand.secondaryBackground,
    },
    credentialContainner: {
      height: 'auto',
      width: '100%',
      margin: 10,
      flexShrink: 0,
      borderWidth: 1,
      borderRadius: 10,
      borderColor: ColorPallet.brand.primaryLight,
      alignSelf: 'center',
      flex: 1,
      backgroundColor: ColorPallet.brand.secondaryBackground,
    },
    labeltext: {
      justifyContent: 'center',
      marginTop: 10,
      marginLeft: 20,
      fontSize: 16,
      color: ColorPallet.brand.primary,
    },
    avatarOrgPlaceholder: {
      ...TextTheme.headingFour,
    },
    orgContainer: {
      justifyContent: 'center',
      marginTop: 30,
      marginLeft: 10,
      fontWeight: '600',
      color: ColorPallet.brand.primary,
      fontSize: 17,
    },
    button: {
      margin: 20,
      marginTop: '70%',
    },
    credLabel: {
      fontSize: 18,
      fontWeight: '600',
      width: '90%',
    },
    credContainer: {
      flexDirection: 'column',
    },
  })

  const fetchData = async () => {
    const response = await fetchOrganizationDetail(params?.OrgSlug)
    setOrgnizationDetailData(response?.data.org_agents)
    setCredentialDetailData(response?.data.credential_definitions)
  }

  useEffect(() => {
    fetchData()
  }, [])

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
    try {
      const agentInvitations = orgnizationDetailData.map(item => item?.agent_invitations)

      if (!agentInvitations || agentInvitations.length === 0) {
        Toast.show({
          type: ToastType.Error,
          text1: 'No agent invitations available',
        })
        return
      }

      const lastArray = agentInvitations[0]

      if (!lastArray?.connectionInvitation) {
        Toast.show({
          type: ToastType.Error,
          text1: 'No connection invitations available',
        })
        return
      }

      const lastItem = lastArray[lastArray.length - 1]

      if (!lastItem || !lastItem.connectionInvitation) {
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
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.headerTextView}>
        <Text style={styles.titleText}>Get credentials from selected organization.</Text>
      </View>
      <View style={styles.orgNameContainner}>
        <View style={{ flexDirection: 'row' }}>
          <View style={styles.avatarContainer}>
            {params?.logoUrl ? (
              <Image style={styles.avatarOrgImage} source={{ uri: params.logoUrl }} />
            ) : (
              <Text style={styles.avatarOrgPlaceholder}>{organaizationLabelAbbr}</Text>
            )}
          </View>

          <Text style={styles.orgContainer} numberOfLines={3}>
            {params?.name}
          </Text>
        </View>
      </View>
      <View style={styles.orgDescriptionContainner}>
        <View>
          <View style={styles.descriptionlabel}>
            <Text style={styles.orgHeaderText}>About Organization</Text>
          </View>
          <Text style={styles.labeltext}>{params?.description}</Text>
        </View>
      </View>
      {credentialDetailData.length > 0 && (
        <View style={styles.credentialContainner}>
          <View>
            <View style={styles.descriptionlabel}>
              <Text style={styles.orgHeaderText}>Available Credentials</Text>
            </View>
            <View style={styles.credContainer}>
              {credentialDetailData.map((item, index) => (
                <Text key={index} style={styles.labeltext}>
                  {item?.tag}
                </Text>
              ))}
            </View>
          </View>
        </View>
      )}
      <View style={styles.button}>
        <Button
          onPress={connectOrganization}
          title={'Connect'}
          accessibilityLabel={'Connect'}
          testID={testIdWithKey('Connect')}
          buttonType={ButtonType.Primary}
        />
      </View>
    </ScrollView>
  )
}

export default OrganizationDetails
