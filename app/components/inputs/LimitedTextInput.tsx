import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View, Text, StyleSheet, TextInput, TextInputProps, TouchableOpacity } from 'react-native'
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen'

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
  const [, dispatch] = useStore()
  const [characterCount, setCharacterCount] = useState(0)
  const [isEdit, setisEdit] = useState(false)
  const [saveText, setsaveText] = useState('')
  const { t } = useTranslation()
  const { Inputs, TextTheme } = useTheme()
  const [errorState, setErrorState] = useState<ErrorState>({
    visible: false,
    title: '',
    description: '',
  })
  const styles = StyleSheet.create({
    container: {
      marginVertical: 10,
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
      width: widthPercentageToDP('80%'),
      marginTop: heightPercentageToDP('2%'),
      fontSize: 21,
    },
    limitCounter: {
      color: TextTheme.normal.color,
      alignSelf: 'flex-end',
    },
    renameView: {
      justifyContent: label === 'Wallet Name' ? 'flex-start' : 'flex-start',
      flexDirection: label === 'Wallet Name' ? 'row' : 'column',
      alignItems: 'center',
      flexGrow: 1,
      paddingHorizontal: 25,
    },
    labelText: {
      alignItems: 'center',
      flexGrow: 1,
      paddingHorizontal: 30,
      fontWeight: 'bold',
      marginRight: 14,
      fontSize: 24,
      color: ColorPallet.brand.primary,
    },
    renameText: {
      marginHorizontal: 5,
      marginBottom: 'auto',
      marginTop: 'auto',
      fontSize: 21,
      flexShrink: 1,
    },
  })

  useEffect(() => {
    if (textInputProps.defaultValue?.length) {
      setCharacterCount(textInputProps.defaultValue.length)
    }
  }, [textInputProps.defaultValue])

  const onChangeText = (text: string) => {
    setCharacterCount(text.length)
    setsaveText(text)
    handleChangeText(text)
  }
  const handleEdit = () => {
    setisEdit(true)
  }

  const handleSave = () => {
    handleChangeText(saveText)
    setisEdit(false)
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
      {label === 'Wallet Name' ? (
        <Text style={[TextTheme.headingFour, styles.labelText]}>{label}</Text>
      ) : (
        <Text style={styles.label}>{label}</Text>
      )}

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
          <Text style={[styles.limitCounter, { marginLeft: widthPercentageToDP('10%') }]}>
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
