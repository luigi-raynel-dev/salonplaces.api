import { translationKeywords } from '.'

const language: translationKeywords = {
  DAY: 'dia',
  DAYS: 'dias',
  HOUR: 'hora',
  HOURS: 'horas',
  MINUTE: 'minuto',
  MINUTES: 'minutos',
  SECOND: 'segundo',
  SECONDS: 'segundos',
  HELLO: ({ username }) => (username ? `Olá ${username}` : 'Olá'),
  USER_ALREADY_EXISTS: 'Usuário já está cadastrado.',
  USER_NOT_FOUND: 'Usuário não encontrado.',
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
  INVALID_USER_OR_PASSWORD: 'Usuário ou senha inválida.',
  CODE_EXPIRATION: ({ expiration }) =>
    `Este código expira em ${expiration}, caso expirado será necessário solicitar um novo.`,
  RECEIVED_REQUEST: ({ action }) => `Recebemos uma solicitação para ${action}.`,
  IGNORE_EMAIL: ({ action }) =>
    `Se você não solicitou a ${action}, ignore este e-mail.`,
  USE_THIS_CODE: ({ action }) =>
    `Por favor, utilize este código acima para confirmar a ${action} no nossa plataforma.`,
  CODE_REQUEST: ({ action }) => `Código para ${action}`,
  PASSWORD_RECOVERY: 'redefinição da senha'
}

export default language
