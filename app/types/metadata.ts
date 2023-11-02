export enum CredentialMetadata {
  customMetadata = 'customMetadata',
}

export interface customMetadata {
  revoked_seen?: boolean
  revoked_detail_dismissed?: boolean
}

export enum BasicMessageMetadata {
  customMetadata = 'customMetadata',
}

export interface basicMessageCustomMetadata {
  seen?: boolean
}
