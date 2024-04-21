import { CredentialExchangeRecord } from '@adeya/ssi'
import { Attribute, Predicate } from '@hyperledger/aries-oca/build/legacy'
import React from 'react'
import { Image, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native'

import { GenericFn } from '../../types/fn'

interface CredentialCardProps {
  credential?: CredentialExchangeRecord
  credDefId?: string
  schemaId?: string
  credName?: string
  onPress?: GenericFn
  style?: ViewStyle
  proof?: boolean
  displayItems?: (Attribute | Predicate)[]
  existsInWallet?: boolean
  connectionLabel?: string
  satisfiedPredicates?: boolean
  hasAltCredentials?: boolean
  handleAltCredChange?: () => void
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 2,
    paddingTop: 2,
    paddingBottom: 5,
    borderRadius: 20,
    elevation: 3,
  },
})

const BadgeCard: React.FC<CredentialCardProps> = ({ credential, onPress = undefined }) => {
  // TODO: Update the attr name if need to display the image in the badge card
  const imageData = credential?.credentialAttributes?.find(attr => attr.name === 'image')

  if (!imageData) {
    return null
  }

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={{ uri: imageData.value }} style={{ height: 200, width: 200, borderRadius: 20 }} />
    </TouchableOpacity>
  )
}

export default BadgeCard
