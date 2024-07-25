import { languageIsonCodeType, translate } from './translate'

export function emailTemplate(
  title: string,
  body: string,
  username?: string,
  introduction?: string
) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${process.env.APP_NAME} - ${title}</title>
    </head>
    <body style="font-family: Verdana">
    <div style="margin: 0 auto; width: 100%; max-width: 800px; border: 1px solid #ddd">
      <div style="background: #A34FD8; width: 100%; max-width: 800px; text-align: center; margin: 0 auto; padding: 8px; color: white">
        <h2>${process.env.APP_NAME} - ${title}</h2>
      </div>
      <div style="padding: 8px">
        <h3>${introduction || `${translate('hello', { username })},`}</h3>
        ${body}
      </div>
      </div>
      <p style="color: #071673; text-align: center">${translate(
        'automaticEmailMessage'
      )}</p>
    </body>
    </html>
  `
}
