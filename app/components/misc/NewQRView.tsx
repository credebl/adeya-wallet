import { DidExchangeState } from '@adeya/ssi'
import { useNavigation } from '@react-navigation/core'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Vibration, View, StyleSheet, Text, ScrollView, Dimensions } from 'react-native'
import { BarCodeReadEvent, RNCamera } from 'react-native-camera'
import { SafeAreaView } from 'react-native-safe-area-context'
import Icon from 'react-native-vector-icons/MaterialIcons'

import { useStore } from '../../contexts/store'
import { useTheme } from '../../contexts/theme'
import { useConnectionByOutOfBandId } from '../../hooks/connections'
import { QrCodeScanError } from '../../types/error'
import { Screens, Stacks } from '../../types/navigators'
import { useAppAgent } from '../../utils/agent'
import { createConnectionInvitation } from '../../utils/helpers'
import LoadingIndicator from '../animated/LoadingIndicator'

import QRRenderer from './QRRenderer'
import QRScannerTorch from './QRScannerTorch'
import ScanTab from './ScanTab'

const windowDimensions = Dimensions.get('window')
const qrSize = windowDimensions.width - 40

interface Props {
  defaultToConnect: boolean
  handleCodeScan: (event: BarCodeReadEvent) => Promise<void>
  error?: QrCodeScanError | null
  enableCameraOnError?: boolean
}

const NewQRView: React.FC<Props> = ({ defaultToConnect, handleCodeScan, error, enableCameraOnError }) => {
  const navigation = useNavigation()
  const [store] = useStore()
  const [cameraActive, setCameraActive] = useState(true)
  const [torchActive, setTorchActive] = useState(false)
  const [firstTabActive, setFirstTabActive] = useState(!defaultToConnect)
  const [invitation, setInvitation] = useState<string | undefined>(undefined)
  const [recordId, setRecordId] = useState<string | undefined>(undefined)
  const { t } = useTranslation()
  const invalidQrCodes = new Set<string>()
  const { ColorPallet, TextTheme } = useTheme()
  const { agent } = useAppAgent()
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: ColorPallet.brand.secondaryBackground,
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    camera: {
      flex: 1,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    cameraViewContainer: {
      alignItems: 'center',
      flex: 1,
      width: '100%',
    },
    viewFinder: {
      width: 250,
      height: 250,
      borderRadius: 24,
      borderWidth: 2,
      borderColor: ColorPallet.grayscale.white,
    },
    viewFinderContainer: {
      flex: 1,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    errorContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 20,
      paddingHorizontal: 20,
    },
    icon: {
      color: ColorPallet.grayscale.white,
      padding: 4,
    },
    tabContainer: {
      flexDirection: 'row',
      flexShrink: 1,
      width: '100%',
      borderTopWidth: 4,
      borderTopColor: ColorPallet.brand.primaryBackground,
    },
    qrContainer: {
      marginTop: 10,
      flex: 1,
    },
    walletName: {
      ...TextTheme.headingTwo,
      textAlign: 'center',
      marginBottom: 20,
    },
    secondaryText: {
      ...TextTheme.normal,
      textAlign: 'center',
    },
  })

  const createInvitation = useCallback(async () => {
    setInvitation(undefined)
    const result = await createConnectionInvitation(agent)
    if (result) {
      setRecordId(result.record.id)
      setInvitation(result.invitationUrl)
    }
  }, [])

  useEffect(() => {
    navigation.setOptions({ title: firstTabActive ? 'Scan QR code' : 'My QR code' })
    if (!firstTabActive) {
      createInvitation()
    }
  }, [firstTabActive])

  const record = useConnectionByOutOfBandId(recordId || '')

  useEffect(() => {
    if (record?.state === DidExchangeState.Completed) {
      navigation.getParent()?.navigate(Stacks.ConnectionStack, {
        screen: Screens.Connection,
        params: { connectionId: record.id },
      })
    }
  }, [record])

  return (
    <SafeAreaView edges={['bottom', 'left', 'right']} style={styles.container}>
      {firstTabActive ? (
        <RNCamera
          style={styles.camera}
          type={RNCamera.Constants.Type.back}
          flashMode={torchActive ? RNCamera.Constants.FlashMode.torch : RNCamera.Constants.FlashMode.off}
          captureAudio={false}
          androidCameraPermissionOptions={{
            title: t('QRScanner.PermissionToUseCamera'),
            message: t('QRScanner.WeNeedYourPermissionToUseYourCamera'),
            buttonPositive: t('QRScanner.Ok'),
            buttonNegative: t('Global.Cancel'),
          }}
          barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
          onBarCodeRead={(event: BarCodeReadEvent) => {
            if (invalidQrCodes.has(event.data)) {
              return
            }
            if (error?.data === event?.data) {
              invalidQrCodes.add(error.data)
              if (enableCameraOnError) {
                return setCameraActive(true)
              }
            }
            if (cameraActive) {
              Vibration.vibrate()
              handleCodeScan(event)
              return setCameraActive(false)
            }
          }}>
          <View style={styles.cameraViewContainer}>
            <View style={styles.errorContainer}>
              {error ? (
                <>
                  <Icon style={styles.icon} name="cancel" size={30}></Icon>
                  <Text style={[TextTheme.normal, { color: ColorPallet.grayscale.white }]}>{error.message}</Text>
                </>
              ) : (
                <Text style={[TextTheme.normal, { color: ColorPallet.grayscale.white }]}>
                  {t('Scan.WillScanAutomatically')}
                </Text>
              )}
            </View>
            <View style={styles.viewFinderContainer}>
              <View style={styles.viewFinder} />
            </View>
            <QRScannerTorch active={torchActive} onPress={() => setTorchActive(!torchActive)} />
          </View>
        </RNCamera>
      ) : (
        <ScrollView>
          <View style={{ alignItems: 'center' }}>
            <View style={styles.qrContainer}>
              {!invitation && <LoadingIndicator />}
              {invitation && <QRRenderer value={invitation} size={qrSize} />}
            </View>
            <View style={{ paddingHorizontal: 20, flex: 1 }}>
              <Text style={styles.walletName}>{store.preferences.walletName}</Text>
              <Text style={styles.secondaryText}>{t('Connection.ShareQR')}</Text>
            </View>
          </View>
        </ScrollView>
      )}

      <View style={styles.tabContainer}>
        <ScanTab
          title={t('Scan.ScanQRCode')}
          iconName={'crop-free'}
          onPress={() => setFirstTabActive(true)}
          active={firstTabActive}
        />
        <ScanTab
          title={t('Scan.MyQRCode')}
          iconName={'qr-code'}
          onPress={() => setFirstTabActive(false)}
          active={!firstTabActive}
        />
      </View>
    </SafeAreaView>
  )
}

export default NewQRView
