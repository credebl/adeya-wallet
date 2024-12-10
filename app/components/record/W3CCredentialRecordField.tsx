/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-use-before-define */
import crc32 from 'crc-32'
import startCase from 'lodash.startcase'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
// require the module
import * as RNFS from 'react-native-fs'
import RNFetchBlob from 'rn-fetch-blob'

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

const createPngWithItxt = (outputPath: any, metadata: any, bitmap: any) => {
  const pngSignature: any = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]

  const chunks = []

  // Encode image data (assuming bitmap data, usually an IDAT chunk)
  const imageData = encodeBitmapToPngData(bitmap)
  chunks.push(createChunk('IHDR', new Array(13))) // Example IHDR chunk
  chunks.push(createChunk('IDAT', imageData))

  // Encode iTXt chunk
  try {
    const iTXtData = encodeItxtData(metadata)
    chunks.push(createChunk('iTXt', iTXtData))
  } catch (error) {
    console.error('Invalid metadata format:', error)
    return
  }

  // End chunk
  const endChunkData: any = []
  chunks.push(createChunk('IEND', endChunkData))

  // Write to PNG file
  try {
    RNFS.writeFile(outputPath, pngSignature.concat(...chunks), 'base64')
      .then(() => {
        console.log('File created successfully at:', outputPath)
        // Now share the image
        shareImage(outputPath)
      })
      .catch(error => {
        console.error('Error saving file:', error)
      })
  } catch (error) {
    console.error('File write error:', error)
  }
}

const createChunk = (type: any, data: any) => {
  const lengthBytes = Buffer.alloc(4)
  lengthBytes.writeUInt32BE(data.length, 0)
  const typeBytes = Buffer.from(type, 'ascii')

  // Calculate CRC
  const crc = crc32.buf(Buffer.concat([typeBytes, Buffer.from(data)]))
  const crcBytes = Buffer.alloc(4)
  crcBytes.writeUInt32BE(crc, 0)

  return Buffer.concat([lengthBytes, typeBytes, Buffer.from(data), crcBytes])
}

const encodeItxtData = (metadata: any) => {
  const parts = metadata.split(';')
  if (parts.length < 2) {
    throw new Error('Invalid metadata format')
  }

  const keyword = parts[0].split('=')[0].trim()
  const text = parts[1].split('=')[1].trim()

  // Validate keyword
  if (!/^[a-zA-Z0-9_]+$/.test(keyword)) {
    throw new Error('Invalid character in keyword')
  }

  // Validate language tag (simplified for example)
  const languageTag = 'eng'
  if (!/^[a-zA-Z]{2,3}(-[a-zA-Z]{2,8})*$/.test(languageTag)) {
    throw new Error('Invalid language tag syntax')
  }

  const compressed = false
  const translatedKeyword = ''

  const iTXtData = []
  iTXtData.push(keyword.length)
  iTXtData.push(...Buffer.from(keyword, 'ascii'))
  iTXtData.push(compressed ? 1 : 0) // Compression flag
  iTXtData.push(languageTag.length)
  iTXtData.push(...Buffer.from(languageTag, 'ascii'))
  iTXtData.push(translatedKeyword.length)
  iTXtData.push(...Buffer.from(translatedKeyword, 'ascii'))
  iTXtData.push(...Buffer.from(text, 'utf-8'))

  return Buffer.from(iTXtData)
}

const encodeBitmapToPngData = (bitmap: any) => {
  const base64Data = bitmap.toBase64String()
  return Buffer.from(base64Data, 'base64')
}

const shareImage = (imagePath: any) => {
  // Implement the logic to share the image
  // This is typically handled by a native module like `react-native-share`
  // Example:
  // Share.open({ url: imagePath });
  console.log('Image shared:', imagePath)
}

async function downloadAndAddMetadata(imageUrl: string) {
  console.log('\n\n\n\n Android downloadAndAddMetadata = ')
  try {
    // 1. Download the image from the URL
    const response = await RNFetchBlob.config({
      fileCache: true,
    }).fetch('GET', imageUrl)

    // Convert response to base64 string
    const base64Data = await response.base64()

    if (base64Data) {
      const bitmap = `data:image/png;base64,${base64Data}`

      // const response = await axios.get(imageUrl, { responseType: 'arraybuffer' })

      // const buffer = Buffer.from(response.data)

      // // 2. Add metadata to the downloaded PNG
      // const pngWithMetadata = PngItxt.set(buffer, {
      //   keyword: 'CustomMetadata',
      //   value: metadata,
      // })

      // 3. Save the modified image locally
      const metadata = 'Author=John Doe; Description=This is a sample image'
      const outputPath = `${RNFS.DocumentDirectoryPath}/modified-image.png`
      createPngWithItxt(outputPath, metadata, bitmap)
      console.log('\n\n\n\n Android outputPath = ', outputPath)
    }

    // await RNFS.writeFile(outputPath, buffer.toString('base64'), 'base64')
  } catch (error) {
    console.log('\n\n\n\n Android ERROR = ', error)
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
