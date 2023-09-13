/* eslint-disable import/no-named-as-default-member */
import AsyncStorage from '@react-native-async-storage/async-storage'
// eslint-disable-next-line import/no-named-as-default
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import * as RNLocalize from 'react-native-localize'

import { defaultLanguage } from '../constants'

import en from './en'

export type Translation = typeof en

type TranslationResources = {
  [key: string]: any
}

export const translationResources: TranslationResources = {
  en: {
    translation: en,
  },
}

export enum Locales {
  en = 'en',
}

const currentLanguage = i18n.language

//** Store language into the AsyncStorage  */
const storeLanguage = async (id: string) => {
  await AsyncStorage.setItem('language', id)
}

const initLanguages = (resources: TranslationResources) => {
  const availableLanguages = Object.keys(resources)
  const bestLanguageMatch = RNLocalize.findBestLanguageTag(availableLanguages)
  let translationToUse = defaultLanguage

  if (bestLanguageMatch && availableLanguages.includes(bestLanguageMatch.languageTag)) {
    translationToUse = bestLanguageMatch.languageTag
  }

  i18n.use(initReactI18next).init({
    debug: true,
    lng: translationToUse,
    fallbackLng: defaultLanguage,
    resources,
  })
}

//** Fetch user preference language from the AsyncStorage and set if require  */
const initStoredLanguage = async () => {
  const langId = await AsyncStorage.getItem('language')
  if (langId && langId !== currentLanguage) {
    await i18n.changeLanguage(langId)
  }
}

export { i18n, initStoredLanguage, initLanguages, storeLanguage, currentLanguage }
