export interface CredentialData {
  credentialId: string
  schemaId: string
  attributes: {
    name: string
    value: string
  }[]
}
