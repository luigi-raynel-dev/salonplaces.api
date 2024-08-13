import en from './en'
import ptBr from './pt-br'

export type translationKeywords = {
  DAY: string
  DAYS: string
  HOUR: string
  HOURS: string
  MINUTE: string
  MINUTES: string
  SECOND: string
  SECONDS: string
  HELLO: (props: { username: string }) => string
  AUTOMATIC_EMAIL_MESSAGE: string
  INVALID_USER_OR_PASSWORD: string
  USER_ALREADY_EXISTS: string
  USER_NOT_FOUND: string
  REGISTERED_PROFESSIONAL_SUBTITLE: string
  PROFESSIONAL_CTA_BUTTON: string
  PROFILE_COMPLETE_LABEL_BUTTON: string
  PROFESSIONAL_WELCOME: string
  PROFESSIONAL_WELCOME_ABOARD: string
  PROFESSIONAL_SUCCESSFULY_REGISTERED: string
  PROFESSIONAL_ALREADY_EXISTS: string
  CODE_EXPIRATION: (props: { expiration: string }) => string
  RECEIVED_REQUEST: (props: { action: string }) => string
  IGNORE_EMAIL: (props: { action: string }) => string
  USE_THIS_CODE: (props: { action: string }) => string
  CODE_REQUEST: (props: { action: string }) => string
  PASSWORD_RECOVERY: string
  CUSTOMER_WELCOME: string
  CUSTOMER_SUCCESSFULY_REGISTERED: string
  REGISTERED_CUSTOMER_SUBTITLE: string
  CUSTOMER_CTA_BUTTON: string
  CUSTOMER_WELCOME_ABOARD: string
}

export default {
  en,
  'pt-BR': ptBr
}
