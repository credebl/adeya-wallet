import { useNavigation } from '@react-navigation/core'
import { StackNavigationProp } from '@react-navigation/stack'
import {
  Button,
  ButtonType,
  CheckBoxRow,
  InfoTextBox,
  DispatchAction,
  AuthenticateStackParams,
  Screens,
  testIdWithKey,
  useTheme,
  useStore,
} from 'aries-bifold'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

// const appleTermsUrl = 'https://www.apple.com/legal/internet-services/itunes/us/terms.html'
// const bcWalletHomeUrl = 'https://www2.gov.bc.ca/gov/content/governments/government-id/bc-wallet'
// const digitalTrustHomeUrl = 'https://digital.gov.bc.ca/digital-trust/'
// const bcWebPrivacyUrl = 'https://www2.gov.bc.ca/gov/content/home/privacy'
// const digitalWalletPrivacyUrl = 'https://www2.gov.bc.ca/gov/content/governments/government-id/bc-wallet/privacy'

const Terms: React.FC = () => {
  const [store, dispatch] = useStore()
  const [checked, setChecked] = useState(false)
  const { t } = useTranslation()
  const navigation = useNavigation<StackNavigationProp<AuthenticateStackParams>>()
  navigation.setOptions({ title: 'End User License Agreement' })
  const { ColorPallet, TextTheme } = useTheme()
  const style = StyleSheet.create({
    container: {
      backgroundColor: ColorPallet.brand.primaryBackground,
      padding: 20,
    },
    bodyText: {
      ...TextTheme.normal,
      flexShrink: 1,
    },
    titleText: {
      ...TextTheme.normal,
      textDecorationLine: 'underline',
    },
    controlsContainer: {
      marginTop: 'auto',
      marginBottom: 20,
    },
    paragraph: {
      flexDirection: 'row',
      marginTop: 20,
    },
    enumeration: {
      ...TextTheme.normal,
      marginRight: 25,
    },
    link: {
      ...TextTheme.normal,
      color: ColorPallet.brand.link,
      textDecorationLine: 'underline',
      fontWeight: 'bold',
    },
  })

  const onSubmitPressed = useCallback(() => {
    dispatch({
      type: DispatchAction.DID_AGREE_TO_TERMS,
      payload: [{ DidAgreeToTerms: checked }],
    })

    navigation.navigate(Screens.CreatePIN)
  }, [])

  const onBackPressed = useCallback(() => {
    //TODO:(jl) goBack() does not unwind the navigation stack but rather goes
    //back to the splash screen. Needs fixing before the following code will
    //work as expected.

    // if (nav.canGoBack()) {
    //   nav.goBack()
    // }

    navigation.navigate(Screens.Onboarding)
  }, [])

  // const openLink = async (url: string) => {
  //   // Only `https://` is allowed. Update manifest as needed.
  //   const supported = await Linking.canOpenURL(url)

  //   if (supported) {
  //     // Will open in device browser.
  //     await Linking.openURL(url)
  //   }
  // }

  return (
    <SafeAreaView edges={['left', 'right', 'bottom']}>
      <ScrollView style={[style.container]}>
        <InfoTextBox>Please agree to the terms and conditions below before using this application.</InfoTextBox>
        <Text style={[style.bodyText, { marginTop: 20 }]}>
          The ADEYA Wallet App (the “Licensed Application”) Agreement.
        </Text>

        <View style={[style.controlsContainer]}>
          {!(store.onboarding.didAgreeToTerms && store.authentication.didAuthenticate) && (
            <>
              <CheckBoxRow
                title={t('Terms.Attestation')}
                accessibilityLabel={t('Terms.IAgree')}
                testID={testIdWithKey('IAgree')}
                checked={checked}
                onPress={() => setChecked(!checked)}
              />
              <View style={[{ paddingTop: 10 }]}>
                <Button
                  title={t('Global.Continue')}
                  accessibilityLabel={t('Global.Continue')}
                  testID={testIdWithKey('Continue')}
                  disabled={!checked}
                  onPress={onSubmitPressed}
                  buttonType={ButtonType.Primary}
                />
              </View>
              <View style={[{ paddingTop: 10, marginBottom: 20 }]}>
                <Button
                  title={t('Global.Back')}
                  accessibilityLabel={t('Global.Back')}
                  testID={testIdWithKey('Back')}
                  onPress={onBackPressed}
                  buttonType={ButtonType.Secondary}
                />
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Terms
