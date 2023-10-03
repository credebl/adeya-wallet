import { useAdeyaAgent } from '@adeya/ssi'
import {
  AnonCredsModule,
  LegacyIndyCredentialFormatService,
  LegacyIndyProofFormatService,
  V1CredentialProtocol,
  V1ProofProtocol,
  AnonCredsCredentialFormatService,
  AnonCredsProofFormatService,
} from '@aries-framework/anoncreds'
import { AnonCredsRsModule } from '@aries-framework/anoncreds-rs'
import { AskarModule } from '@aries-framework/askar'
import {
  AutoAcceptCredential,
  ConnectionsModule,
  CredentialsModule,
  MediatorPickupStrategy,
  ProofsModule,
  MediationRecipientModule,
  V2CredentialProtocol,
  V2ProofProtocol,
  AutoAcceptProof,
  JsonLdCredentialFormatService,
} from '@aries-framework/core'
import { IndyVdrAnonCredsRegistry, IndyVdrModule, IndyVdrPoolConfig } from '@aries-framework/indy-vdr'
import { PushNotificationsFcmModule } from '@aries-framework/push-notifications'
import { anoncreds } from '@hyperledger/anoncreds-react-native'
import { ariesAskar } from '@hyperledger/aries-askar-react-native'
import { indyVdr } from '@hyperledger/indy-vdr-react-native'

interface GetAgentModulesOptions {
  indyNetworks: IndyVdrPoolConfig[]
  mediatorInvitationUrl?: string
}

export function getAgentModules({ indyNetworks, mediatorInvitationUrl }: GetAgentModulesOptions) {
  const indyCredentialFormat = new LegacyIndyCredentialFormatService()
  const indyProofFormat = new LegacyIndyProofFormatService()
  const jsonLdCredentialFormat = new JsonLdCredentialFormatService()

  return {
    askar: new AskarModule({
      ariesAskar,
    }),
    anoncredsRs: new AnonCredsRsModule({
      anoncreds,
    }),
    anoncreds: new AnonCredsModule({
      registries: [new IndyVdrAnonCredsRegistry()],
    }),
    indyVdr: new IndyVdrModule({
      indyVdr,
      networks: indyNetworks as [IndyVdrPoolConfig],
    }),
    connections: new ConnectionsModule({
      autoAcceptConnections: true,
    }),
    credentials: new CredentialsModule({
      autoAcceptCredentials: AutoAcceptCredential.ContentApproved,
      credentialProtocols: [
        new V1CredentialProtocol({ indyCredentialFormat }),
        new V2CredentialProtocol({
          credentialFormats: [indyCredentialFormat, new AnonCredsCredentialFormatService(), jsonLdCredentialFormat],
        }),
      ],
    }),
    proofs: new ProofsModule({
      autoAcceptProofs: AutoAcceptProof.ContentApproved,
      proofProtocols: [
        new V1ProofProtocol({ indyProofFormat }),
        new V2ProofProtocol({
          proofFormats: [indyProofFormat, new AnonCredsProofFormatService()],
        }),
      ],
    }),
    mediationRecipient: new MediationRecipientModule({
      mediatorInvitationUrl: mediatorInvitationUrl,
      mediatorPickupStrategy: MediatorPickupStrategy.PickUpV2,
    }),
    pushNotificationsFcm: new PushNotificationsFcmModule(),
  }
}

// interface MyAgentContextInterface {
//   loading: boolean
//   agent?: AdeyaAgent
//   setAgent: (agent?: AdeyaAgent) => void
// }

export const useAppAgent = useAdeyaAgent
