import { ConnectionRecord, ConnectionType, CredentialState, ProofState } from '@aries-framework/core'
import { useConnections, useCredentialByState, useProofByState } from '@aries-framework/react-hooks'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View, Text, Image } from 'react-native'
import { SvgProps } from 'react-native-svg'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import { styles } from '../../HomeContentviewstyle'
import contacts from '../../assets/img/contactsimage.svg'
import credentialImage from '../../assets/img/credentialImage.svg'
import request from '../../assets/img/requestsImage.svg'
import { defaultState, useStore } from '../../contexts/store'
import WebDisplay from '../../screens/WebDisplay'
import { ColorPallet } from '../../theme'
import { surveyMonkeyExitUrl, surveyMonkeyUrl } from '../../utils/constants'
import { testIdWithKey } from '../../utils/testable'
import Button, { ButtonType } from '../buttons/Button'

interface HomeContentViewProps {
  children?: any
}

const HomeContentView: React.FC<HomeContentViewProps> = ({ children }) => {
  const credentials = [
    ...useCredentialByState(CredentialState.CredentialReceived),
    ...useCredentialByState(CredentialState.Done),
  ]
  // const { HomeTheme } = useTheme()
  const { t } = useTranslation()
  const [store] = useStore()
  const [surveyVisible, setSurveyVisible] = useState(false)
  const requestcount = useProofByState(ProofState.RequestReceived)?.length
  const toggleSurveyVisibility = () => setSurveyVisible(!surveyVisible)
  const { records } = useConnections()
  let connections: ConnectionRecord[] = records
  if (!store.preferences.developerModeEnabled) {
    connections = records.filter(r => !r.connectionTypes.includes(ConnectionType.Mediator))
  }
  const homebadge: {
    image: React.FC<SvgProps>
    title: string
    count: number
  }[] = [
    {
      image: contacts,
      title: 'CONTACTS',
      count: connections?.length,
    },
    {
      image: credentialImage,
      title: 'CREDENTIALS',
      count: credentials?.length,
    },
    {
      image: request,
      title: 'REQUEST',
      count: requestcount,
    },
  ]
  const imageDisplayOptions = {
    height: 28,
    width: 28,
  }

  return (
    <View style={[styles.feedbackContainer]}>
      {defaultState.preferences.developerModeEnabled ? (
        <>
          <Button
            title={t('Feedback.GiveFeedback')}
            accessibilityLabel={t('Feedback.GiveFeedback')}
            testID={testIdWithKey('GiveFeedback')}
            // onPress={toggleSurveyVisibility}
            buttonType={ButtonType.Secondary}>
            <Icon
              name="message-draw"
              style={[styles.feedbackIcon, { color: ColorPallet.brand.primary }]}
              size={26}
              color={ColorPallet.grayscale.white}
            />
          </Button>
          <WebDisplay
            destinationUrl={surveyMonkeyUrl}
            exitUrl={surveyMonkeyExitUrl}
            visible={surveyVisible}
            onClose={toggleSurveyVisibility}
          />
        </>
      ) : null}

      <View style={[styles.messageContainer]}>
        <Image source={require('../../assets/img/homeimage.png')} style={styles.homeImage} />
      </View>

      <View style={styles.homebadgeview}>
        {homebadge.map(g => (
          <View style={styles.badgecontainer}>
            <Text style={styles.badgeText}>{g.count}</Text>
            <Image source={require('../../assets/img/Line.png')} style={styles.line} />
            <View style={styles.badgeview}>
              <View style={styles.homebadge}>{g.image(imageDisplayOptions)}</View>
            </View>
            <View>
              <Text style={styles.badgeText}>{g.title}</Text>
            </View>
          </View>
        ))}
      </View>
      {children}
    </View>
  )
}

export default HomeContentView
