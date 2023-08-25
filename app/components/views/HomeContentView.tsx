import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View, Image } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import { styles } from '../../HomeContentviewstyle'
import { defaultState } from '../../contexts/store'
import WebDisplay from '../../screens/WebDisplay'
import { ColorPallet } from '../../theme'
import { surveyMonkeyExitUrl, surveyMonkeyUrl } from '../../utils/constants'
import { testIdWithKey } from '../../utils/testable'
import Button, { ButtonType } from '../buttons/Button'

interface HomeContentViewProps {
  children?: any
}

const HomeContentView: React.FC<HomeContentViewProps> = ({ children }) => {
  const { t } = useTranslation()
  const [surveyVisible, setSurveyVisible] = useState(false)
  const toggleSurveyVisibility = () => setSurveyVisible(!surveyVisible)

  return (
    <View style={[styles.feedbackContainer]}>
      {defaultState.preferences.developerModeEnabled ? (
        <>
          <Button
            title={t('Feedback.GiveFeedback')}
            accessibilityLabel={t('Feedback.GiveFeedback')}
            testID={testIdWithKey('GiveFeedback')}
            onPress={toggleSurveyVisibility}
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
      {children}
    </View>
  )
}

export default HomeContentView
