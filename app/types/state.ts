export interface Onboarding {
  didCompleteTutorial: boolean
  didAgreeToTerms: boolean
  didCreatePIN: boolean
  didConsiderBiometry: boolean
  didNameWallet: boolean
}

export interface Preferences {
  useBiometry: boolean
  biometryPreferencesUpdated: boolean
  developerModeEnabled: boolean
  useVerifierCapability?: boolean
  useConnectionInviterCapability?: boolean
  useDevVerifierTemplates?: boolean
  walletName: string
}

export interface Tours {
  seenToursPrompt: boolean
  enableTours: boolean
  seenHomeTour: boolean
}

export interface Lockout {
  displayNotification: boolean
}

export interface LoginAttempt {
  lockoutDate?: number
  servedPenalty: boolean
  loginAttempts: number
}

export interface Authentication {
  didAuthenticate: boolean
}

export interface DeepLink {
  activeDeepLink?: string
}
export interface IASEnvironment {
  name: string
  iasAgentInviteUrl: string
  iasPortalUrl: string
}
export interface Developer {
  environment: IASEnvironment
}

export interface DismissPersonCredentialOffer {
  personCredentialOfferDismissed: boolean
}

export interface State {
  onboarding: Onboarding
  authentication: Authentication
  lockout: Lockout
  loginAttempt: LoginAttempt
  preferences: Preferences
  tours: Tours
  deepLink: DeepLink
  loading: boolean
  developer: Developer
  dismissPersonCredentialOffer: DismissPersonCredentialOffer
}
