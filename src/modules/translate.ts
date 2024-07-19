import translations, { translationKeywords } from '../translations'

export const getLanguage = (language: keyof typeof translations) => {
  return translations[language]
}

export const translate = (
  language: keyof typeof translations,
  keyword: keyof translationKeywords
) => {
  return translations[language][keyword] || ''
}
