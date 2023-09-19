import AsyncStorage from '@react-native-async-storage/async-storage'

import { LocalStorageKeys } from '../../constants'
import {
  Preferences as PreferencesState,
  Tours as ToursState,
  Onboarding as OnboardingState,
  Authentication as AuthenticationState,
  Lockout as LockoutState,
  LoginAttempt as LoginAttemptState,
  State,
  IASEnvironment,
} from '../../types/state'
import { generateRandomWalletName } from '../../utils/helpers'

enum OnboardingDispatchAction {
  ONBOARDING_UPDATED = 'onboarding/onboardingStateLoaded',
  DID_COMPLETE_TUTORIAL = 'onboarding/didCompleteTutorial',
  DID_AGREE_TO_TERMS = 'onboarding/didAgreeToTerms',
  DID_CREATE_PIN = 'onboarding/didCreatePIN',
  DID_NAME_WALLET = 'onboarding/didNameWallet',
}

enum LockoutDispatchAction {
  LOCKOUT_UPDATED = 'lockout/lockoutUpdated',
}

enum LoginAttemptDispatchAction {
  ATTEMPT_UPDATED = 'loginAttempt/loginAttemptUpdated',
}
enum DeveloperDispatchAction {
  UPDATE_ENVIRONMENT = 'developer/updateEnvironment',
}
enum DismissPersonCredentialOfferDispatchAction {
  PERSON_CREDENTIAL_OFFER_DISMISSED = 'dismissPersonCredentialOffer/personCredentialOfferDismissed',
}

enum PreferencesDispatchAction {
  ENABLE_DEVELOPER_MODE = 'preferences/enableDeveloperMode',
  USE_BIOMETRY = 'preferences/useBiometry',
  PREFERENCES_UPDATED = 'preferences/preferencesStateLoaded',
  USE_VERIFIER_CAPABILITY = 'preferences/useVerifierCapability',
  USE_CONNECTION_INVITER_CAPABILITY = 'preferences/useConnectionInviterCapability',
  USE_DEV_VERIFIER_TEMPLATES = 'preferences/useDevVerifierTemplates',
  UPDATE_WALLET_NAME = 'preferences/updateWalletName',
}

enum ToursDispatchAction {
  TOUR_DATA_UPDATED = 'tours/tourDataUpdated',
  UPDATE_SEEN_TOUR_PROMPT = 'tours/seenTourPrompt',
  ENABLE_TOURS = 'tours/enableTours',
  UPDATE_SEEN_HOME_TOUR = 'tours/seenHomeTour',
}

enum AuthenticationDispatchAction {
  DID_AUTHENTICATE = 'authentication/didAuthenticate',
}

enum DeepLinkDispatchAction {
  ACTIVE_DEEP_LINK = 'deepLink/activeDeepLink',
}

export type DispatchAction =
  | OnboardingDispatchAction
  | LoginAttemptDispatchAction
  | LockoutDispatchAction
  | PreferencesDispatchAction
  | ToursDispatchAction
  | AuthenticationDispatchAction
  | DeepLinkDispatchAction
  | DeveloperDispatchAction
  | DismissPersonCredentialOfferDispatchAction

export const DispatchAction = {
  ...OnboardingDispatchAction,
  ...LoginAttemptDispatchAction,
  ...LockoutDispatchAction,
  ...PreferencesDispatchAction,
  ...ToursDispatchAction,
  ...AuthenticationDispatchAction,
  ...DeepLinkDispatchAction,
  ...DeveloperDispatchAction,
  ...DismissPersonCredentialOfferDispatchAction,
}

export interface ReducerAction<R> {
  type: R
  payload?: Array<any>
}
export const iasEnvironments: Array<IASEnvironment> = [
  {
    name: 'Production',
    iasAgentInviteUrl:
      'https://idim-agent.apps.silver.devops.gov.bc.ca?c_i=eyJAdHlwZSI6ICJkaWQ6c292OkJ6Q2JzTlloTXJqSGlxWkRUVUFTSGc7c3BlYy9jb25uZWN0aW9ucy8xLjAvaW52aXRhdGlvbiIsICJAaWQiOiAiZTZiY2EwNzQtYmNmNC00ZjQzLTgwMjYtNWNjZjhkN2M4OTQyIiwgImxhYmVsIjogIklESU0iLCAic2VydmljZUVuZHBvaW50IjogImh0dHBzOi8vaWRpbS1hZ2VudC5hcHBzLnNpbHZlci5kZXZvcHMuZ292LmJjLmNhIiwgImltYWdlVXJsIjogImh0dHBzOi8vaWQuZ292LmJjLmNhL3N0YXRpYy9Hb3YtMi4wL2ltYWdlcy9mYXZpY29uLmljbyIsICJyZWNpcGllbnRLZXlzIjogWyJHeXJxY2NQR1FtV3JxWGZ6cWtRTUF2VlBycmRWYUdwRkgxOHNOWkUzdUtGIl19',
    iasPortalUrl: 'https://id.gov.bc.ca/issuer/v1/dids',
  },
  {
    name: 'Development',
    iasAgentInviteUrl:
      'https://idim-agent-dev.apps.silver.devops.gov.bc.ca?c_i=eyJAdHlwZSI6ICJkaWQ6c292OkJ6Q2JzTlloTXJqSGlxWkRUVUFTSGc7c3BlYy9jb25uZWN0aW9ucy8xLjAvaW52aXRhdGlvbiIsICJAaWQiOiAiZDQ3NWM3ZjQtMTRjMy00NzdkLWI2NTMtY2Y5MDM4NDJmNGJjIiwgInJlY2lwaWVudEtleXMiOiBbIjJlSHBRRm9uTUVobXpvYWVFbUFMS1dxZHF5UldZZkE2TFF5akpKdGdiMldUIl0sICJsYWJlbCI6ICJJRElNIChEZXYpIiwgInNlcnZpY2VFbmRwb2ludCI6ICJodHRwczovL2lkaW0tYWdlbnQtZGV2LmFwcHMuc2lsdmVyLmRldm9wcy5nb3YuYmMuY2EiLCAiaW1hZ2VVcmwiOiAiaHR0cHM6Ly9pZC5nb3YuYmMuY2Evc3RhdGljL0dvdi0yLjAvaW1hZ2VzL2Zhdmljb24uaWNvIn0=',
    iasPortalUrl: 'https://iddev.gov.bc.ca/issuer/v1/dids',
  },
  {
    name: 'Test',
    iasAgentInviteUrl:
      'https://idim-sit-agent-dev.apps.silver.devops.gov.bc.ca?c_i=eyJAdHlwZSI6ICJkaWQ6c292OkJ6Q2JzTlloTXJqSGlxWkRUVUFTSGc7c3BlYy9jb25uZWN0aW9ucy8xLjAvaW52aXRhdGlvbiIsICJAaWQiOiAiNmNjMjJiNTYtZmQwYy00Yjc4LWE3ZTQtYzYwYzJlODBlMDM0IiwgInJlY2lwaWVudEtleXMiOiBbIkNoSmJDTTVZSlMxb3hTQU1WNU1vY1J5cE1tUVp0eFFqcG9KWEZpTHZnMUM5Il0sICJsYWJlbCI6ICJJRElNIChTSVQpIiwgInNlcnZpY2VFbmRwb2ludCI6ICJodHRwczovL2lkaW0tc2l0LWFnZW50LWRldi5hcHBzLnNpbHZlci5kZXZvcHMuZ292LmJjLmNhIiwgImltYWdlVXJsIjogImh0dHBzOi8vaWQuZ292LmJjLmNhL3N0YXRpYy9Hb3YtMi4wL2ltYWdlcy9mYXZpY29uLmljbyJ9',
    iasPortalUrl: 'https://idsit.gov.bc.ca/issuer/v1/dids',
  },
]
// export type ADDispatchActionType =
export const reducer = <S extends State>(state: S, action: ReducerAction<DispatchAction>): S => {
  switch (action.type) {
    case PreferencesDispatchAction.ENABLE_DEVELOPER_MODE: {
      const choice = (action?.payload ?? []).pop() ?? false
      const preferences = { ...state.preferences, developerModeEnabled: choice }

      AsyncStorage.setItem(LocalStorageKeys.Preferences, JSON.stringify(preferences))

      return {
        ...state,
        preferences,
      }
    }
    case PreferencesDispatchAction.USE_BIOMETRY: {
      const choice = (action?.payload ?? []).pop() ?? false
      const preferences = {
        ...state.preferences,
        useBiometry: choice,
      }
      const onboarding = {
        ...state.onboarding,
        didConsiderBiometry: true,
      }
      const newState = {
        ...state,
        onboarding,
        preferences,
      }

      AsyncStorage.setItem(LocalStorageKeys.Onboarding, JSON.stringify(onboarding))
      AsyncStorage.setItem(LocalStorageKeys.Preferences, JSON.stringify(preferences))

      return newState
    }
    case PreferencesDispatchAction.USE_VERIFIER_CAPABILITY: {
      const choice = (action?.payload ?? []).pop() ?? false
      const preferences = {
        ...state.preferences,
        useVerifierCapability: choice,
      }
      const newState = {
        ...state,
        preferences,
      }

      AsyncStorage.setItem(LocalStorageKeys.Preferences, JSON.stringify(preferences))

      return newState
    }
    case PreferencesDispatchAction.USE_CONNECTION_INVITER_CAPABILITY: {
      const choice = (action?.payload ?? []).pop() ?? false
      const preferences = {
        ...state.preferences,
        useConnectionInviterCapability: choice,
      }
      const newState = {
        ...state,
        preferences,
      }

      AsyncStorage.setItem(LocalStorageKeys.Preferences, JSON.stringify(preferences))

      return newState
    }
    case PreferencesDispatchAction.USE_DEV_VERIFIER_TEMPLATES: {
      const choice = (action?.payload ?? []).pop() ?? false
      const preferences = {
        ...state.preferences,
        useDevVerifierTemplates: choice,
      }
      const newState = {
        ...state,
        preferences,
      }

      AsyncStorage.setItem(LocalStorageKeys.Preferences, JSON.stringify(preferences))

      return newState
    }
    case PreferencesDispatchAction.PREFERENCES_UPDATED: {
      const preferences: PreferencesState = (action?.payload || []).pop()
      // For older wallets that haven't explicitly named their wallet yet
      if (!preferences.walletName) {
        preferences.walletName = generateRandomWalletName()
      }

      return {
        ...state,
        preferences,
      }
    }
    case PreferencesDispatchAction.UPDATE_WALLET_NAME: {
      // We should never see 'My Wallet - 123', that's just there to let us know something went wrong while saving the wallet name
      const name = (action?.payload ?? []).pop() ?? 'My Wallet - 123'
      const preferences = {
        ...state.preferences,
        walletName: name,
      }
      const newState = {
        ...state,
        preferences,
      }

      AsyncStorage.setItem(LocalStorageKeys.Preferences, JSON.stringify(preferences))

      return newState
    }
    case ToursDispatchAction.UPDATE_SEEN_TOUR_PROMPT: {
      const seenToursPrompt: ToursState = (action?.payload ?? []).pop() ?? false
      const tours = {
        ...state.tours,
        seenToursPrompt,
      }
      const newState = {
        ...state,
        tours,
      }

      return newState
    }
    case ToursDispatchAction.TOUR_DATA_UPDATED: {
      const tourData: ToursState = (action?.payload ?? []).pop() ?? {}
      const tours = {
        ...state.tours,
        ...tourData,
      }
      const newState = {
        ...state,
        tours,
      }

      return newState
    }
    case ToursDispatchAction.ENABLE_TOURS: {
      const enableTours = (action?.payload ?? []).pop() ?? false
      const tours = {
        ...state.tours,
      }
      if (enableTours) {
        tours.enableTours = enableTours
        tours.seenHomeTour = false
      } else {
        tours.enableTours = enableTours
      }
      const newState = {
        ...state,
        tours,
      }

      AsyncStorage.setItem(LocalStorageKeys.Tours, JSON.stringify(tours))

      return newState
    }
    case ToursDispatchAction.UPDATE_SEEN_HOME_TOUR: {
      const seenHomeTour = (action?.payload ?? []).pop() ?? false
      const tours = {
        ...state.tours,
        seenHomeTour,
      }

      if (seenHomeTour) {
        tours.enableTours = false
      }

      const newState = {
        ...state,
        tours,
      }

      AsyncStorage.setItem(LocalStorageKeys.Tours, JSON.stringify(tours))

      return newState
    }

    case LoginAttemptDispatchAction.ATTEMPT_UPDATED: {
      const loginAttempt: LoginAttemptState = (action?.payload || []).pop()
      const newState = {
        ...state,
        loginAttempt,
      }
      AsyncStorage.setItem(LocalStorageKeys.LoginAttempts, JSON.stringify(newState.loginAttempt))
      return newState
    }
    case LockoutDispatchAction.LOCKOUT_UPDATED: {
      const lockout: LockoutState = (action?.payload || []).pop()
      return {
        ...state,
        lockout,
      }
    }
    case OnboardingDispatchAction.ONBOARDING_UPDATED: {
      const onboarding: OnboardingState = (action?.payload || []).pop()
      return {
        ...state,
        onboarding,
      }
    }
    case OnboardingDispatchAction.DID_COMPLETE_TUTORIAL: {
      const onboarding = {
        ...state.onboarding,
        didCompleteTutorial: true,
      }
      const newState = {
        ...state,
        onboarding,
      }
      AsyncStorage.setItem(LocalStorageKeys.Onboarding, JSON.stringify(newState.onboarding))
      return newState
    }
    case OnboardingDispatchAction.DID_AGREE_TO_TERMS: {
      const onboarding: OnboardingState = {
        ...state.onboarding,
        didAgreeToTerms: true,
      }
      const newState = {
        ...state,
        onboarding,
      }
      AsyncStorage.setItem(LocalStorageKeys.Onboarding, JSON.stringify(newState.onboarding))
      return newState
    }
    case OnboardingDispatchAction.DID_CREATE_PIN: {
      const onboarding: OnboardingState = {
        ...state.onboarding,
        didCreatePIN: true,
      }
      const newState = {
        ...state,
        onboarding,
      }
      AsyncStorage.setItem(LocalStorageKeys.Onboarding, JSON.stringify(newState.onboarding))
      return newState
    }
    case OnboardingDispatchAction.DID_NAME_WALLET: {
      const onboarding = {
        ...state.onboarding,
        didNameWallet: true,
      }
      const newState = {
        ...state,
        onboarding,
      }

      AsyncStorage.setItem(LocalStorageKeys.Onboarding, JSON.stringify(onboarding))

      return newState
    }
    case AuthenticationDispatchAction.DID_AUTHENTICATE: {
      const value: AuthenticationState = (action?.payload || []).pop()
      const payload = value ?? { didAuthenticate: true }
      const newState = {
        ...state,
        ...{ authentication: payload },
      }
      return newState
    }
    case DeepLinkDispatchAction.ACTIVE_DEEP_LINK: {
      const value = (action?.payload || []).pop()
      return {
        ...state,
        ...{ deepLink: { activeDeepLink: value } },
      }
    }
    case DeveloperDispatchAction.UPDATE_ENVIRONMENT: {
      const environment: IASEnvironment = (action?.payload || []).pop()
      const developer = { ...state.developer, environment }

      // Persist IAS environment between app restarts
      AsyncStorage.setItem(LocalStorageKeys.Environment, JSON.stringify(developer.environment))
      return { ...state, developer }
    }
    case DismissPersonCredentialOfferDispatchAction.PERSON_CREDENTIAL_OFFER_DISMISSED: {
      const { personCredentialOfferDismissed } = (action?.payload || []).pop()
      const dismissPersonCredentialOffer = { ...state.dismissPersonCredentialOffer, personCredentialOfferDismissed }
      const newState = { ...state, dismissPersonCredentialOffer }

      // save to storage so notification doesn't reapper on app restart
      AsyncStorage.setItem(
        LocalStorageKeys.PersonCredentialOfferDismissed,
        JSON.stringify(newState.dismissPersonCredentialOffer),
      )
      return newState
    }
    default:
      return state
  }
}

export default reducer
