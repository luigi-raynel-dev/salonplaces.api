import en from './en'
import ptBr from './pt-br'

export type translationKeywords = {
  hello: (props: { username: string }) => string
  automaticEmailMessage: string
  registeredProfessionalSubtitle: string
  professionalCTABtn: string
  professionalProfileCompleteLabelButton: string
  professionalWelcome: string
  professionalWelcomeAboard: string
  professionalSuccessfullyRegistered: string
  professionalAlreadyExists: string
  invalidUserOrPassword: string
}

export default {
  en,
  'pt-BR': ptBr
}
