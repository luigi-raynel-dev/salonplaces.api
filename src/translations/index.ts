import en from './en'
import ptBr from './pt-br'

export type translationKeywords = {
  HELLO: (props: { username: string }) => string
  AUTOMATIC_EMAIL_MESSAGE: string
  INVALID_USER_OR_PASSWORD: string
  USER_ALREADY_EXISTS: string
  REGISTERED_PROFESSIONAL_SUBTITLE: string
  PROFESSIONAL_CTA_BUTTON: string
  PROFESSIONAL_PROFILE_COMPLETE_LABEL_BUTTON: string
  PROFESSIONAL_WELCOME: string
  PROFESSIONAL_WELCOME_ABOARD: string
  PROFESSIONAL_SUCCESSFULY_REGISTERED: string
  PROFESSIONAL_ALREADY_EXISTS: string
}

export default {
  en,
  'pt-BR': ptBr
}
