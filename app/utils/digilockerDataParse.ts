import { parseStringPromise } from 'xml2js'

interface AadhaarData {
  uid: string
  dob: string
  gender: string
  name: string
  co: string
  country: string
  district: string
  locality: string
  pincode: string
  state: string
  vtc: string
  house: string
  street: string
  landmark: string
  postOffice: string
  photo: string
}

interface PANData {
  panNumber: string
  name: string
  dob: string
  gender: string
}

interface DrivingLicenseData {
  licenseNumber: string
  issuedAt: string
  issueDate: string
  expiryDate: string
  dob: string
  swd: string
  swdIndicator: string
  gender: string
  presentAddressLine1: string
  presentAddressLine2: string
  presentAddressHouse: string
  presentAddressLandmark: string
  presentAddressLocality: string
  presentAddressVtc: string
  presentAddressDistrict: string
  presentAddressPin: string
  presentAddressState: string
  presentAddressCountry: string
  permanentAddressLine1: string
  permanentAddressLine2: string
  permanentAddressHouse: string
  permanentAddressLandmark: string
  permanentAddressLocality: string
  permanentAddressVtc: string
  permanentAddressDistrict: string
  permanentAddressPin: string
  permanentAddressState: string
  permanentAddressCountry: string
  licenseTypes: string
  name: string
  photo: string
}

const getOrDefault = (obj: any, path: string[], defaultValue: string = ''): string => {
  return path.reduce((acc, key) => (acc && acc[key] ? acc[key] : defaultValue), obj)
}

export const parseAadhaarData = async (xmlString: string): Promise<AadhaarData | { error: string }> => {
  try {
    const result = await parseStringPromise(xmlString)
    const uidData = result.Certificate.CertificateData[0].KycRes[0].UidData[0]
    const poi = uidData.Poi[0]
    const poa = uidData.Poa[0]
    const photo = uidData.Pht[0] || ''

    const aadhaarData: AadhaarData = {
      uid: getOrDefault(uidData, ['$', 'uid']),
      dob: getOrDefault(poi, ['$', 'dob']),
      gender: getOrDefault(poi, ['$', 'gender']),
      name: getOrDefault(poi, ['$', 'name']),
      co: getOrDefault(poa, ['$', 'co']),
      country: getOrDefault(poa, ['$', 'country']),
      district: getOrDefault(poa, ['$', 'dist']),
      locality: getOrDefault(poa, ['$', 'loc']),
      pincode: getOrDefault(poa, ['$', 'pc']),
      state: getOrDefault(poa, ['$', 'state']),
      vtc: getOrDefault(poa, ['$', 'vtc']),
      house: getOrDefault(poa, ['$', 'house']),
      street: getOrDefault(poa, ['$', 'street']),
      landmark: getOrDefault(poa, ['$', 'lm']),
      postOffice: getOrDefault(poa, ['$', 'po']),
      photo,
    }
    return aadhaarData
  } catch (error) {
    return { error: 'Error parsing Aadhaar XML. Please check the input data.' }
  }
}

export const parsePANData = async (xmlString: string): Promise<PANData | { error: string }> => {
  try {
    const result = await parseStringPromise(xmlString)

    const certificate = result?.Certificate
    const issuedTo = certificate?.IssuedTo?.[0]?.Person?.[0]

    const panData: PANData = {
      panNumber: certificate?.$?.number || '',
      name: issuedTo?.$?.name || '',
      dob: issuedTo?.$?.dob || '',
      gender: issuedTo?.$?.gender || '',
    }

    return panData
  } catch (error) {
    return { error: 'Error parsing PAN XML. Please check the input data.' }
  }
}

export const parseDrivingLicenseData = async (xmlString: string): Promise<DrivingLicenseData | { error: string }> => {
  try {
    const result = await parseStringPromise(xmlString)

    const certificate = result?.Certificate
    const issuedTo = certificate?.IssuedTo?.[0]?.Person?.[0]
    const presentAddress = issuedTo?.Address?.[0]?.$ || {}
    const permanentAddress = issuedTo?.Address2?.[0]?.$ || {}
    const licenseTypes = certificate?.CertificateData[0]?.DrivingLicense[0]?.Categories[0]?.Category

    const drivingLicenseData: DrivingLicenseData = {
      licenseNumber: certificate?.$?.number || '',
      issuedAt: certificate?.$?.issuedAt || '',
      issueDate: certificate?.$?.issueDate || '',
      expiryDate: certificate?.$?.expiryDate || '',
      dob: issuedTo?.$?.dob || '',
      swd: issuedTo?.$?.swd || '',
      swdIndicator: issuedTo?.$?.swdIndicator || '',
      name: issuedTo?.$?.name || '',
      presentAddressLine1: presentAddress.line1 || '',
      presentAddressLine2: presentAddress.line2 || '',
      presentAddressHouse: presentAddress.house || '',
      presentAddressLandmark: presentAddress.landmark || '',
      presentAddressLocality: presentAddress.locality || '',
      presentAddressVtc: presentAddress.vtc || '',
      presentAddressDistrict: presentAddress.district || '',
      presentAddressPin: presentAddress.pin || '',
      presentAddressState: presentAddress.state || '',
      presentAddressCountry: presentAddress.country || '',
      permanentAddressLine1: permanentAddress.line1 || '',
      permanentAddressLine2: permanentAddress.line2 || '',
      permanentAddressHouse: permanentAddress.house || '',
      permanentAddressLandmark: permanentAddress.landmark || '',
      permanentAddressLocality: permanentAddress.locality || '',
      permanentAddressVtc: permanentAddress.vtc || '',
      permanentAddressDistrict: permanentAddress.district || '',
      permanentAddressPin: permanentAddress.pin || '',
      permanentAddressState: permanentAddress.state || '',
      permanentAddressCountry: permanentAddress.country || '',
      licenseTypes: licenseTypes.map((item: { $: { abbreviation: string } }) => item.$.abbreviation).join(', '),
      gender: issuedTo?.$?.gender || '',
      photo: issuedTo?.Photo?.[0]._ || '',
    }
    return drivingLicenseData
  } catch (error) {
    return { error: 'Error parsing Driving License XML. Please check the input data.' }
  }
}
