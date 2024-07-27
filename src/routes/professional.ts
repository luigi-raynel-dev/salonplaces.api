import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { JWTPayload } from '../modules/auth'
import { authenticate } from '../plugins/authenticate'
import { sendMail } from '../lib/nodemailer'
import { emailTemplate } from '../modules/emailTemplate'
import { translate } from '../modules/translate'

export async function professionalRoutes(fastify: FastifyInstance) {
  fastify.post(
    '/register',
    {
      onRequest: [authenticate]
    },
    async (request, reply) => {
      const { email } = request.user as JWTPayload

      const user = await prisma.user.findUniqueOrThrow({
        where: { email }
      })

      let professional = await prisma.professional.findUnique({
        where: {
          userId: user.id
        }
      })

      if (professional)
        return reply.status(400).send({
          status: false,
          message: translate('PROFESSIONAL_ALREADY_EXISTS'),
          error: 'PROFESSIONAL_ALREADY_EXISTS'
        })

      professional = await prisma.professional.create({
        data: {
          userId: user.id,
          online: false
        }
      })

      const emailInfo = await sendMail({
        to: email,
        subject: translate('PROFESSIONAL_WELCOME'),
        html: emailTemplate(
          translate('PROFESSIONAL_SUCCESSFULY_REGISTERED'),
          `
          <p>${translate('REGISTERED_PROFESSIONAL_SUBTITLE')}</p>
          <p>${translate('PROFESSIONAL_CTA_BUTTON')}</p>
          <a href="${
            process.env.APP_PROFILE_URL
          }" style="display: inline-block; padding: 10px 20px; color: white; background-color: #007BFF; text-decoration: none; border-radius: 5px;">
          ${translate('PROFESSIONAL_PROFILE_COMPLETE_LABEL_BUTTON')}</a>
          <p>${translate('PROFESSIONAL_WELCOME_ABOARD')}</p>
        `,
          user.firstName
        )
      })

      return reply.status(201).send({
        status: true,
        message: translate('PROFESSIONAL_SUCCESSFULY_REGISTERED'),
        professional: {
          ...professional,
          password: undefined
        },
        emailInfo
      })
    }
  )

  fastify.get(
    '/profile',
    {
      onRequest: [authenticate]
    },
    async (request, reply) => {
      const { email } = request.user as JWTPayload

      const user = await prisma.user.findUniqueOrThrow({
        where: { email }
      })

      const professional = await prisma.professional.findUnique({
        where: {
          userId: user.id
        }
      })

      return reply.status(professional ? 200 : 404).send({ professional })
    }
  )

  fastify.patch(
    '/profile',
    {
      onRequest: [authenticate]
    },
    async request => {
      const { email } = request.user as JWTPayload

      const user = await prisma.user.findUniqueOrThrow({
        where: { email }
      })

      let professional = await prisma.professional.findUniqueOrThrow({
        where: {
          userId: user.id
        }
      })

      const bodyScheme = z.object({
        bio: z.string().nullable().optional(),
        online: z.boolean()
      })
      const data = bodyScheme.parse(request.body)

      professional = await prisma.professional.update({
        data,
        where: { id: professional.id }
      })

      return {
        status: true,
        professional: {
          ...professional,
          password: undefined
        }
      }
    }
  )
}
