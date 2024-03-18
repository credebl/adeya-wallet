export interface CredentialData {
  credentialId: string
  schemaId: string
  invitationUrl?: string
  attributes: {
    name: string
    value: string
  }[]
  invitation?: string
}
