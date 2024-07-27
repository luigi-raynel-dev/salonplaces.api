import { translationKeywords } from '.'

const language: translationKeywords = {
  HELLO: ({ username }) => (username ? `Hello ${username}` : 'Hello'),
  AUTOMATIC_EMAIL_MESSAGE: "This is an automatic email. Please don't reply it.",
  USER_ALREADY_EXISTS: 'User is already registered.',
  REGISTERED_PROFESSIONAL_SUBTITLE:
    "We're so excited to have you join our awesome platform of professionals. To help you get started and make sure clients can easily find and book your services, we suggest you complete your profile.",
  PROFESSIONAL_CTA_BUTTON:
    'Click the button below to complete your profile and start attracting clients:',
  PROFESSIONAL_PROFILE_COMPLETE_LABEL_BUTTON: 'Complete Your Profile',
  PROFESSIONAL_WELCOME: `Welcome to ${process.env.APP_NAME} - Professionals!`,
  PROFESSIONAL_WELCOME_ABOARD: "Welcome aboard, and here's to your success!",
  PROFESSIONAL_SUCCESSFULY_REGISTERED: 'Registration completed successfully!',
  PROFESSIONAL_ALREADY_EXISTS: 'Professional is already registered.',
  INVALID_USER_OR_PASSWORD: 'Invalid username or password.'
}

export default language
