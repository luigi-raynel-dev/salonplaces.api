import randomatic from 'randomatic'
import { prisma } from '../lib/prisma'
import { User } from '@prisma/client'
import dayjs, { ManipulateType } from 'dayjs'
import { sendMail } from '../lib/nodemailer'
import { emailTemplate } from './emailTemplate'
import { translate, translationKeywordType } from './translate'

export type BodyType = {
  html?: string
  start?: string
  helloLabel?: string
  title?: string | null
  helper?: string | null
  ignoreEmailText?: string | null
  expirationText?: string | null
  end?: string
}

export const sendCode = async (
  user: User,
  title: string,
  action: string,
  slug: string,
  body?: BodyType,
  digits: number = 5,
  timeToExpire = 30,
  timeUnit: ManipulateType = 'minutes'
) => {
  const code = randomatic('0', digits)

  const keyTimeUnit = timeUnit
    .toUpperCase()
    .toUpperCase() as translationKeywordType
  const expirationInfo = `${timeToExpire} ${translate(keyTimeUnit)}`

  const html =
    body?.html ||
    `
    ${body?.start || ''}
    ${
      body?.title !== null
        ? `<p>${body?.title || translate('RECEIVED_REQUEST', { action })}</p>`
        : ''
    }
    <div style="background: #ddd;padding: 10px; text-align: center;">
      <h2>${code}</h2>
    </div>
    ${
      body?.helper !== null
        ? `<p>${body?.helper || translate('USE_THIS_CODE', { action })}</p>`
        : ''
    }
    ${
      body?.ignoreEmailText !== null
        ? `<p>${
            body?.ignoreEmailText || translate('IGNORE_EMAIL', { action })
          }</p>`
        : ''
    }
    ${
      body?.expirationText !== null
        ? `<p>${
            body?.expirationText ||
            translate('CODE_EXPIRATION', { expiration: `${expirationInfo} ` })
          }</p>`
        : ''
    }
    ${body?.end || ''}
    `

  const sendedMail = await sendMail({
    to: user.email || '',
    subject: `${process.env.APP_NAME} - ${title}`,
    html: emailTemplate(title, html, user.firstName || '', body?.helloLabel)
  })

  if (!sendedMail?.status) return sendedMail

  const codeRequestType = await prisma.codeRequestType.findUniqueOrThrow({
    where: { slug }
  })
  await prisma.userCode.create({
    data: {
      code,
      codeRequestTypeId: codeRequestType.id,
      userId: user.id,
      expiresIn: dayjs().add(timeToExpire, timeUnit).toISOString()
    }
  })

  return sendedMail
}

export const validateCode = async (userId: number, code: string) => {
  const userCode = await prisma.userCode.findFirst({
    where: {
      userId,
      code,
      validatedIn: null,
      expiresIn: {
        gte: new Date()
      }
    }
  })

  if (userCode) {
    await prisma.userCode.update({
      data: {
        validatedIn: new Date()
      },
      where: {
        id: userCode.id
      }
    })
  }

  return userCode
}
