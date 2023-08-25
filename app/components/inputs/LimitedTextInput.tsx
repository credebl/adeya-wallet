import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View, Text, StyleSheet, TextInput, TextInputProps, TouchableOpacity, Keyboard } from 'react-native'
import { widthPercentageToDP } from 'react-native-responsive-screen'

import { DispatchAction } from '../../contexts/reducers/store'
import { useStore } from '../../contexts/store'
import { useTheme } from '../../contexts/theme'
import { ColorPallet } from '../../theme'
import { InfoBoxType } from '../misc/InfoBox'
import PopupModal from '../modals/PopupModal'

interface Props extends TextInputProps {
  label: string
  limit: number
  handleChangeText: (text: string) => void
}
type ErrorState = {
  visible: boolean
  title: string
  description: string
}
const LimitedTextInput: React.FC<Props> = ({ label, limit, handleChangeText, ...textInputProps }) => {
  const [focused, setFocused] = useState(false)
  const [store, dispatch] = useStore()
  const [characterCount, setCharacterCount] = useState(0)
  const [isEdit, setisEdit] = useState(false)
  const [saveText, setsaveText] = useState(store?.preferences?.walletName)
  const { t } = useTranslation()
  const { Inputs, TextTheme } = useTheme()
  const [errorState, setErrorState] = useState<ErrorState>({
    visible: false,
    title: '',
    description: '',
  })
  const styles = StyleSheet.create({
    container: {
      marginVertical: 5,
    },
    label: {
      ...TextTheme.normal,
      marginBottom: 5,
      fontWeight: '700',
    },
    textInput: {
      ...Inputs.textInput,
      color: ColorPallet.brand.primary,
      width: widthPercentageToDP('90%'),
    },
    textInputRename: {
      width: isEdit ? widthPercentageToDP('78%') : widthPercentageToDP('80%'),
      fontSize: 21,
      color: ColorPallet.grayscale.darkGrey,
    },
    limitCounter: {
      color: TextTheme.normal.color,
      alignSelf: 'flex-end',
    },
    renameView: {
      justifyContent: label === 'Wallet Name' ? 'flex-start' : 'flex-start',
      flexDirection: label === 'Wallet Name' ? 'row' : 'column',
      alignItems: 'center',
      paddingHorizontal: label === 'Wallet Name' ? 0 : 0,
    },
    labelText: {
      alignItems: 'center',
      flexGrow: 1,
      paddingHorizontal: 40,
      fontWeight: 'bold',
      marginRight: 14,
      fontSize: 24,
      color: ColorPallet.brand.primary,
    },
    renameText: {
      fontSize: 21,
      flexShrink: 1,
      marginRight: 100,
    },
  })

  useEffect(() => {
    if (textInputProps.defaultValue?.length) {
      setCharacterCount(textInputProps.defaultValue.length)
    }
  }, [textInputProps.defaultValue])

  const onChangeText = (text: string) => {
    if (label !== 'Wallet Name') {
      handleChangeText(text)
    }
    setsaveText(text)
    setCharacterCount(text.length)
  }
  const handleEdit = () => {
    setisEdit(true)
  }

  const handleSave = () => {
    Keyboard.dismiss()
    // handleChangeText(saveText)
    if (saveText.length < 1) {
      setErrorState({
        title: t('NameWallet.EmptyNameTitle'),
        description: t('NameWallet.EmptyNameDescription'),
        visible: true,
      })
    } else if (saveText.length > 50) {
      setErrorState({
        title: t('NameWallet.CharCountTitle'),
        description: t('NameWallet.CharCountDescription'),
        visible: true,
      })
    } else {
      handleChangeText(saveText)
      dispatch({
        type: DispatchAction.UPDATE_WALLET_NAME,
        payload: [saveText],
      })
      dispatch({ type: DispatchAction.DID_NAME_WALLET })
    }
  }
  const handleDismissError = () => {
    setErrorState(prev => ({ ...prev, visible: false }))
  }
  return (
    <View style={styles.container}>
      {label === 'Wallet Name' ? null : <Text style={styles.label}>{label}</Text>}
      <View style={styles.renameView}>
        <TextInput
          style={[
            label === 'Wallet Name' ? styles.textInputRename : styles.textInput,
            { borderWidth: label === 'Wallet Name' ? 0 : 2 },
            focused && label === 'Wallet Name' ? styles.textInputRename : { ...Inputs.inputSelected },
          ]}
          selectionColor={Inputs.inputSelected.borderColor}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChangeText={onChangeText}
          editable={label === 'Wallet Name' && isEdit === false ? false : true}
          {...textInputProps}
        />
        {label === 'Wallet Name' ? (
          isEdit ? (
            <TouchableOpacity onPress={handleSave}>
              <Text style={[styles.limitCounter, styles.renameText]}>Save</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={handleEdit}>
              <Text style={[styles.limitCounter, styles.renameText]}>Edit</Text>
            </TouchableOpacity>
          )
        ) : (
          <Text style={[styles.limitCounter, { marginLeft: widthPercentageToDP('30%') }]}>
            {characterCount}/{limit}
          </Text>
        )}
      </View>
      {errorState.visible && (
        <PopupModal
          notificationType={InfoBoxType.Info}
          onCallToActionLabel={t('Global.Okay')}
          onCallToActionPressed={handleDismissError}
          title={errorState.title}
          description={errorState.description}
        />
      )}
    </View>
  )
}

export default LimitedTextInput
