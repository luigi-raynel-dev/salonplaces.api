import translations, { translationKeywords } from '../translations'

export type languageIsonCodeType = keyof typeof translations

export const getLanguage = (language: languageIsonCodeType) => {
  return translations[language]
}

export const translate = (
  language: languageIsonCodeType,
  keyword: keyof translationKeywords
) => {
  return translations[language][keyword] || ''
}
