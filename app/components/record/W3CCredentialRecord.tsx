import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/Feather'

import { useTheme } from '../../contexts/theme'
import { Field, W3CCredentialAttributeField } from '../../types/record'
import { testIdWithKey } from '../../utils/testable'

import RecordFooter from './RecordFooter'
import RecordHeader from './RecordHeader'
import W3CCredentialRecordField from './W3CCredentialRecordField'

export interface RecordProps {
  header?: () => React.ReactElement | null
  footer?: () => React.ReactElement | null
  fields: Field[]
  hideFieldValues?: boolean
  tables: W3CCredentialAttributeField[]
}

const W3CCredentialRecord: React.FC<RecordProps> = ({ header, footer, fields, hideFieldValues = false, tables }) => {
  const { t } = useTranslation()
  const [shown, setShown] = useState<boolean[]>([])
  const [showAll, setShowAll] = useState<boolean>(false)
  const { ListItems, TextTheme } = useTheme()

  const styles = StyleSheet.create({
    linkContainer: {
      ...ListItems.recordContainer,
      flexDirection: 'row',
      justifyContent: 'flex-end',
      paddingHorizontal: 25,
      paddingVertical: 16,
    },
    link: {
      minHeight: TextTheme.normal.fontSize,
      paddingVertical: 2,
    },
  })

  const resetShown = (): void => {
    setShown(fields.map(() => showAll))
    setShowAll(!showAll)
  }

  const toggleShownState = (newShowStates: boolean[]): void => {
    if (newShowStates.filter(shownState => shownState === showAll).length > Math.floor(fields.length / 2)) {
      setShowAll(!showAll)
    }
  }

  useEffect(() => {
    resetShown()
  }, [])

  return (
    <FlatList
      data={tables}
      keyExtractor={({ title }, index) => title || index.toString()}
      renderItem={({ item: table, index }) => (
        <View style={{}}>
          <View style={{ paddingVertical: 10, flexDirection: 'row' }}>
            {table.depth > 1 && <Icon style={{ color: 'red' }} name="corner-down-right" size={30} />}
            {table.title && (
              <Text
                style={[ListItems.recordAttributeLabel, { fontWeight: 'bold', paddingLeft: 10 }]}
                testID={testIdWithKey('AttributeName')}>
                {table.title ?? 'Credential information'}
              </Text>
            )}
            {table.parent && (
              <Text
                style={[ListItems.recordAttributeLabel, { fontWeight: 'bold', paddingLeft: 10 }]}
                testID={testIdWithKey('AttributeName')}>
                part of {table.parent}
              </Text>
            )}
          </View>
          <View>
            {table.rows.map((row, idx) => (
              <W3CCredentialRecordField
                key={row.key}
                field={row}
                hideFieldValue={hideFieldValues}
                onToggleViewPressed={() => {
                  const newShowState = [...shown]
                  newShowState[index] = !shown[index]
                  setShown(newShowState)
                  toggleShownState(newShowState)
                }}
                shown={hideFieldValues ? !!shown[index] : true}
                hideBottomBorder={idx === table.rows.length - 1}
              />
            ))}
          </View>
        </View>
      )}
      ListHeaderComponent={
        header ? (
          <RecordHeader>
            {header()}
            {hideFieldValues ? (
              <View style={styles.linkContainer}>
                <TouchableOpacity
                  style={styles.link}
                  activeOpacity={1}
                  onPress={() => resetShown()}
                  testID={testIdWithKey('HideAll')}
                  accessible={true}
                  accessibilityLabel={showAll ? t('Record.ShowAll') : t('Record.HideAll')}>
                  <Text style={ListItems.recordLink}>{showAll ? t('Record.ShowAll') : t('Record.HideAll')}</Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </RecordHeader>
        ) : null
      }
      ListFooterComponent={footer ? <RecordFooter>{footer()}</RecordFooter> : null}
    />
  )
}

export default W3CCredentialRecord
