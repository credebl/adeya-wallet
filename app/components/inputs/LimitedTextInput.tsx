import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View, Text, StyleSheet, TextInput, TextInputProps } from 'react-native'
import { widthPercentageToDP } from 'react-native-responsive-screen'

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
  const [characterCount, setCharacterCount] = useState(0)
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
    limitCounter: {
      color: TextTheme.normal.color,
      alignSelf: 'flex-end',
    },
    renameView: {
      justifyContent: 'flex-start',
      flexDirection: 'column',
      alignItems: 'center',
      paddingHorizontal: 0,
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
    handleChangeText(text)
    setCharacterCount(text.length)
  }

  const handleDismissError = () => {
    setErrorState(prev => ({ ...prev, visible: false }))
  }
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.renameView}>
        <TextInput
          style={[styles.textInput, { borderWidth: 2 }, focused && { ...Inputs.inputSelected }]}
          selectionColor={Inputs.inputSelected.borderColor}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChangeText={onChangeText}
          {...textInputProps}
        />
        <Text style={[styles.limitCounter, { marginLeft: widthPercentageToDP('30%') }]}>
          {characterCount}/{limit}
        </Text>
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
