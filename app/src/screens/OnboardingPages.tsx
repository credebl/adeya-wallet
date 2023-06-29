/* eslint-disable react/jsx-props-no-spreading */
import { useStore, Button, ButtonType, ITheme, createStyles, GenericFn, testIdWithKey } from 'aries-bifold'
import React from 'react'
import { Text, View, Image, ImageBackground } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import Svg, { Path, SvgProps } from 'react-native-svg'

import onBoarding1 from '../assets/img/onBoarding1.svg'
import onBoarding2 from '../assets/img/onBoarding2.svg'

const EndPage = (onTutorialCompleted: GenericFn, theme: ITheme['OnboardingTheme']) => {
  const [store] = useStore()

  const defaultStyle = createStyles(theme)

  return (
    <>
      <ScrollView style={{ padding: 20, paddingTop: 30, alignSelf: 'center' }}>
        <Text style={[defaultStyle.headerText, { alignSelf: 'center', marginBottom: 25 }]}>Share Securely</Text>
        <ImageBackground source={require('../assets/img/Onbording-image.svg')}>
          <Svg width="343" height="245" viewBox="0 0 380 262" fill="none">
            <Path
              d="M67.3686 256.679C45.9773 247.451 15.955 195.44 58.638 146.614C85.3024 116.094 43.3905 51.4972 122.14 11.2519C173.579 -15.0643 286.281 3.93904 347.221 77.1667C388.635 126.939 389.58 200.166 356.971 256.007L67.3686 256.679Z"
              fill="#F4F9FF"
            />
            <Path d="M361.059 260.034L17.0586 261" stroke="#0B29B9" stroke-miterlimit="10" />
            <Path
              d="M171.977 210.194H121.316C117.826 210.194 115 207.011 115 203.088V83.1061C115 79.1792 117.83 76 121.316 76H171.977C175.467 76 178.293 79.1835 178.293 83.1061V203.088C178.293 207.015 175.467 210.194 171.977 210.194Z"
              fill="#1933AE"
            />
            <Image
              source={require('../assets/img/qr-code.png')}
              style={{ width: 81, height: 82, flexShrink: 0, position: 'absolute', right: 100, top: 100, left: 167 }}
            />
            <Path
              d="M120.984 207.947C118.788 207.947 117 205.935 117 203.464V83.4823C117 81.0116 118.788 79 120.984 79H171.645C173.841 79 175.629 81.0116 175.629 83.4823V203.464C175.629 205.935 173.841 207.947 171.645 207.947H120.984Z"
              fill="#7F96FC"
            />

            <Path
              d="M338.918 210.194H288.257C284.767 210.194 281.941 207.011 281.941 203.088V83.1061C281.941 79.1792 284.771 76 288.257 76H338.918C342.409 76 345.234 79.1835 345.234 83.1061V203.088C345.234 207.015 342.409 210.194 338.918 210.194Z"
              fill="#1933AE"
            />
            <Path
              d="M288.043 206.947C285.847 206.947 284.059 204.935 284.059 202.464V82.4823C284.059 80.0116 285.847 78 288.043 78H338.703C340.899 78 342.687 80.0116 342.687 82.4823V202.464C342.687 204.935 340.899 206.947 338.703 206.947H288.043Z"
              fill="#7F96FC"
            />

            <Path
              d="M99.8711 121.394C99.8711 121.394 100.769 119.546 101.421 118.502C102.073 117.452 103.973 117.207 105.123 118.054C106.273 118.901 106.021 120.694 104.773 121.646C103.524 122.591 101.323 123.346 101.323 123.346L99.8711 121.394Z"
              fill="#F6DECD"
            />
            <Path
              d="M46.4629 186.688C45.8694 189.125 45.7337 193.396 45.7506 197.735C45.7761 203.506 46.0644 209.396 45.9117 211.22C45.6319 214.408 37.9156 221.756 37.2287 228.124C36.5419 234.5 34.0574 259.381 34.0574 260.498C33.5574 260.498 36.5574 260.498 34.0574 260.498C34.3712 260.183 53.0547 262.998 41.0574 254.498C43.6776 248.616 69.2304 188.077 69.2304 188.077L46.4629 186.688Z"
              fill="#F6DECD"
            />
            <Path
              d="M65.5312 187.099C65.6584 189.605 66.7523 193.739 68.0073 197.882C69.6777 203.406 71.645 208.963 72.0096 210.753C72.654 213.89 67.3628 223.148 68.5245 229.456C69.6862 235.764 74.1634 259.444 74.4771 260.501C75.5547 260.501 77.5547 260.502 78.0547 260.501C93.5547 259.502 79.0547 255.002 79.0547 255.002C78.5547 254.002 87.7221 181.848 87.7221 181.848L65.5312 187.099Z"
              fill="#F6DECD"
            />
            <Path
              d="M66.4817 74.0612L64.7434 69.5859L62.0469 95.9856H70.255V91.8428V83.7192L66.4817 74.0612Z"
              fill="#F6DECD"
            />
            <Path
              d="M141.397 96.9993L139.057 94.7148C138.387 94.0584 137.327 94.0243 136.615 94.6381L114.229 113.911C113.44 114.593 112.321 114.73 111.388 114.252C105.766 111.363 86.4161 101.432 83.0074 99.6589C79.0135 97.5789 70.2542 95.9849 70.2542 95.9849H61.1387C56.5004 95.9849 52.8542 97.6301 50.9124 101.867C49.4455 105.072 48.5043 108.754 48.5636 114.056C48.6993 126.945 51.294 139.425 51.294 139.425L41.992 188.328C41.7122 189.786 42.7212 191.175 44.1797 191.354C47.9701 191.815 55.7118 192.548 67.1422 192.642C79.5308 192.744 89.969 190.442 94.6158 189.215C96.0319 188.84 96.8374 187.357 96.388 185.959L80.5144 136.1L83.2787 118.864L106.784 128.965C110.006 130.167 113.567 130.099 116.747 128.761C118.927 127.849 120.834 126.374 122.284 124.499L141.558 99.4116C142.135 98.6871 142.059 97.6471 141.397 96.9993Z"
              fill="#002E73"
            />
            <Path
              d="M71.5865 86.3517C67.8131 86.3517 64.7266 83.2489 64.7266 79.4556V70.9313C64.7266 67.138 67.8131 64.0352 71.5865 64.0352C75.3599 64.0352 78.4464 67.138 78.4464 70.9313V79.4556C78.4464 83.2489 75.3599 86.3517 71.5865 86.3517Z"
              fill="#F6DECD"
            />
            <Path
              d="M79.5067 72.3801C79.5067 72.3801 75.4196 78.0146 69.5772 76.9064L68.5936 99.6918H52.2027C52.2027 99.6918 49.5741 65.0492 63.8196 62.364C72.6468 60.7103 79.5067 64.802 79.5067 72.3801Z"
              fill="#252639"
            />
            <Path
              d="M52.6836 139.56C52.6836 139.56 67.0224 142.33 79.4958 137.344"
              stroke="white"
              stroke-miterlimit="10"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <Path
              d="M114.653 121.226C114.653 121.226 112.685 120.106 107.681 120.002C102.677 119.899 101.055 123.048 101.055 123.048C101.055 123.048 105.135 129.891 113.762 128.902C120.916 128.083 122.055 121.433 122.055 121.433L114.653 121.226Z"
              fill="#B73400"
            />
            <Path
              d="M34.1398 259.543C34.2046 260.139 34.5199 260.579 34.8869 260.615C37.5688 260.884 48.3092 261.807 48.0501 259.259C47.8946 257.719 45.4546 255.625 43.1959 254C42.7554 255.356 42.9239 257.059 42.9239 257.059C42.505 257.314 38.8169 257.314 36.7612 256.363C35.66 255.852 34.8913 254.837 34.4119 254.014C34.075 255.732 33.9584 257.804 34.1398 259.543Z"
              fill="#002E73"
            />
            <Path
              d="M72.1398 259.543C72.2046 260.139 72.5199 260.579 72.8869 260.615C75.5688 260.884 86.3092 261.807 86.0501 259.259C85.8946 257.719 83.4546 255.625 81.1959 254C80.7554 255.356 80.9239 257.059 80.9239 257.059C80.505 257.314 76.8169 257.314 74.7612 256.363C73.66 255.852 72.8913 254.837 72.4119 254.014C72.075 255.732 71.9584 257.804 72.1398 259.543Z"
              fill="#002E73"
            />
          </Svg>
        </ImageBackground>
        <View style={{ alignSelf: 'center', marginHorizontal: 20 }}>
          <Text
            style={[
              {
                marginTop: 25,
                display: 'flex',
                width: 345,
                flexDirection: 'column',
                flexShrink: 0,
                fontSize: 18,
                fontFamily: 'Montserrat',
                textAlign: 'center',
                color: '#2289F7',
              },
            ]}
          >
            Take complete control over your data. Securely connect with people and organizations to share necessary
            information without compromising your privacy.
          </Text>
        </View>
      </ScrollView>
      {!(store.onboarding.didCompleteTutorial && store.authentication.didAuthenticate) && (
        <View
          style={{
            marginTop: 'auto',
            margin: 20,
          }}
        >
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
    <ScrollView style={{ padding: 20, paddingTop: 30, alignSelf: 'center' }}>
      <Text style={[defaultStyle.headerText, { alignSelf: 'center', marginBottom: 25 }]}>Welcome!</Text>
      <ImageBackground
        source={require('../assets/img/onBoardingfirst.png')}
        style={{ height: 245, width: 343, alignSelf: 'center' }}
      >
        <Image
          source={require('../assets/img/face-scan.png')}
          style={{
            width: 78,
            height: 78,
            flexShrink: 0,
            position: 'absolute',
            right: 100,
            top: 70,
            left: 125,
            bottom: 0,
          }}
        />
      </ImageBackground>

      <View style={{ alignSelf: 'center', marginHorizontal: 20 }}>
        <Text
          style={[
            {
              marginTop: 25,
              display: 'flex',
              width: 345,
              flexDirection: 'column',
              flexShrink: 0,
              fontSize: 18,
              fontFamily: 'Montserrat',
              textAlign: 'center',
              color: '#2289F7',
            },
          ]}
        >
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
    image: onBoarding1,
    title: 'Keep your data safe',
    body: 'Safeguard your digital Credentials with ADEYA, ensuring that your data remains protected and shared with your consent only.',
  },
  {
    image: onBoarding2,
    title: 'Organize with ease',
    body: 'To receive and use credentials you use the “Scan” feature in the app to scan a special QR code.Information is sent and received over a private, encrypted connection.',
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
    <ScrollView style={{ padding: 20 }}>
      <Text style={[defaultStyle.headerText, { alignSelf: 'center', marginBottom: 25 }]}>{title}</Text>
      <View style={{ alignItems: 'center' }}>{image(imageDisplayOptions)}</View>
      <View style={{ alignSelf: 'center', marginHorizontal: 20 }}>
        <Text
          style={[
            {
              marginTop: 25,
              display: 'flex',
              width: 345,
              flexDirection: 'column',
              flexShrink: 0,
              fontSize: 18,
              fontFamily: 'Montserrat',
              textAlign: 'center',
              color: '#2289F7',
            },
          ]}
        >
          {body}
        </Text>
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
