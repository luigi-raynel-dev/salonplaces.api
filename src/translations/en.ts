import { translationKeywords } from '.'

const language: translationKeywords = {
  DAY: 'day',
  DAYS: 'days',
  HOUR: 'hour',
  HOURS: 'hours',
  MINUTE: 'minute',
  MINUTES: 'minutes',
  SECOND: 'second',
  SECONDS: 'seconds',
  HELLO: ({ username }) => (username ? `Hello ${username}` : 'Hello'),
  AUTOMATIC_EMAIL_MESSAGE: "This is an automatic email. Please don't reply it.",
  USER_ALREADY_EXISTS: 'User is already registered.',
  USER_NOT_FOUND: 'User not found',
  REGISTERED_PROFESSIONAL_SUBTITLE:
    "We're so excited to have you join our awesome platform of professionals. To help you get started and make sure clients can easily find and book your services, we suggest you complete your profile.",
  PROFESSIONAL_CTA_BUTTON:
    'Click the button below to complete your profile and start attracting clients:',
  PROFILE_COMPLETE_LABEL_BUTTON: 'Complete Your Profile',
  PROFESSIONAL_WELCOME: `Welcome to ${process.env.APP_NAME} - Professionals!`,
  PROFESSIONAL_WELCOME_ABOARD: "Welcome aboard, and here's to your success!",
  PROFESSIONAL_SUCCESSFULY_REGISTERED: 'Registration completed successfully!',
  PROFESSIONAL_ALREADY_EXISTS: 'Professional is already registered.',
  INVALID_USER_OR_PASSWORD: 'Invalid username or password.',
  CODE_EXPIRATION: ({ expiration }) =>
    `This code expires in ${expiration}, if expired you will need to request a new code.`,
  RECEIVED_REQUEST: ({ action }) => `We received a request for ${action}.`,
  IGNORE_EMAIL: ({ action }) =>
    `If you did not request the ${action}, please ignore this email.`,
  USE_THIS_CODE: ({ action }) =>
    `Please use this code above to confirm the ${action}.`,
  CODE_REQUEST: ({ action }) => `Code to ${action}`,
  PASSWORD_RECOVERY: 'password recovery',
  CUSTOMER_WELCOME: `Welcome to ${process.env.APP_NAME}!`,
  CUSTOMER_SUCCESSFULY_REGISTERED: 'Registration completed successfully!',
  REGISTERED_CUSTOMER_SUBTITLE:
    'We are so excited to have you on our platform. We want to make it easier for you to find the best and most highly rated salons in your region. We suggest you complete your profile with all the important details.',
  CUSTOMER_CTA_BUTTON: 'Click the button below to complete your profile:',
  CUSTOMER_WELCOME_ABOARD: 'We are here for you!'
}

export default language
