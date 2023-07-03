import { CredentialState } from '@aries-framework/core'
import { useCredentialByState } from '@aries-framework/react-hooks'
import { useNavigation } from '@react-navigation/native'
import { useStore, Button, ButtonType, testIdWithKey, useTheme } from 'aries-bifold'
import React, { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { View, Text, Image, TouchableOpacity, ImageBackground } from 'react-native'
import { SvgProps } from 'react-native-svg'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import { styles } from '../HomeContentviewstyle'
import contacts from '../assets/img/contactsimage.svg'
import credentialImage from '../assets/img/credentialImage.svg'
import request from '../assets/img/requestsImage.svg'
import { surveyMonkeyUrl, surveyMonkeyExitUrl } from '../constants'
import { useNotifications } from '../hooks/notifications'
import WebDisplay from '../screens/WebDisplay'
import { BCState } from '../store'

interface HomeContentViewProps {
  children?: any
}

const HomeContentView: React.FC<HomeContentViewProps> = ({ children }) => {
  const credentials = [
    ...useCredentialByState(CredentialState.CredentialReceived),
    ...useCredentialByState(CredentialState.Done),
  ]
  const notifications = useNotifications()
  const { ColorPallet } = useTheme()
  const { t } = useTranslation()
  const [surveyVisible, setSurveyVisible] = useState(false)
  const [store] = useStore<BCState>()
  const navigation = useNavigation()

  const toggleSurveyVisibility = () => setSurveyVisible(!surveyVisible)
  const homebadage: {
    image: React.FC<SvgProps>
    title: string
  }[] = [
    {
      image: contacts,
      title: 'CONTACTS',
    },
    {
      image: credentialImage,
      title: 'CREDENTIALS',
    },
    {
      image: request,
      title: 'REQUEST',
    },
  ]
  const imageDisplayOptions = {
    height: 28,
    width: 28,
  }

  const Notification = useMemo(
    () => (
      <TouchableOpacity style={styles.button}>
        <Image source={require('../assets/img/Vector.png')} />
        <ImageBackground source={require('../assets/img/Countbackground.png')} style={styles.countbackgroundImage}>
          <Text style={styles.countext}>{credentials.length}</Text>
        </ImageBackground>
      </TouchableOpacity>
    ),
    []
  )

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => Notification,
      // tabBarLabel: 'Home',
      // tabBarIcon: () => Notification,
    })
  }, [])

  return (
    <View style={[styles.feedbackContainer]}>
      {store.preferences.developerModeEnabled ? (
        <>
          <Button
            title={t('Feedback.GiveFeedback')}
            accessibilityLabel={t('Feedback.GiveFeedback')}
            testID={testIdWithKey('GiveFeedback')}
            onPress={toggleSurveyVisibility}
            buttonType={ButtonType.Secondary}
          >
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
      {notifications.total === 0 && (
        <View style={[styles.messageContainer]}>
          <Image source={require('../assets/img/homeimage.png')} style={styles.homeImage} />
        </View>
      )}

      <View style={styles.homebadageview}>
        {homebadage.map((g) => (
          <View style={styles.badagecontainer}>
            <View style={styles.badageview}>
              <View style={styles.homebadage}>{g.image(imageDisplayOptions)}</View>
            </View>
            <View>
              <Text style={styles.badageText}>{g.title}</Text>
              <Text style={styles.badageText}>{credentials.length}</Text>
            </View>
          </View>
        ))}
      </View>
      {children}
    </View>
  )
}

HomeContentView.defaultProps = {
  children: null,
}

export default HomeContentView
