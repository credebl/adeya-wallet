import { W3cCredentialRecord } from '@adeya/ssi'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

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
  w3cCredential?: Pick<W3cCredentialRecord, 'credential'> & {
    credential: Pick<Pick<W3cCredentialRecord, 'credential'>, 'credential'> & {
      prettyVc?: string
    }
  }
  renderCertificate?: () => void
  isCertificateLoading?: boolean
}

const W3CCredentialRecord: React.FC<RecordProps> = ({
  header,
  footer,
  hideFieldValues = false,
  tables,
  w3cCredential,
  renderCertificate,
  isCertificateLoading,
}) => {
  const { t } = useTranslation()
  const [shown, setShown] = useState<boolean[][]>([])
  const [showAll, setShowAll] = useState<boolean>(true)
  const { ListItems, TextTheme, ColorPallet } = useTheme()

  const isPrettyVcAvailable =
    w3cCredential?.credential?.prettyVc && Object.keys(w3cCredential?.credential?.prettyVc).length > 0

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
    container: {
      padding: 16,
      flexDirection: 'row',
    },
    rowContainer: {
      flexDirection: 'row',
      justifyContent: isPrettyVcAvailable ? 'space-between' : 'flex-end',
      backgroundColor: ColorPallet.grayscale.white,
    },
    linkText: {
      fontWeight: 'bold',
    },
  })

  const resetShown = (): void => {
    setShown(tables.map(table => table.rows.map(() => showAll)))
    setShowAll(!showAll)
  }

  useEffect(() => {
    resetShown()
  }, [tables])

  return (
    <FlatList
      data={tables}
      keyExtractor={({ title }, index) => title || index.toString()}
      renderItem={({ item: table, index }) => (
        <View style={{}}>
          <View style={styles.container}>
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
                  newShowState[index][idx] = !shown[index][idx]
                  setShown(newShowState)
                }}
                shown={hideFieldValues ? !!(shown?.[index]?.[idx] ?? false) : true}
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
            <View style={styles.rowContainer}>
              {isPrettyVcAvailable && (
                <View style={styles.linkContainer}>
                  {isCertificateLoading ? (
                    <ActivityIndicator size={'small'} />
                  ) : (
                    <TouchableOpacity
                      style={styles.link}
                      activeOpacity={1}
                      onPress={renderCertificate}
                      testID={testIdWithKey('ViewCertificate')}
                      accessible={true}
                      accessibilityLabel={t('Record.ViewCertificate')}>
                      <Text style={[ListItems.recordLink, styles.linkText]}>{t('Record.ViewCertificate')}</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}

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
            </View>
          </RecordHeader>
        ) : null
      }
      ListFooterComponent={footer ? <RecordFooter>{footer()}</RecordFooter> : null}
    />
  )
}

export default W3CCredentialRecord
