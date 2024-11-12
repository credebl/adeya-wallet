import {
  fetchAadhaarData,
  fetchDigiLockerToken,
  fetchDocumentData,
  fetchIssuedDocuments,
  initiateDigiLockerOAuth,
  parseAadhaarData,
  parseDrivingLicenseData,
  parsePANData,
} from '@adeya/digilocker'
import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useCallback, useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  AppState,
  Image,
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { Config } from 'react-native-config'
import { v4 as uuidv4 } from 'uuid'

import {
  DigiLocker,
  DigiLocker_Aadhaar_Logo,
  DigiLocker_ITD_Logo,
  DigiLocker_Logo,
  DigiLocker_NE_Preview_Logo,
} from '../constants'

const getQueryParams = (url: string): { [key: string]: string } => {
  const params: { [key: string]: string } = {}
  const parts = url.split('?')
  if (parts.length > 1) {
    const queryString = parts[1]
    queryString.split('&').forEach(param => {
      const [key, value] = param.split('=')
      if (key && value) {
        params[key] = decodeURIComponent(value)
      }
    })
  }
  return params
}
const DIGI_LOCKER_CLIENT_ID = Config.DIGILOCKER_CLIENT_ID
const DIGI_LOCKER_CLIENT_SECRET = Config.DIGILOCKER_CLIENT_SECRET
const DIGILOCKER_REDIRECT_URI = Config.DIGILOCKER_REDIRECT_URI

const DigiLockerScreen: React.FC = () => {
  const [appState, setAppState] = useState(AppState.currentState)
  const [authCode, setAuthCode] = useState<string | null>(null)
  const [aadhaarData, setAadhaarData] = useState<any>(null)
  const [isAadhaarVisible, setIsAadhaarVisible] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [codeVerifier, setCodeVerifier] = useState<string | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [documents, setDocuments] = useState<any[]>([])
  const styles = StyleSheet.create({
    card: {
      backgroundColor: '#4DC0E2',
      borderRadius: 10,
      width: '95%',
      alignSelf: 'center',
      margin: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 5,
      elevation: 8,
    },
    logo: { width: 60, height: 60, borderRadius: 35, alignSelf: 'center', marginRight: 10 },
    title: { color: '#FFFFFF', padding: 8, fontSize: 20, fontWeight: '500' },
    description: { color: '#FFFFFF', fontSize: 14, padding: 8, maxWidth: 300 },
    activityIndicator: {
      position: 'absolute',
      alignSelf: 'center',
      bottom: 20,
    },
  })

  const fetchAndStoreToken = async () => {
    if (!authCode || !codeVerifier) return
    try {
      const tokenResponse = await fetchDigiLockerToken({
        authCode: authCode,
        client_id: DIGI_LOCKER_CLIENT_ID,
        client_secret: DIGI_LOCKER_CLIENT_SECRET,
        redirect_url: DIGILOCKER_REDIRECT_URI,
        codeVerifier: codeVerifier,
      })
      const token = tokenResponse.access_token
      setAccessToken(token)
      await AsyncStorage.setItem('accessToken', token)
      const issuedDocumentsResponse = await fetchIssuedDocuments(token)
      setDocuments(issuedDocumentsResponse.items)
      setAuthCode(null)
    } catch (error) {
      Alert.alert('Error', `Please re-authenticate with DigiLocker${error ? `: ${error}` : ''}`)
    }
  }

  const handleDeepLink = useCallback(async (url: { url: string } | null) => {
    if (!url) return
    const params = getQueryParams(url.url)
    const code = params['code']
    setAuthCode(code)
    await AsyncStorage.setItem('authCode', code)
    const codeVerifier = await AsyncStorage.getItem('codeVerifier')
    setCodeVerifier(codeVerifier)
  }, [])

  const handleAppStateChange = useCallback((nextAppState: string) => setAppState(nextAppState), [appState])

  useEffect(() => {
    const appStateSubscription = AppState.addEventListener('change', handleAppStateChange)
    const linkingSubscription = Linking.addEventListener('url', handleDeepLink)
    fetchAndStoreToken()

    return () => {
      appStateSubscription.remove()
      linkingSubscription.remove()
    }
  }, [handleAppStateChange, handleDeepLink])

  const handleOAuth = async () => {
    AsyncStorage.multiRemove(['authCode', 'accessToken', 'aadhaarData'])
    try {
      const generatedCodeVerifier = uuidv4()
      setCodeVerifier(generatedCodeVerifier)
      initiateDigiLockerOAuth({
        client_id: DIGI_LOCKER_CLIENT_ID,
        client_secret: DIGI_LOCKER_CLIENT_SECRET,
        codeVerifier: generatedCodeVerifier,
      })
        .then(response => {
          Linking.openURL(response)
        })
        .catch(() => {})
    } catch (error) {
      Alert.alert('Error', `Failed to initiate OAuth${error ? `: ${error}` : ''}`)
    }
  }

  const handleFetchAadhaarData = async () => {
    if (!accessToken) {
      Alert.alert('Error', 'Please re-authenticate with DigiLocker')
      return
    }
    setLoading(true)

    try {
      const aadhaarResponse = await fetchAadhaarData(accessToken)
      const aadhaarDataa = await parseAadhaarData(aadhaarResponse)
      setAadhaarData(aadhaarDataa)
      setIsAadhaarVisible(!isAadhaarVisible)
      await AsyncStorage.setItem('aadhaarData', JSON.stringify(aadhaarDataa))
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch Aadhaar data')
    } finally {
      setLoading(false)
    }
  }

  const handleFetchDocumentData = async (doctype: string) => {
    if (!accessToken) {
      Alert.alert('Error', 'Please Re-authenticate with DigiLocker')
      return
    }

    if (documents.length === 0) {
      Alert.alert('Error', 'Documents have not been loaded')
      return
    }

    const doc = documents.find(doc => doc.doctype === doctype)
    if (!doc) {
      Alert.alert('Document not found', 'Please add this document in you DigiLocker')
      return
    }

    try {
      setLoading(true)
      const data = await fetchDocumentData(doc.uri, accessToken)
      if (doctype === DigiLocker.PAN_CARD) {
        const panData = await parsePANData(data)
        Alert.alert(
          'PAN Details',
          `PAN: ${panData?.panNumber}
           Name: ${panData?.name}
           Date of Birth: ${panData?.dob}
           Gender: ${panData?.gender}`,
        )
      }
      if (doctype === DigiLocker.DRIVING_LICENSE) {
        const drivingLicenseData = await parseDrivingLicenseData(data)
        Alert.alert(
          'Driving License Details',
          `License Number: ${drivingLicenseData?.licenseNumber}
           Name: ${drivingLicenseData?.name}
        `,
        )
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch document data')
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        <TouchableOpacity style={styles.card} onPress={handleOAuth}>
          <View style={{}}>
            <Text style={styles.title}>Authenticate with DigiLocker</Text>
            <Text style={{ color: '#FFFFFF', fontSize: 14, padding: 8 }}>
              Get your Aadhaar, PAN, and Driving License
            </Text>
          </View>
          <Image
            source={{ uri: DigiLocker_Logo }}
            style={{ width: 110, height: 45, alignSelf: 'flex-end', marginRight: 10 }}
            resizeMode="contain"
          />
        </TouchableOpacity>
        {accessToken && (
          <TouchableOpacity
            style={[styles.card, { flexDirection: 'row', justifyContent: 'space-between' }]}
            onPress={handleFetchAadhaarData}>
            <View style={{}}>
              <Text style={[styles.title, { maxWidth: 300 }]}>Fetch Aadhaar Data</Text>
              <Text style={styles.description}>Get your Aadhaar Card Details</Text>
            </View>
            <Image source={{ uri: DigiLocker_Aadhaar_Logo }} style={styles.logo} />
          </TouchableOpacity>
        )}
        {accessToken && (
          <TouchableOpacity
            style={[styles.card, { flexDirection: 'row', justifyContent: 'space-between' }]}
            onPress={() => handleFetchDocumentData('PANCR')}>
            <View style={{}}>
              <Text style={[styles.title, { maxWidth: 300 }]}>Fetch PAN Data</Text>
              <Text style={styles.description}>Get your PAN Card Details</Text>
            </View>
            <Image
              source={{
                uri: DigiLocker_ITD_Logo,
              }}
              style={styles.logo}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
        {accessToken && (
          <TouchableOpacity
            style={[styles.card, { flexDirection: 'row', justifyContent: 'space-between' }]}
            onPress={() => handleFetchDocumentData('DRVLC')}>
            <View style={{}}>
              <Text style={[styles.title, { maxWidth: 300 }]}>Fetch Driving License Data</Text>
              <Text style={styles.description}>Get your Driving License Details</Text>
            </View>
            <Image source={{ uri: DigiLocker_NE_Preview_Logo }} style={styles.logo} />
          </TouchableOpacity>
        )}
        {aadhaarData && isAadhaarVisible && (
          <Modal
            animationType="slide"
            transparent={true}
            visible={isAadhaarVisible}
            onRequestClose={() => {
              setIsAadhaarVisible(!isAadhaarVisible)
            }}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
              }}>
              <View
                style={{
                  backgroundColor: 'white',
                  padding: 20,
                  borderRadius: 10,
                  margin: 10,
                }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    marginBottom: 10,
                  }}>
                  Aadhaar Details
                </Text>
                <Text>UID: {aadhaarData?.uid}</Text>
                <Text>Name: {aadhaarData?.name}</Text>
                <Text>Date of Birth: {aadhaarData?.dob}</Text>
                <Text>Gender: {aadhaarData?.gender}</Text>
                <Text>Care Of: {aadhaarData?.co}</Text>
                <Text>Country: {aadhaarData?.country}</Text>
                <Text>District: {aadhaarData?.district}</Text>
                <Text>Locality: {aadhaarData?.locality}</Text>
                <Text>Pin Code: {aadhaarData?.pincode}</Text>
                <Text>State: {aadhaarData?.state}</Text>
                <Text>Vtc: {aadhaarData?.vtc}</Text>
                <Text>House: {aadhaarData?.house}</Text>
                <Text>Street: {aadhaarData?.street}</Text>
                <Text>Landmark: {aadhaarData?.landmark}</Text>
                <Text>Post Office: {aadhaarData?.postOffice}</Text>
                <Text>
                  Address:{' '}
                  {`${aadhaarData?.house} ${aadhaarData?.street} ${aadhaarData?.landmark} ${aadhaarData?.locality} ${aadhaarData?.postOffice} ${aadhaarData?.vtc} ${aadhaarData?.district} ${aadhaarData?.state} ${aadhaarData?.pincode}`}
                </Text>
                {aadhaarData?.photo && (
                  <Image
                    source={{ uri: `data:image/jpeg;base64,${aadhaarData.photo}` }}
                    style={{ width: 100, height: 100, marginTop: 10 }}
                  />
                )}
                <TouchableOpacity
                  style={{
                    backgroundColor: '#4DC0E2',
                    padding: 10,
                    borderRadius: 5,
                    marginTop: 10,
                    maxWidth: '35%',
                    alignItems: 'center',
                    alignSelf: 'flex-end',
                  }}
                  onPress={() => setIsAadhaarVisible(!isAadhaarVisible)}>
                  <Text style={{ color: 'white' }}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}
      </ScrollView>
      {loading && <ActivityIndicator size="large" color="#000" style={styles.activityIndicator} />}
    </View>
  )
}

export default DigiLockerScreen
