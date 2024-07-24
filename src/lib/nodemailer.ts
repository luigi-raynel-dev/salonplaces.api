import { createTransport } from 'nodemailer'
import { MailOptions } from 'nodemailer/lib/sendmail-transport'
import SMTPTransport from 'nodemailer/lib/smtp-transport'

export type CallbackSendMail = (
  err: Error | null,
  info: SMTPTransport.SentMessageInfo
) => void

export type SendMailProps = {
  status: boolean
  error: Error | null
  info: SMTPTransport.SentMessageInfo
}

export const sendMail = async (
  mailOptions: MailOptions
): Promise<SendMailProps> => {
  return new Promise(resolve => {
    const transporter = createTransport({
      host: process.env.SMTP_HOST || 'localhost',
      port: parseInt(process.env.SMTP_PORT || '1025'),
      ignoreTLS: process.env.SMTP_IGNORE_TLS === 'true',
      auth: {
        user: process.env.SMTP_AUTH_USER,
        pass: process.env.SMTP_AUTH_PASS
      }
    })

    transporter.sendMail(
      {
        ...mailOptions,
        from: process.env.SMTP_AUTH_USER
      },
      (error, info) => {
        resolve({ status: error === null, error, info })
      }
    )
  })
}
