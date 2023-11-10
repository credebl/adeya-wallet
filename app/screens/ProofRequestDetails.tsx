import { MetaOverlay, OverlayType } from '@hyperledger/aries-oca'
import { StackScreenProps } from '@react-navigation/stack'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, StyleProp, StyleSheet, Text, TextInput, TextStyle, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import {
  AnonCredsProofRequestTemplatePayloadData,
  ProofRequestType,
  linkProofWithTemplate,
  sendProofRequest,
} from '../../verifier'
import Button, { ButtonType } from '../components/buttons/Button'
import AlertModal from '../components/modals/AlertModal'
import { useConfiguration } from '../contexts/configuration'
import { useStore } from '../contexts/store'
import { useTheme } from '../contexts/theme'
import { useTemplate } from '../hooks/proof-request-templates'
import { Screens, ProofRequestsStackParams } from '../types/navigators'
import { Attribute, Field, Predicate } from '../types/record'
import { useAppAgent } from '../utils/agent'
import { formatIfDate } from '../utils/helpers'
import { buildFieldsFromAnonCredsProofRequestTemplate } from '../utils/oca'
import { parseSchemaFromId } from '../utils/schema'
import { testIdWithKey } from '../utils/testable'

type ProofRequestDetailsProps = StackScreenProps<ProofRequestsStackParams, Screens.ProofRequestDetails>

interface ProofRequestAttributesCardParams {
  data: AnonCredsProofRequestTemplatePayloadData
  onChangeValue: (schema: string, label: string, name: string, value: string) => void
}

const AttributeItem: React.FC<{ item: Attribute; style?: StyleProp<TextStyle> }> = ({ item, style }) => {
  const [value, setValue] = useState(item.value)

  useEffect(() => {
    setValue(formatIfDate(item.format, value))
  }, [])

  return (
    <View style={{ flexDirection: 'row' }}>
      <Text style={style}>{item.label || item.name}</Text>
      <Text style={style}>{value}</Text>
    </View>
  )
}

const PredicateItem: React.FC<{
  item: Predicate
  style?: StyleProp<TextStyle>
  onChangeValue: (name: string, value: string) => void
}> = ({ item, style, onChangeValue }) => {
  const { ColorPallet } = useTheme()
  const [pValue, setPValue] = useState(item.pValue)

  useEffect(() => {
    // can't format the date if parameterizable, must remain a number
    if (!item.parameterizable) {
      setPValue(formatIfDate(item.format, pValue))
    }
  }, [])

  const defaultStyle = StyleSheet.create({
    input: {
      textAlign: 'center',
      borderBottomColor: ColorPallet.grayscale.black,
      borderBottomWidth: 1,
    },
  })

  return (
    <View style={{ flexDirection: 'row' }}>
      <Text style={style}>{item.label || item.name}</Text>
      <Text style={style}>{item.pType}</Text>
      {item.parameterizable && (
        <TextInput
          keyboardType="numeric"
          style={[style, defaultStyle.input]}
          onChangeText={value => onChangeValue(item.name || '', value)}>
          {pValue}
        </TextInput>
      )}
      {!item.parameterizable && <Text style={style}>{pValue}</Text>}
    </View>
  )
}

const ProofRequestAttributesCard: React.FC<ProofRequestAttributesCardParams> = ({ data, onChangeValue }) => {
  const { ListItems, ColorPallet } = useTheme()
  const { i18n } = useTranslation()
  const { OCABundleResolver } = useConfiguration()

  const style = StyleSheet.create({
    credentialCard: {
      ...ListItems.requestTemplateBackground,
      padding: 16,
      borderRadius: 8,
      borderLeftWidth: 8,
      borderLeftColor: ColorPallet.brand.primary,
      marginBottom: 16,
    },
    schemaTitle: {
      ...ListItems.requestTemplateTitle,
      fontWeight: 'bold',
      fontSize: 20,
      paddingVertical: 8,
    },
    attributeTitle: {
      ...ListItems.requestTemplateTitle,
      fontWeight: 'bold',
      fontSize: 18,
      paddingVertical: 8,
      marginRight: 8,
    },
    attributesList: {
      paddingLeft: 14,
    },
  })

  const [meta, setMeta] = useState<MetaOverlay | undefined>(undefined)
  const [attributes, setAttributes] = useState<Field[] | undefined>(undefined)

  useEffect(() => {
    OCABundleResolver.resolve({ identifiers: { schemaId: data.schema }, language: i18n.language }).then(bundle => {
      const metaOverlay =
        bundle?.metaOverlay ||
        new MetaOverlay({
          capture_base: '',
          type: OverlayType.Meta10,
          name: parseSchemaFromId(data.schema).name,
          description: '',
          language: i18n.language,
          credential_help_text: '',
          credential_support_url: '',
          issuer: '',
          issuer_description: '',
          issuer_url: '',
        })
      setMeta(metaOverlay)
    })
  }, [data.schema])

  useEffect(() => {
    const attributes = buildFieldsFromAnonCredsProofRequestTemplate(data)
    OCABundleResolver.presentationFields({
      identifiers: { schemaId: data.schema },
      attributes,
      language: i18n.language,
    }).then(fields => {
      setAttributes(fields)
    })
  }, [data.schema])

  return (
    <View style={[style.credentialCard]}>
      <Text style={style.schemaTitle}>{meta?.name}</Text>
      <FlatList
        style={style.attributesList}
        data={attributes}
        keyExtractor={(record, index) => record.name || index.toString()}
        renderItem={({ item }) => {
          return (
            <View style={{ flexDirection: 'row' }}>
              <Text style={style.attributeTitle}>{`\u2022`}</Text>
              {item instanceof Attribute && <AttributeItem style={style.attributeTitle} item={item as Attribute} />}
              {item instanceof Predicate && (
                <PredicateItem
                  item={item as Predicate}
                  style={style.attributeTitle}
                  onChangeValue={(name, value) => {
                    onChangeValue(data.schema, item.label || name, name, value)
                  }}
                />
              )}
            </View>
          )
        }}
      />
    </View>
  )
}

const ProofRequestDetails: React.FC<ProofRequestDetailsProps> = ({ route, navigation }) => {
  const { ColorPallet, TextTheme } = useTheme()
  const [store] = useStore()
  const { t } = useTranslation()
  const { i18n } = useTranslation()
  const { OCABundleResolver } = useConfiguration()

  const { agent } = useAppAgent()
  if (!agent) {
    throw new Error('Unable to fetch agent from AFJ')
  }

  const style = StyleSheet.create({
    container: {
      flexGrow: 1,
      backgroundColor: ColorPallet.brand.primaryBackground,
      padding: 16,
    },
    header: {
      marginTop: 12,
      marginBottom: 36,
    },
    title: {
      color: TextTheme.title.color,
      fontSize: 28,
      fontWeight: 'bold',
    },
    description: {
      marginTop: 10,
      color: TextTheme.title.color,
      fontSize: 20,
    },
    footerButton: {
      marginTop: 'auto',
      marginBottom: 10,
    },
  })

  const { templateId, connectionId } = route?.params

  const [meta, setMeta] = useState<MetaOverlay | undefined>(undefined)
  const [attributes, setAttributes] = useState<Array<AnonCredsProofRequestTemplatePayloadData> | undefined>(undefined)
  const [customPredicateValues, setCustomPredicateValues] = useState<Record<string, Record<string, number>>>({})
  const [invalidPredicate, setInvalidPredicate] = useState<
    { visible: boolean; predicate: string | undefined } | undefined
  >(undefined)

  const template = useTemplate(templateId)
  if (!template) {
    throw new Error('Unable to find proof request template')
  }

  useEffect(() => {
    const attributes = template.payload.type === ProofRequestType.AnonCreds ? template.payload.data : []

    OCABundleResolver.resolve({ identifiers: { templateId }, language: i18n.language }).then(bundle => {
      const metaOverlay =
        bundle?.metaOverlay ||
        new MetaOverlay({
          capture_base: '',
          type: OverlayType.Meta10,
          name: template.name,
          description: template.description,
          language: i18n.language,
          credential_help_text: '',
          credential_support_url: '',
          issuer: '',
          issuer_description: '',
          issuer_url: '',
        })
      setMeta(metaOverlay)
      setAttributes(attributes)
    })
  }, [templateId])

  const onlyNumberRegex = /^\d+$/

  const onChangeValue = useCallback(
    (schema: string, label: string, name: string, value: string) => {
      if (!onlyNumberRegex.test(value)) {
        setInvalidPredicate({ visible: true, predicate: label })
        return
      }
      setInvalidPredicate(undefined)
      setCustomPredicateValues(prev => ({
        ...prev,
        [schema]: {
          ...(prev[schema] || {}),
          [name]: parseInt(value),
        },
      }))
    },
    [setCustomPredicateValues, setInvalidPredicate],
  )

  const useProofRequest = useCallback(async () => {
    if (invalidPredicate) {
      setInvalidPredicate({ visible: true, predicate: invalidPredicate.predicate })
      return
    }

    if (connectionId) {
      // Send to specific contact and redirect to the chat with him
      sendProofRequest(agent, template, connectionId, customPredicateValues).then(result => {
        if (result?.proofRecord) {
          linkProofWithTemplate(agent, result.proofRecord, templateId)
        }
      })

      navigation.getParent()?.navigate(Screens.Chat, { connectionId })
    } else {
      // Else redirect to the screen with connectionless request
      navigation.navigate(Screens.ProofRequesting, { templateId, predicateValues: customPredicateValues })
    }
  }, [templateId, connectionId, customPredicateValues, invalidPredicate])

  const showTemplateUsageHistory = useCallback(async () => {
    navigation.navigate(Screens.ProofRequestUsageHistory, { templateId })
  }, [navigation, templateId])

  const Header: React.FC = () => {
    return (
      <View style={style.header}>
        <Text style={style.title}>{meta?.name}</Text>
        <Text style={style.description}>{meta?.description}</Text>
      </View>
    )
  }

  const Footer: React.FC = () => {
    return (
      <View>
        <View style={style.footerButton}>
          <Button
            title={connectionId ? t('Verifier.SendThisProofRequest') : t('Verifier.UseProofRequest')}
            accessibilityLabel={connectionId ? t('Verifier.SendThisProofRequest') : t('Verifier.UseProofRequest')}
            testID={connectionId ? testIdWithKey('SendThisProofRequest') : testIdWithKey('UseProofRequest')}
            buttonType={ButtonType.Primary}
            onPress={() => useProofRequest()}
          />
        </View>
        {store.preferences.useDataRetention && (
          <View style={style.footerButton}>
            <Button
              title={t('Verifier.ShowTemplateUsageHistory')}
              accessibilityLabel={t('Verifier.ShowTemplateUsageHistory')}
              testID={testIdWithKey('ShowTemplateUsageHistory')}
              buttonType={ButtonType.Secondary}
              onPress={() => showTemplateUsageHistory()}
            />
          </View>
        )}
      </View>
    )
  }

  return (
    <SafeAreaView style={style.container} edges={['left', 'right']}>
      {invalidPredicate?.visible && (
        <AlertModal
          title={t('Verifier.InvalidPredicateValueTitle', { predicate: invalidPredicate.predicate })}
          message={t('Verifier.InvalidPredicateValueDetails')}
          submit={() => setInvalidPredicate({ visible: false, predicate: invalidPredicate.predicate })}
        />
      )}
      <FlatList
        ListHeaderComponent={Header}
        ListFooterComponent={Footer}
        style={{ backgroundColor: ColorPallet.brand.primaryBackground }}
        data={attributes}
        keyExtractor={records => records.schema}
        renderItem={({ item }) => <ProofRequestAttributesCard data={item} onChangeValue={onChangeValue} />}
        ListFooterComponentStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}
        contentContainerStyle={{ flexGrow: 1 }}
      />
    </SafeAreaView>
  )
}

export default ProofRequestDetails
