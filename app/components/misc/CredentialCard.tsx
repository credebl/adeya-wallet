import { CredentialExchangeRecord, W3cCredentialRecord } from '@adeya/ssi'
import { Attribute, BrandingOverlayType, Predicate } from '@hyperledger/aries-oca/build/legacy'
import React from 'react'
import { ViewStyle } from 'react-native'

import { useConfiguration } from '../../contexts/configuration'
import { useTheme } from '../../contexts/theme'
import { GenericFn } from '../../types/fn'

import CredentialCard10 from './CredentialCard10'
import CredentialCard11 from './CredentialCard11'

interface CredentialCardProps {
  credential?: CredentialExchangeRecord | W3cCredentialRecord
  credDefId?: string
  schemaId?: string
  credName?: string
  onPress?: GenericFn
  style?: ViewStyle
  proof?: boolean
  displayItems?: (Attribute | Predicate)[]
  existsInWallet?: boolean
  connectionLabel?: string
}

const CredentialCard: React.FC<CredentialCardProps> = ({
  credential,
  credDefId,
  schemaId,
  proof,
  displayItems,
  credName,
  existsInWallet,
  style = {},
  onPress = undefined,
  connectionLabel = '',
}) => {
  // add ability to reference credential by ID, allows us to get past react hook restrictions
  const { OCABundleResolver } = useConfiguration()
  const { ColorPallet } = useTheme()
  const getCredOverlayType = (type: BrandingOverlayType) => {
    if (proof) {
      return (
        <CredentialCard11
          displayItems={displayItems}
          style={{ backgroundColor: ColorPallet.brand.secondaryBackground }}
          error={!existsInWallet}
          credName={credName}
          credDefId={credDefId}
          schemaId={schemaId}
          credential={credential as CredentialExchangeRecord}
          proof
          elevated
        />
      )
    }

    if (credential instanceof W3cCredentialRecord || credential?.credentialAttributes?.length === 0) {
      return (
        <CredentialCard11
          connectionLabel={connectionLabel}
          credDefId={credDefId}
          schemaId={schemaId}
          credName={credName}
          displayItems={displayItems}
          style={style}
          onPress={onPress}
        />
      )
    } else if (credential instanceof CredentialExchangeRecord) {
      if (type === BrandingOverlayType.Branding01) {
        return <CredentialCard10 credential={credential} style={style} onPress={onPress} />
      } else {
        return <CredentialCard11 credential={credential} style={style} onPress={onPress} />
      }
    }
  }
  return getCredOverlayType(OCABundleResolver.cardOverlayType)
}

export default CredentialCard
