import { useNavigation } from '@react-navigation/core'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import Button, { ButtonType } from '../components/buttons/Button'
import CheckBoxRow from '../components/inputs/CheckBoxRow'
import InfoTextBox from '../components/texts/InfoTextBox'
import { DispatchAction } from '../contexts/reducers/store'
import { useStore } from '../contexts/store'
import { useTheme } from '../contexts/theme'
import { AuthenticateStackParams, Screens } from '../types/navigators'
import { testIdWithKey } from '../utils/testable'

const terms: {
  title: string
  subtitle: { [key: string]: string }
}[] = [
  {
    title: '1. Validity of the General Terms and Conditions',
    subtitle: {
      '1.1':
        "The usage of the 'ADEYA' Self-sovereign Identity Edge Wallet (the 'ADEYA App') is subject to these general terms and conditions (the 'GTC'). The ADEYA App offers constant access to and viewing of the GTC.",
      '1.2':
        'The terms of these GTC apply to the use of the ADEYA App and associated services as well as the provision of all services and advantages linked to the ADEYA App.',
      '1.3':
        'Blockster Labs Pvt Ltd Company provides users with access to self-sovereign identification networks through the ADEYA App in accordance with the terms of these GTC.',
      '1.4':
        "Other general terms and conditions, such as the user's, do not apply, despite the user's wants. Only if Blockster Labs Pvt Ltd Company expressly agrees to the user's general terms and conditions does the user presume their validity.",
      '1.5':
        'The legality of the remaining sections of these GTC shall not be impacted if any provision is or becomes illegal by influx of law or due to passage of time. The user and Blockster Labs Pvt Ltd Company agree to discuss the grounds for the invalidity of the provision to come up with a replacement provision that closely resembles its goals.',
      '1.6': 'In the case of contractual discrepancy or variations, the same rule (Section 1.5) applies.',
    },
  },
  {
    title: "2. The ADEYA App's Purpose and Object of Performance",
    subtitle: {
      '2.1':
        'The ADEYA App is a state-of-the-art SSI-based mobile wallet application designed to securely store user credentials using cryptography. It allows users to safeguard their verifiable credentials and embrace the convenience of an identity wallet on their smartphones without compromising privacy. Blockster Labs Pvt Ltd Company develops the ADEYA App.',
      '2.2':
        'The ADEYA App is intended for the digital identification and authentication of natural persons. Users can obtain and store identity information about themselves from other participants and share it if required. The identity information may include legitimation data, creditworthiness data, payment transaction data, registration data, and other text-based information.',
      '2.3':
        "The ADEYA App connects to self-sovereign identity networks, enabling peer-to-peer connections with other participants. Users can exchange encrypted messages and receive other participants' identity information ('verifiable credentials'). They can also respond to identity requests from participants by sharing the relevant stored identity information. The ADEYA App is also connected to a digital mailbox service operated by Blockster Labs Pvt Ltd Company, ensuring secure message delivery.",
    },
  },
  {
    title: "3. The ADEYA App's Application and functionality",
    subtitle: {
      '3.1':
        "Application and Launch:\nWhen the user starts the 'ADEYA' App on their mobile phone, they are prompted to secure access to the app by entering a six-digit PIN code.",
      '3.2':
        "Tab Menu:\nThe 'ADEYA' app's primary features are available through the tab navigation at the bottom of the app. There are two tabs on the tab menu: 'Credentials' and 'Home.' The 'Home' tab is the one that initially appears when the programme is opened. Identity information that is saved in the app is shown as separate card icons under the 'Credentials' page. A card symbol can be touched to display extensive information about the issuer and the identifying attributes that have been recorded under 'Info.' Information regarding the use of the identification traits, including specifics of shared information, is displayed in the 'Activities' section. The first card in the 'Credentials' page that the user sees after receiving new identification information gives them the choice to accept or reject it.",
      '3.3':
        "Scan Button:\nThe Scan button, which can be found in the bottom right of the app, gives users access to a QR Code scanner. With the use of this scanner, users may see and accept QR Code-based connection requests from other users. For this feature to work, the app needs access to the phone's camera.",
      '3.4':
        "App Settings:\nThe 'ADEYA' App has a number of customization choices that are available from the toolbar by selecting the gear icon. The configuration options include:\n- Language: Users have the option of changing the app's language.\n- Utilise Biometrics: To increase security on their mobile phone, users can enable biometric authentication, such as fingerprint or face recognition.",
      '3.5': `Functionality:\n- Establish Connections: Users can connect with one another by exchanging QR codes with other users. Users can learn more about the contact request's sender by scanning the QR code. Requests for contact might be approved or denied. A peer-to-peer connection is made after accepting a contact request. Under the 'Contacts' icon in the menu, any connections that have already been made with other participants are shown. When a specific connection is chosen, all identification data transmitted to or received from that participant is shown.\n\n- Sharing identification Information: Through already established peer-to-peer connections, participants can make identification queries to the user. The notification icon shows all identity requests. Existing identification attributes that are saved in the app are used to pre-fill the desired attributes. If suitable alternatives are available, users have the opportunity to manually edit this information. The "ADEYA" App's only job is to make it easier for participants to exchange information. An identification request can be refused if a user decides not to reply to it, in which case the asking participant won't receive any information.The submitted information is accessible either under the relevant card in the "Credentials" page when identification inquiries are successfully complied with. \n\n- Support for numerous Hyperledger Indy networks: The "ADEYA" software now supports the mainnet of Sovrin, the BCovrin Ledger, as well as the Indicio network.\n\nYou accept and agree to the functionality as mentioned above, as well as any other terms and conditions that the app developer may have stated, by using the "ADEYA" App.
        `,
    },
  },
  {
    title: '4. Application/Registration',
    subtitle: {
      '4.1': 'No login or registration with Blockster Labs Pvt Ltd Company is required to use the ADEYA App.',
    },
  },
  {
    title: "5. The 'ADEYA' App's availability and changes, as well as services related to it:",
    subtitle: {
      '5.1':
        "After the 'ADEYA' App has been installed, the user may use it and any connected Blockster Labs Pvt Ltd services in accordance with the terms and conditions set out in this agreement.",
      '5.2':
        "The 'ADEYA' App and the services and advantages connected to it are continuously made available by Blockster Labs Pvt Ltd. However, the 'ADEYA' App and the services and advantages connected to it are not guaranteed, obligated to be available at all the time, or subject to responsibility by Blockster Labs Pvt Ltd Company.",
      '5.3':
        "Additionally, Blockster Labs Pvt Ltd corporation is free to suspend or stop using the 'ADEYA' App, as well as the features and services connected to it, at any time, regardless of outside factors beyond its control. Blockster Labs Pvt Ltd company has all discretion over the timing, scope, and length of any suspensions it imposes and whether to execute any necessary maintenance or repairs. These decisions are not subject to judicial scrutiny.",
      '5.4':
        "The Blockster Labs Pvt Ltd company reserves the right to prohibit and/or ban the use of the 'ADEYA' App at any time and to stop offering services associated with the 'ADEYA' App. Such activities are not subject to justification and may be carried out at the sole discretion of Blockster Labs Pvt Ltd Company, including in a way that is not susceptible to judicial scrutiny.",
      '5.5':
        "The 'ADEYA' App may undergo modifications at any moment, at the sole discretion of the Blockster Labs Pvt Ltd, including but not limited to the type and extent of changes. The company is under no obligation to notify users of such changes.",
    },
  },
  {
    title: '6. Consent to the use of data and information of the user',
    subtitle: {
      '6.0':
        "By selecting the appropriate field during the installation of the 'ADEYA' App, the user confirms his consent to the entirety of these GTC, and specifically to the following points:",
      'a)': "A user's identification data will initially only be saved on the 'ADEYA' App and won't be shared with other parties until the user expressly agrees to it.",
      'b)': "The user agrees that some personal data may be collected and processed by the 'ADEYA' App in order for it to operate properly and provide the services it offers. This data may include the user's name, contact information, device information, and any other facts the user freely submits inside the app.",
      'c)': "The user grants Blockster Labs Pvt Ltd permission to gather and analyse anonymous user data and statistics about the 'ADEYA' App in order to enhance its functionality, performance, and user experience. This information will be handled in compliance with the relevant data protection laws and rules applicable to India which may be further amended from time to time.",
      'd)': "The user is aware of and accepts that the 'ADEYA' App secures and protects user credentials and data using cryptography and encryption techniques. The user understands that no security solution is perfect and that Blockster Labs Pvt Ltd cannot completely guarantee the protection of user data. The user is in charge of adopting the necessary safety measures to protect their device and access to the app.",
      'e)': "The user acknowledges and accepts that when they access or use the 'ADEYA' App, Blockster Labs Pvt Ltd may use cookies or other similar technologies to gather certain information. IP addresses, unique device identifiers, surfing habits, and other relevant data may be included in this information.",
      'f)': 'The user is aware of and consents to the processing of their personal data by Blockster Labs Pvt Ltd in compliance with all applicable data protection laws and regulations, including the General Data Protection Regulation (GDPR) and other pertinent privacy legislation.',
      'g)': "By uninstalling the 'ADEYA' App and ceasing to use it, the user has the right to withdraw their consent to the collection, processing, and storage of their personal information at any time. The user is aware, however, that such a withdrawal of permission may prevent them from using certain of the app's features or services.",
    },
  },
  {
    title: '7. Intellectual Property Rights',
    subtitle: {
      '7.1':
        "The 'ADEYA' App (including but not limited to its design, layout, graphics, text, and other content, as well as any software, algorithms, and underlying technologies), is protected by intellectual property rights and is owned or licenced by the Blockster Labs Pvt Ltd Company. The 'ADEYA' App can be used by the user for personal and non-commercial reasons, but only with a limited, non-exclusive, and non-transferable right.",
      '7.2':
        "The user acknowledges that they will not, without Blockster Labs Pvt Ltd Company written approval, reproduce, edit, distribute, display, perform, publish, licence, create derivative works from, or sell any portion of the 'ADEYA' App.",
      '7.3':
        "Any copyright, trademark, or other property rights notices included in or accompanying the 'ADEYA' App may not be removed, altered, or obscured by the user.",
    },
  },
  {
    title: '8. Limitation of Liability',
    subtitle: {
      '8.1':
        "Users acknowledge that they are using the 'ADEYA' App at their own risk. Blockster Labs Pvt Ltd disclaims all responsibility for any harm that may result from using the 'ADEYA' App, including but not limited to any direct, indirect, incidental, consequential, or punitive damages.",
      '8.2':
        "Blockster Labs Pvt Ltd disclaims all responsibility for any delays, interruptions, errors, or omissions in the 'ADEYA' App's operation or any component thereof, as well as for any failure to perform, whether brought on by divine intervention, technical issues, unauthorised access, theft, or other causes outside of Blockster Labs Pvt Ltd control.",
      '8.3':
        "With regard to the accuracy, dependability, or fitness of the 'ADEYA' App for any given purpose, the company makes no representations or guarantees of any kind, either stated or implied. On an 'as-is' and 'as available' basis, the app is made available.",
      '8.4':
        "The user understands that the company Blockster Labs Pvt Ltd cannot ensure the continuous or error-free operation of the 'ADEYA' App and that any dependence on its functionality is done at the user's own risk.",
      '8.5':
        'Blockster Labs Pvt Ltd responsibility is restricted to the fullest extent permissible by law in places where the exclusion or limitation of liability for consequential or incidental damages is not permitted.',
    },
  },
  {
    title: '9. Termination',
    subtitle: {
      '9.1':
        "Blockster Labs Pvt Ltd retains the right to deny or restrict a user's access to the 'ADEYA' App at any time and for any reason, including but not limited to a violation of these general terms and conditions, without prior warning or responsibility.",
      '9.2':
        "The user has the option to stop using the 'ADEYA' App whenever they choose by uninstalling it and doing so.",
      '9.3':
        "If the agreement is terminated, the user's right to use the 'ADEYA' App will end immediately, and they must uninstall it as soon as possible and remove any copies of it from their devices.",
    },
  },
  {
    title: '10. Governing Law and Dispute Resolution',
    subtitle: {
      '10.1':
        'The Indian laws will be applicable to the present contract without regard to its rules on conflicts of laws and the same shall govern these general terms and conditions and be followed in interpreting them.',
      '10.2':
        'In case of any dispute arising out of the said agreement of general terms and conditions the same shall be resolved as far as possible amicably but in case the same cannot be resolved amicably then the dispute shall be referred to a Sole Arbitrator appointed by Blockster Labs Pvt Ltd and the same shall be governed by provisions of Arbitration and Conciliation Act, 1996 and further amended from time to time. The seat and place of Arbitration shall be Pune and language of Arbitration proceedings shall be English.',
      '10.3':
        'Further, the Courts of Pune shall have exclusive jurisdiction to decide the dispute which may so arise in case the Arbitration proceedings cannot decide the dispute between the parties to the present agreement.',
    },
  },
  {
    title: '11. Severability',
    subtitle: {
      '11.1':
        'The remaining terms of these general terms and conditions shall remain in full force and effect in the event that any provision is judged to be invalid, unlawful, or unenforceable.',
    },
  },
  {
    title: '12. Entire Agreement',
    subtitle: {
      '12.1':
        "These general terms and conditions replace all prior or contemporaneous oral or written agreements, communications, or understandings with respect to the subject matter hereof and represent the complete agreement between the user and Blockster Labs Pvt Ltd with regard to the use of the 'ADEYA' App.",
    },
  },
  {
    title: '13. Contact Information',
    subtitle: {
      '13.1':
        "Users can get in touch with Blockster Labs at info@blockster.global if they have any questions, issues, or suggestions about these GTC or the 'ADEYA' App.\n\n01/09/2023 is the date on which these general terms and conditions take effect.",
    },
  },
]

const Terms: React.FC = () => {
  const [, dispatch] = useStore()
  const [checked, setChecked] = useState(false)
  const { t } = useTranslation()
  const navigation = useNavigation<StackNavigationProp<AuthenticateStackParams>>()
  const { OnboardingTheme, TextTheme } = useTheme()
  const onSubmitPressed = () => {
    dispatch({
      type: DispatchAction.DID_AGREE_TO_TERMS,
    })

    navigation.navigate(Screens.CreatePIN)
  }
  const style = StyleSheet.create({
    container: {
      ...OnboardingTheme.container,
      padding: 20,
    },
    bodyText: {
      ...TextTheme.normal,
      flexShrink: 1,
    },
    titleText: {
      ...TextTheme.normal,
      marginTop: 20,
      fontWeight: 'bold',
      flexShrink: 1,
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
      marginRight: 15,
    },
  })

  const onBackPressed = () => {
    navigation.navigate(Screens.Onboarding)
  }

  return (
    <SafeAreaView edges={['left', 'right', 'bottom']}>
      <ScrollView style={[style.container]}>
        <InfoTextBox>Please agree to the terms and conditions below before using this application.</InfoTextBox>

        {terms.map(para => (
          <>
            <Text style={style.titleText}>{para.title}</Text>
            {Object.keys(para.subtitle).map(subtitleCount => (
              <View style={style.paragraph}>
                <Text style={[style.enumeration]}>{subtitleCount}</Text>
                <Text style={[style.bodyText]}>{para.subtitle[subtitleCount]}</Text>
              </View>
            ))}
          </>
        ))}
        <View style={[style.controlsContainer]}>
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
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Terms
