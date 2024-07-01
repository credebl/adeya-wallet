import type { StackScreenProps } from '@react-navigation/stack'

import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Platform, StyleSheet, TouchableOpacity, View } from 'react-native'
import RNHTMLtoPDF from 'react-native-html-to-pdf'
import { SafeAreaView } from 'react-native-safe-area-context'
import Share, { ShareOptions } from 'react-native-share'
import Icon from 'react-native-vector-icons/MaterialIcons'
import WebView from 'react-native-webview'

import { ColorPallet } from '../theme'
import { CredentialStackParams, Screens } from '../types/navigators'

type RenderCertificateProps = StackScreenProps<CredentialStackParams, Screens.RenderCertificate>

const defaultHtmlContent = `
    <div style="width:800px; height:600px; padding:20px; text-align:center; border: 10px solid #787878">
</div>
  `

const RenderCertificate: React.FC<RenderCertificateProps> = ({ navigation, route }) => {
  if (!route?.params) {
    throw new Error('RenderCertificate route prams were not set properly')
  }

  const { credential } = route?.params
  const [htmlContent, setHtmlContent] = useState(defaultHtmlContent)
  const [loader, setLoader] = useState(false)

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
  })

  const fetchHtmlContent = async () => {
    try {
      const certificateAttributes = credential.credential.credentialSubject.claims

      let content = credential.credential.prettyVc

      Object.keys(certificateAttributes).forEach(key => {
        // Statically picking the value of placeholder
        const placeholder = `{{credential['${key}']}}`
        // Escaping the placeholder to avoid regex issues
        const escapedPlaceholder = placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        // Replacing the placeholder with the actual value
        content = content.replace(new RegExp(escapedPlaceholder, 'g'), certificateAttributes[key])
      })

      setHtmlContent(content)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error mapping HTML content:', error)
    }
  }

  const downloadHtmlToPdf = async () => {
    try {
      setLoader(true)
      const options: RNHTMLtoPDF.Options = {
        html: htmlContent,
        fileName: credential.credential.type[1],
        directory: 'Documents',
      }

      const file = await RNHTMLtoPDF.convert(options)

      let filePath = file.filePath as string

      if (Platform.OS === 'android') {
        filePath = 'file://' + filePath
      }

      setLoader(false)

      const shareOptions: ShareOptions = { url: filePath }
      await Share.open(shareOptions)
    } catch (e) {
      setLoader(false)
      // eslint-disable-next-line no-console
      console.log('error downloading html to pdf', e)
    }
  }

  useEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        loader ? (
          <View style={{ marginRight: 20 }}>
            <ActivityIndicator size="small" color={ColorPallet.grayscale.white} />
          </View>
        ) : (
          <TouchableOpacity onPress={downloadHtmlToPdf} style={{ marginRight: 20 }}>
            <Icon style={{ color: ColorPallet.grayscale.white }} size={25} name="download" />
          </TouchableOpacity>
        ),
    })
  }, [navigation, htmlContent, loader])

  useEffect(() => {
    fetchHtmlContent()
  }, [])

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <WebView source={{ html: htmlContent }} originWhitelist={['*']} />
    </SafeAreaView>
  )
}

export default RenderCertificate
