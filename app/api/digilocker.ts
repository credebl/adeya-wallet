import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { Linking } from 'react-native'
import { Config } from 'react-native-config'

import { generateCodeChallenge } from '../utils/crypto'

const DIGILOCKER_CLIENT_ID = Config.DIGILOCKER_CLIENT_ID
const DIGILOCKER_CLIENT_SECRET = Config.DIGILOCKER_CLIENT_SECRET
const DIGILOCKER_REDIRECT_URI = Config.DIGILOCKER_REDIRECT_URI

export const initiateDigiLockerOAuth = async (codeVerifier: string): Promise<void | Error> => {
  try {
    AsyncStorage.setItem('codeVerifier', codeVerifier)
    const codeChallenge = generateCodeChallenge(codeVerifier)

    const authUrl = `https://api.digitallocker.gov.in/public/oauth2/1/authorize?response_type=code&client_id=${DIGILOCKER_CLIENT_ID}&redirect_uri=${DIGILOCKER_REDIRECT_URI}&state=adeya2024&code_challenge=${codeChallenge}&code_challenge_method=S256`

    await Linking.openURL(authUrl)
  } catch (error) {
    return error instanceof Error ? error : new Error('An unknown error occurred')
  }
}

export const fetchDigiLockerToken = async (
  authCode: string,
  codeVerifier: string,
): Promise<any | { message: string }> => {
  const tokenUrl = 'https://api.digitallocker.gov.in/public/oauth2/1/token'
  const clientSecret = DIGILOCKER_CLIENT_SECRET
  const clientId = DIGILOCKER_CLIENT_ID
  const redirectUri = DIGILOCKER_REDIRECT_URI

  const params =
    `grant_type=authorization_code&` +
    `code=${encodeURIComponent(authCode)}&` +
    `client_id=${encodeURIComponent(clientId)}&` +
    `client_secret=${encodeURIComponent(clientSecret)}&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
    `code_verifier=${encodeURIComponent(codeVerifier)}`

  try {
    const response = await axios.post(tokenUrl, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    return response.data
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
    return { message: `Error fetching DigiLocker token: ${errorMessage}` }
  }
}

export const fetchAadhaarData = async (accessToken: string): Promise<any | { message: string }> => {
  const aadhaarUrl = 'https://api.digitallocker.gov.in/public/oauth2/3/xml/eaadhaar'

  try {
    const response = await axios.get(aadhaarUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    return response.data
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
    return { message: `Error fetching Aadhaar data: ${errorMessage}` }
  }
}

export const fetchIssuedDocuments = async (accessToken: string): Promise<any | { message: string }> => {
  const issuedDocumentsUrl = 'https://api.digitallocker.gov.in/public/oauth2/2/files/issued'

  try {
    const response = await axios.get(issuedDocumentsUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    return response.data
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
    return { message: `Error fetching issued documents: ${errorMessage}` }
  }
}

export const fetchDocumentData = async (uri: string, accessToken: string): Promise<any | { message: string }> => {
  const documentUrl = `https://api.digitallocker.gov.in/public/oauth2/1/xml/${uri}`

  try {
    const response = await axios.get(documentUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    return response.data
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
    return { message: `Error fetching document data: ${errorMessage}` }
  }
}

export const fetchDocument = async (uri: string, accessToken: string): Promise<any | { message: string }> => {
  const documentUrl = `https://api.digitallocker.gov.in/public/oauth2/1/file/${uri}`

  try {
    const response = await axios.get(documentUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    return response.data
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
    return { message: `Error fetching document data: ${errorMessage}` }
  }
}
