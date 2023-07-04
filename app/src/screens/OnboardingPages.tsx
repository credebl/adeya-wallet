/* eslint-disable react/jsx-props-no-spreading */
import { useStore, Button, ButtonType, ITheme, createStyles, GenericFn, testIdWithKey } from 'aries-bifold'
import React from 'react'
import { Text, View, Image, ImageBackground } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { SvgProps } from 'react-native-svg'

import onBoardingOrganizeease from '../assets/img/onBoardingOrganizeease.svg'
import onBoardingdatasafe from '../assets/img/onBoardingdatasafe.svg'
import { styles } from '../onBordingstyle'

const EndPage = (onTutorialCompleted: GenericFn, theme: ITheme['OnboardingTheme']) => {
  const [store] = useStore()

  const defaultStyle = createStyles(theme)

  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={{ justifyContent: 'center' }}>
        <Text style={[defaultStyle.headerText, styles.headerText]}>Share Securely</Text>
        <ImageBackground source={require('../assets/img/sharesecure.png')} style={styles.backgroundImage}>
          <Image source={require('../assets/img/qr-code.png')} style={styles.qrImage} />
        </ImageBackground>
        <View style={styles.descriptiionText}>
          <Text style={[styles.bodyText]}>
            Take complete control over your data. Securely connect with people and organizations to share necessary
            information without compromising your privacy.
          </Text>
        </View>
      </ScrollView>
      {!(store.onboarding.didCompleteTutorial && store.authentication.didAuthenticate) && (
        <View style={styles.startedButtonconatiner}>
          <Button
            title="Get Started"
            accessibilityLabel="Get Started"
            testID={testIdWithKey('GetStarted')}
            onPress={onTutorialCompleted}
            buttonType={ButtonType.Primary}
          />
        </View>
      )}
    </>
  )
}

const StartPages = (theme: ITheme) => {
  const defaultStyle = createStyles(theme)
  return (
    <ScrollView style={styles.container}>
      <Text style={[defaultStyle.headerText, styles.headerText]}>Welcome!</Text>
      <ImageBackground source={require('../assets/img/onBoardingfirst.png')} style={styles.backgroundImage}>
        <Image source={require('../assets/img/face-scan.png')} style={styles.Image} />
      </ImageBackground>

      <View style={styles.descriptiionText}>
        <Text style={[styles.bodyText]}>
          Unlock the power of your digital identity with our all-in-one wallet! Let embark on a journey to take full
          control of your digital presence.
        </Text>
      </View>
    </ScrollView>
  )
}

const guides: Array<{
  image: React.FC<SvgProps>
  title: string
  body: string
}> = [
  {
    image: onBoardingdatasafe,
    title: 'Keep your data safe',
    body: 'Safeguard your digital Credentials with ADEYA, ensuring that your data remains protected and shared with your consent only.',
  },
  {
    image: onBoardingOrganizeease,
    title: 'Organize with ease',
    body: 'Organize and manage your digital credentials effortlessly within ADEYA.Say goodbye to paper documents and embrace the convenience of an identity wallet in your hand.',
  },
]

const CreatePageWith = (image: React.FC<SvgProps>, title: string, body: string, theme: ITheme['OnboardingTheme']) => {
  const defaultStyle = createStyles(theme)
  const imageDisplayOptions = {
    fill: theme.imageDisplayOptions.fill,
    height: 245,
    width: 345,
  }
  return (
    <ScrollView style={styles.container}>
      <Text style={[defaultStyle.headerText, styles.headerText]}>{title}</Text>
      <View style={styles.guideimages}>{image(imageDisplayOptions)}</View>
      <View style={styles.descriptiionText}>
        <Text style={[styles.bodyText]}>{body}</Text>
      </View>
    </ScrollView>
  )
}

export const pages = (onTutorialCompleted: GenericFn, theme: ITheme): Array<Element> => {
  return [
    StartPages(theme),
    ...guides.map((g) => CreatePageWith(g.image, g.title, g.body, theme)),
    EndPage(onTutorialCompleted, theme),
  ]
}
