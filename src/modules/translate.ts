import translations, { translationKeywords } from '../translations'

export type languageIsonCodeType = keyof typeof translations

export type translationKeywordType = keyof translationKeywords

export const getLanguageIsoCode = (): languageIsonCodeType => {
  const globalConfig = global as any
  return globalConfig.languageIsoCode || process.env.APP_DEFAULT_LANGUAGE
}

export const getLanguage = () => {
  return translations[getLanguageIsoCode()]
}

export const translate = (keyword: translationKeywordType, props?: any) => {
  const key = translations[getLanguageIsoCode()][keyword]
  if (typeof key === 'function') return key(props)
  else return key
}
