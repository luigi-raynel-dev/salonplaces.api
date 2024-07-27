import { translationKeywords } from '.'

const language: translationKeywords = {
  HELLO: ({ username }) => (username ? `Olá ${username}` : 'Olá'),
  USER_ALREADY_EXISTS: 'Usuário já está cadastrado.',
  AUTOMATIC_EMAIL_MESSAGE:
    'Este é um e-mail automático. Por favor não responda-o.',
  REGISTERED_PROFESSIONAL_SUBTITLE:
    'Estamos muito felizes em ter você em nossa plataforma de profissionais de estética. Para ajudar você a começar e garantir que os clientes possam encontrar e agendar seus serviços facilmente, sugerimos que complete seu perfil com todos os detalhes importantes.',
  PROFESSIONAL_CTA_BUTTON:
    'Clique no botão abaixo para completar seu perfil e começar a atrair e gerenciar clientes:',
  PROFESSIONAL_PROFILE_COMPLETE_LABEL_BUTTON: 'Completar seu perfil',
  PROFESSIONAL_WELCOME: `Boas-vindas ao ${process.env.APP_NAME} para profissionais!`,
  PROFESSIONAL_WELCOME_ABOARD: 'Estamos aqui pelo seu sucesso!',
  PROFESSIONAL_SUCCESSFULY_REGISTERED: 'Cadastro realizado com sucesso!',
  PROFESSIONAL_ALREADY_EXISTS: 'Profissional já está cadastrado.',
  INVALID_USER_OR_PASSWORD: 'Usuário ou senha inválida.'
}

export default language
