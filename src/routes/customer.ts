import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { JWTPayload } from '../modules/auth'
import { authenticate } from '../plugins/authenticate'
import { sendMail } from '../lib/nodemailer'
import { emailTemplate } from '../modules/emailTemplate'
import { translate } from '../modules/translate'

export async function customerRoutes(fastify: FastifyInstance) {
  fastify.post(
    '/register',
    {
      onRequest: [authenticate]
    },
    async (request, reply) => {
      const bodyScheme = z.object({
        profileUrl: z.string()
      })
      const { profileUrl } = bodyScheme.parse(request.body)

      const { email } = request.user as JWTPayload

      const user = await prisma.user.findUniqueOrThrow({
        where: { email }
      })

      let customer = await prisma.customer.findUnique({
        where: {
          userId: user.id
        }
      })

      if (customer)
        return reply.status(400).send({
          status: false,
          error: 'CUSTOMER_ALREADY_EXISTS'
        })

      customer = await prisma.customer.create({
        data: { userId: user.id }
      })

      const emailInfo = await sendMail({
        to: email,
        subject: translate('CUSTOMER_WELCOME'),
        html: emailTemplate(
          translate('CUSTOMER_SUCCESSFULY_REGISTERED'),
          `
          <p>${translate('REGISTERED_CUSTOMER_SUBTITLE')}</p>
          <p>${translate('CUSTOMER_CTA_BUTTON')}</p>
          <a href="${profileUrl}" style="display: inline-block; padding: 10px 20px; color: white; background-color: ${
            process.env.APP_BG
          }; text-decoration: none; border-radius: 5px;">
          ${translate('PROFILE_COMPLETE_LABEL_BUTTON')}</a>
          <p>${translate('CUSTOMER_WELCOME_ABOARD')}</p>
        `,
          user.firstName
        )
      })

      return reply.status(201).send({
        status: true,
        message: translate('PROFESSIONAL_SUCCESSFULY_REGISTERED'),
        customer,
        emailInfo
      })
    }
  )
}
