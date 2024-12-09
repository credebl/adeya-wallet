import axios from 'axios'
import startCase from 'lodash.startcase'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
// require the module
import * as RNFS from 'react-native-fs'

import { hiddenFieldValue } from '../../constants'
import { useTheme } from '../../contexts/theme'
import { W3CCredentialAttribute } from '../../types/record'
import { testIdWithKey } from '../../utils/testable'

interface W3CCredentialRecordFieldProps {
  field: W3CCredentialAttribute
  hideFieldValue?: boolean
  hideBottomBorder?: boolean
  shown?: boolean
  onToggleViewPressed?: () => void
}

export const validEncoding = 'base64'
export const validFormat = new RegExp('^image/(jpeg|png|jpg)')

interface AttributeValueParams {
  field: W3CCredentialAttribute
  shown?: boolean
  style?: Record<string, unknown>
}

export const isValidURL = (url: string) => {
  const regex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/
  return regex.test(encodeURI(url))
}

const openUrl = async (Url: string) => {
  await Linking.openURL(Url)
}
async function downloadAndAddMetadata(imageUrl: string) {
  try {
    // 1. Download the image from the URL
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' })

    const buffer = Buffer.from(response.data)

    // // 2. Add metadata to the downloaded PNG
    // const pngWithMetadata = PngItxt.set(buffer, {
    //   keyword: 'CustomMetadata',
    //   value: metadata,
    // })

    // 3. Save the modified image locally
    const outputPath = `${RNFS.DocumentDirectoryPath}/modified-image.png`
    await RNFS.writeFile(outputPath, buffer.toString('base64'), 'base64')
  } catch (error) {
    //Error message
  }
}
export const AttributeValue: React.FC<AttributeValueParams> = ({ field, style, shown }) => {
  const { ListItems } = useTheme()
  const styles = StyleSheet.create({
    text: {
      ...ListItems.recordAttributeText,
    },
  })
  const tarea_regex = /(?:https?|ftp):\/\/[\S]*\.(?:png|jpe?g|gif|svg|webp)(?:\?\S+=\S*(?:&\S+=\S*)*)?/gi
  const tarea: string | number | boolean = field.value
  if (tarea_regex.test(String(tarea).toLowerCase()) == true) {
    if (isValidURL(tarea.toString())) {
      return (
        <TouchableOpacity
          onPress={() => {
            if (tarea.toString().includes('.png')) {
              downloadAndAddMetadata(tarea.toString())
            } else {
              openUrl(tarea.toString())
            }
          }}>
          <Text style={style || styles.text} testID={testIdWithKey('AttributeValue')}>
            {shown ? field.value : hiddenFieldValue}
          </Text>
        </TouchableOpacity>
      )
    }
  }
  return (
    <Text style={style || styles.text} testID={testIdWithKey('AttributeValue')}>
      {shown ? field.value : hiddenFieldValue}
    </Text>
  )
}

const W3CCredentialRecordField: React.FC<W3CCredentialRecordFieldProps> = ({
  field,
  hideFieldValue = false,
  hideBottomBorder = false,
  shown = !hideFieldValue,
  onToggleViewPressed = () => undefined,
}) => {
  const { t } = useTranslation()
  const { ListItems } = useTheme()
  const styles = StyleSheet.create({
    container: {
      ...ListItems.recordContainer,
      paddingHorizontal: 25,
      paddingTop: 16,
    },
    border: {
      ...ListItems.recordBorder,
      borderBottomWidth: 2,
      paddingTop: 12,
    },
    link: {
      ...ListItems.recordLink,
      paddingVertical: 2,
    },
    valueContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingTop: 10,
    },
    valueText: {
      ...ListItems.recordAttributeText,
      paddingVertical: 4,
      width: '90%',
    },
  })

  return (
    <View style={styles.container}>
      <Text style={[ListItems.recordAttributeLabel, { fontWeight: 'bold' }]} testID={testIdWithKey('AttributeName')}>
        {field.key ?? startCase(field.key || '')}
      </Text>
      <View style={styles.valueContainer}>
        <>
          <View style={styles.valueText}>
            <AttributeValue field={field} shown={shown} />
          </View>
          {hideFieldValue ? (
            <TouchableOpacity
              accessible={true}
              accessibilityLabel={shown ? t('Record.Hide') : t('Record.Show')}
              testID={testIdWithKey('ShowHide')}
              activeOpacity={1}
              onPress={onToggleViewPressed}
              style={styles.link}>
              <Text style={ListItems.recordLink}>{shown ? t('Record.Hide') : t('Record.Show')}</Text>
            </TouchableOpacity>
          ) : null}
        </>
      </View>
      <View style={[styles.border, hideBottomBorder && { borderBottomWidth: 0 }]} />
    </View>
  )
}

export default W3CCredentialRecordField
