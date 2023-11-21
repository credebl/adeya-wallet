export enum CredentialMetadata {
  customMetadata = 'customMetadata',
  metaData = 'metaData',
}

export interface metaData {
  data: {
    '_anoncreds/credentialRequest': {
      link_secret_blinding_data: {
        v_prime: string
        vr_prime: string | null
      }
      nonce: string
      link_secret_name: string
    }
    '_anoncreds/credential': {
      credentialDefinitionId: string
      schemaId: string
    }
  }
}

export interface customMetadata {
  revoked_seen?: boolean
  revoked_detail_dismissed?: boolean
}

export enum BasicMessageMetadata {
  customMetadata = 'customMetadata',
}

export interface BasicMessageCustomMetadata {
  seen?: boolean
}
