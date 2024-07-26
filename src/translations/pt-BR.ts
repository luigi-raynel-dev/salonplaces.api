import { translationKeywords } from '.'

const language: translationKeywords = {
  hello: userName => (userName ? `Olá ${userName}` : 'Olá'),
  userAlreadyExists: 'Usuário já está cadastrado.',
  automaticEmailMessage:
    'Este é um e-mail automático. Por favor não responda-o.',
  registeredProfessionalSubtitle:
    'Estamos muito felizes em ter você em nossa plataforma de profissionais de estética. Para ajudar você a começar e garantir que os clientes possam encontrar e agendar seus serviços facilmente, sugerimos que complete seu perfil com todos os detalhes importantes.',
  professionalCTABtn:
    'Clique no botão abaixo para completar seu perfil e começar a atrair e gerenciar clientes:',
  professionalProfileCompleteLabelButton: 'Completar seu perfil',
  professionalWelcome: `Boas-vindas ao ${process.env.APP_NAME} para profissionais!`,
  professionalWelcomeAboard: 'Estamos aqui pelo seu sucesso!',
  professionalSuccessfullyRegistered: 'Cadastro realizado com sucesso!',
  professionalAlreadyExists: 'Profissional já está cadastrado.',
  invalidUserOrPassword: 'Usuário ou senha inválida.'
}

export default language
