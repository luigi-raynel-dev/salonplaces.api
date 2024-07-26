import { translationKeywords } from '.'

const language: translationKeywords = {
  hello: ({ username }) => (username ? `Hello ${username}` : 'Hello'),
  automaticEmailMessage: "This is an automatic email. Please don't reply it.",
  userAlreadyExists: 'User is already registered.',
  registeredProfessionalSubtitle:
    "We're so excited to have you join our awesome platform of professionals. To help you get started and make sure clients can easily find and book your services, we suggest you complete your profile.",
  professionalCTABtn:
    'Click the button below to complete your profile and start attracting clients:',
  professionalProfileCompleteLabelButton: 'Complete Your Profile',
  professionalWelcome: `Welcome to ${process.env.APP_NAME} - Professionals!`,
  professionalWelcomeAboard: "Welcome aboard, and here's to your success!",
  professionalSuccessfullyRegistered: 'Registration completed successfully!',
  professionalAlreadyExists: 'Professional is already registered.',
  invalidUserOrPassword: 'Invalid username or password.'
}

export default language
