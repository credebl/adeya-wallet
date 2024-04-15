import { AnonCredsCredentialMetadataKey, CredentialExchangeRecord, CredentialState } from '@adeya/ssi'
import { ImageSourcePropType } from 'react-native'

import { Attribute, Field, W3CCredentialAttribute, W3CCredentialAttributeField } from '../types/record'

import { luminanceForHexColor } from './luminance'

export const isValidAnonCredsCredential = (credential: CredentialExchangeRecord) => {
  return (
    credential &&
    credential.state === CredentialState.OfferReceived &&
    credential.credentialAttributes &&
    credential.credentialAttributes?.length > 0
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const credentialTextColor = (ColorPallet: any, hex?: string) => {
  const midpoint = 255 / 2
  if ((luminanceForHexColor(hex ?? '') ?? 0) >= midpoint) {
    return ColorPallet.grayscale.darkGrey
  }
  return ColorPallet.grayscale.white
}

export const toImageSource = (source: unknown): ImageSourcePropType => {
  if (typeof source === 'string') {
    return { uri: source as string }
  }
  return source as ImageSourcePropType
}

export const getCredentialIdentifiers = (credential: CredentialExchangeRecord) => {
  return {
    credentialDefinitionId: credential.metadata.get(AnonCredsCredentialMetadataKey)?.credentialDefinitionId,
    schemaId: credential.metadata.get(AnonCredsCredentialMetadataKey)?.schemaId,
  }
}

export const isW3CCredential = (credential: CredentialExchangeRecord) => {
  return (
    credential &&
    credential.credentials[0].credentialRecordType === 'w3c' &&
    credential.credentialAttributes?.length === 0
  )
}

export const sanitizeString = (str: string) => {
  const result = str.replace(/([a-z0-9])([A-Z])/g, '$1 $2')
  let words = result.split(' ')
  words = words.map((word, index) => {
    if (index === 0) {
      return word.charAt(0).toUpperCase() + word.slice(1)
    } else {
      return word.charAt(0).toLowerCase() + word.slice(1)
    }
  })
  return words.join(' ')
}

export const formatCredentialSubject = (
  subject: any,
  depth = 0,
  parent?: string,
  title?: string,
): W3CCredentialAttributeField[] => {
  const stringRows: W3CCredentialAttribute[] = []
  const objectTables: W3CCredentialAttributeField[] = []

  Object.keys(subject).forEach(key => {
    if (key === 'id' || key === 'type') return // omit id and type

    const value = subject[key]

    if (!value) return // omit properties with no value

    if (typeof value === 'string') {
      stringRows.push({
        key: sanitizeString(key),
        value: value,
      })
      // FIXME: Handle arrays
    } else if (typeof value === 'object' && value !== null) {
      objectTables.push(
        ...formatCredentialSubject(value as Record<string, unknown>, depth + 1, title, sanitizeString(key)),
      )
    }
  })

  const tableData = [{ title, rows: stringRows, depth, parent }, ...objectTables]
  return tableData.filter(table => table.rows.length > 0)
}

export const buildFieldsFromJSONLDCredential = (credentialSubject: any): Array<Field> => {
  const result = []
  for (const property in credentialSubject) {
    let encoding
    let format

    if (property === 'image') {
      encoding = 'base64'
      format = 'image/png'
    }
    result.push({
      name: property,
      value: credentialSubject[property],
      encoding: encoding,
      format: format,
    })
  }
  return result.map(attr => new Attribute(attr)) || []
}
