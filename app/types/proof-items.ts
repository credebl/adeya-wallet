import { CredentialExchangeRecord, W3cCredentialRecord } from '@adeya/ssi'
import { Attribute, Predicate } from '@hyperledger/aries-oca/build/legacy'

export interface ProofCredentialAttributes {
  altCredentials?: string[]
  credExchangeRecord?: CredentialExchangeRecord
  credId: string
  credDefId?: string
  schemaId?: string
  credName: string
  attributes?: Attribute[]
}

export interface ProofCredentialPredicates {
  altCredentials?: string[]
  credExchangeRecord?: CredentialExchangeRecord
  credId: string
  credDefId?: string
  schemaId?: string
  credName: string
  predicates?: Predicate[]
}

export interface ProofCredentialItems extends ProofCredentialAttributes, ProofCredentialPredicates {}

export type AttributeType = 'FILLED_ATTRIBUTE'

export type FilledAttributes = {
  name: string
  revoked: boolean
  value: string
  selfAttested: boolean
  revocationStatus: string
  type: AttributeType
  selfAttestedAllowed: boolean
}

export interface FormattedSubmission {
  id: string
  name: string
  purpose?: string
  areAllSatisfied: boolean
  entries: FormattedSubmissionEntry[]
}

export interface FormattedSubmissionEntry {
  id: string
  name: string
  isSatisfied: boolean
  credentialName: string
  issuerName?: string
  description?: string
  requestedAttributes?: string[]
  filledAttributes?: FilledAttributes[][]
  backgroundColor?: string
  selectedCredentialIndex: number
  credentialRecordIds: string[]
  inputDescriptorId: string
  credentialRecords: W3cCredentialRecord[]
}

export type W3cIssuerJson = {
  id: string
}

export type W3cCredentialSubjectJson = {
  id?: string
  [key: string]: unknown
}

export type W3cCredentialJson = {
  type: Array<string>
  issuer: W3cIssuerJson
  issuanceDate: string
  expiryDate?: string
  credentialSubject: W3cCredentialSubjectJson | W3cCredentialSubjectJson[]
}
