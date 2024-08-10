import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { authenticate } from '../plugins/authenticate'
import { JWTPayload } from '../modules/auth'
import { salonAdmin } from '../plugins/salonAdmin'
import fs from 'fs'
import path from 'path'

const salonMediaPath = path.join(__dirname, '..', 'public', 'uploads', 'salon')

export async function salonRoutes(fastify: FastifyInstance) {
  fastify.get('/:slug', async (request, reply) => {
    const queryParams = z.object({
      slug: z.string()
    })
    const { slug } = queryParams.parse(request.params)

    const salon = await prisma.salon.findUnique({
      include: {
        Location: {
          take: 1,
          include: {
            LocationHasProfessional: {
              include: {
                professional: {
                  include: {
                    user: {
                      include: {
                        gender: true
                      }
                    }
                  }
                }
              }
            }
          },
          orderBy: {
            createdAt: 'asc'
          }
        },
        SalonHasProfessional: {
          include: {
            professional: {
              include: {
                user: {
                  include: {
                    gender: true
                  }
                }
              }
            }
          }
        },
        SalonMedia: true
      },
      where: {
        slug,
        active: true,
        block: false
      }
    })

    if (!salon)
      return reply.status(404).send({
        status: false,
        error: 'SALON_NOT_FOUND'
      })

    return reply.send({
      salon
    })
  })

  fastify.post(
    '/join',
    {
      onRequest: [authenticate]
    },
    async (request, reply) => {
      const { email } = request.user as JWTPayload

      const user = await prisma.user.findUniqueOrThrow({
        where: { email }
      })

      const professional = await prisma.professional.findUniqueOrThrow({
        where: {
          userId: user.id
        }
      })

      const bodyScheme = z.object({
        name: z.string(),
        slug: z.string(),
        countryPlanId: z.number().nullable().optional(),
        location: z.object({
          address: z.string(),
          latitude: z.string(),
          longitude: z.string(),
          number: z.string(),
          zipCode: z.string(),
          complement: z.string().nullable().optional(),
          referencePoint: z.string().nullable().optional()
        })
      })
      const { name, slug, countryPlanId, location } = bodyScheme.parse(
        request.body
      )

      let salon = await prisma.salon.findUnique({ where: { slug } })

      if (salon)
        return reply.status(422).send({
          status: false,
          error: 'SLUG_IN_USE'
        })

      salon = await prisma.salon.create({
        data: {
          name,
          slug,
          countryPlanId,
          Location: {
            create: {
              active: true,
              ...location
            }
          }
        }
      })

      await prisma.salonHasProfessional.create({
        data: {
          active: true,
          isAdmin: true,
          professionalId: professional.id,
          salonId: salon.id
        }
      })

      return reply.status(201).send({
        status: true,
        salon
      })
    }
  )

  fastify.patch(
    '/:slug',
    {
      onRequest: [authenticate, salonAdmin]
    },
    async (request, reply) => {
      const queryParams = z.object({
        slug: z.string()
      })
      const { slug } = queryParams.parse(request.params)

      let salon = await prisma.salon.findUniqueOrThrow({ where: { slug } })

      const bodyScheme = z.object({
        name: z.string(),
        slug: z.string(),
        active: z.boolean().default(true),
        companyIdentifier: z.string().optional().nullable(),
        holderIdentifier: z.string().optional().nullable(),
        holder: z.string().optional().nullable(),
        cancellationPolicy: z.string().optional().nullable(),
        description: z.string().optional().nullable(),
        phone: z.string().optional().nullable(),
        facebook: z.string().optional().nullable(),
        instagram: z.string().optional().nullable(),
        tiktok: z.string().optional().nullable()
      })
      const data = bodyScheme.parse(request.body)

      if (slug !== data.slug) {
        const findedSalon = await prisma.salon.findUnique({
          where: { slug: data.slug }
        })
        if (findedSalon)
          return reply.status(422).send({
            status: false,
            error: 'SLUG_IN_USE'
          })
      }

      salon = await prisma.salon.update({
        data,
        where: { slug }
      })

      return reply.send({
        status: true,
        salon
      })
    }
  )

  fastify.patch(
    '/:slug/media',
    {
      onRequest: [authenticate, salonAdmin]
    },
    async (request, reply) => {
      const queryParams = z.object({
        slug: z.string()
      })
      const { slug } = queryParams.parse(request.params)

      let salon = await prisma.salon.findUniqueOrThrow({ where: { slug } })

      const bodyScheme = z.object({
        logo: z.string().base64().nullable().optional(),
        media: z
          .array(
            z.object({
              filename: z.string(),
              base64: z.string().nullable().optional(),
              id: z.number().nullable().optional()
            })
          )
          .nullable()
          .optional()
      })
      const { logo, media } = bodyScheme.parse(request.body)

      if (logo !== undefined) {
        if (salon.logoUrl) {
          fs.unlink(path.join(salonMediaPath, salon.logoUrl), error => {
            if (error) console.error(error)
          })
        }

        let logoUrl = null

        if (logo) {
          const buffer = Buffer.from(logo, 'base64')

          const timestamp = Date.now()
          logoUrl = `${timestamp}_${salon.id}.jpg`

          const logoPath = path.join(salonMediaPath, logoUrl)

          fs.writeFile(logoPath, buffer, error => {
            if (error)
              return reply
                .status(500)
                .send({ status: false, errorDetails: error.message })
          })
        }

        salon = await prisma.salon.update({
          data: { logoUrl },
          where: { slug }
        })
      }

      if (media) {
        const salonMedia = await prisma.salonMedia.findMany({
          where: {
            salonId: salon.id
          }
        })

        for (const item of salonMedia) {
          const mediaItem = media.find(({ id }) => id === item.id)

          if (!mediaItem) {
            await prisma.salonMedia.delete({
              where: {
                id: item.id
              }
            })

            fs.unlink(path.join(salonMediaPath, item.url), error => {
              if (error) console.error(error)
            })
          }
        }

        for (const [index, item] of media.entries()) {
          const order = index + 1
          if (item.base64) {
            const buffer = Buffer.from(item.base64, 'base64')

            const timestamp = Date.now()
            const url = `${timestamp}_${index}_${salon.id}.jpg`

            const mediaPath = path.join(salonMediaPath, url)

            fs.writeFile(mediaPath, buffer, error => {
              if (error)
                return reply
                  .status(500)
                  .send({ status: false, errorDetails: error.message })
            })

            await prisma.salonMedia.create({
              data: {
                url,
                order,
                filename: item.filename,
                salonId: salon.id
              }
            })
          } else if (item.id) {
            await prisma.salonMedia.update({
              data: {
                order,
                filename: item.filename
              },
              where: { id: item.id }
            })
          }
        }
      }

      return reply.send({
        status: true,
        salon
      })
    }
  )

  fastify.get('/media/:filename', async (request, reply) => {
    const queryParams = z.object({
      filename: z.string()
    })
    const { filename } = queryParams.parse(request.params)

    const filePath = path.join(salonMediaPath, filename)
    try {
      const buffer = fs.readFileSync(filePath)
      reply.type('image/jpeg').send(buffer)
    } catch {
      return reply.status(404).send()
    }
  })

  fastify.patch(
    '/:slug/professionals/:professionalId',
    {
      onRequest: [authenticate, salonAdmin]
    },
    async (request, reply) => {
      const queryParams = z.object({
        slug: z.string(),
        professionalId: z.string()
      })
      const { slug, professionalId } = queryParams.parse(request.params)

      const salon = await prisma.salon.findUniqueOrThrow({ where: { slug } })

      const bodyScheme = z.object({
        active: z.boolean().default(true),
        isAdmin: z.boolean().default(false),
        locations: z.array(
          z.object({
            locationId: z.number(),
            commissionPercentage: z.number().nullable().optional()
          })
        )
      })
      const { locations, ...professional } = bodyScheme.parse(request.body)

      await prisma.salonHasProfessional.upsert({
        create: {
          ...professional,
          professionalId,
          salonId: salon.id
        },
        update: professional,
        where: {
          salonId_professionalId: {
            salonId: salon.id,
            professionalId
          }
        }
      })

      for (const location of locations) {
        const salonLocation = await prisma.location.findUnique({
          where: {
            id: location.locationId,
            salonId: salon.id
          }
        })

        if (!salonLocation)
          return reply.status(404).send({
            status: false,
            error: 'LOCATION_NOT_FOUND'
          })

        await prisma.locationHasProfessional.upsert({
          create: {
            ...location,
            professionalId
          },
          update: location,
          where: {
            locationId_professionalId: {
              professionalId,
              locationId: location.locationId
            }
          }
        })
      }

      return reply.send({ status: true })
    }
  )

  fastify.delete(
    '/:slug/professionals/:professionalId',
    {
      onRequest: [authenticate, salonAdmin]
    },
    async (request, reply) => {
      const queryParams = z.object({
        slug: z.string(),
        professionalId: z.string()
      })
      const { slug, professionalId } = queryParams.parse(request.params)

      const salon = await prisma.salon.findUniqueOrThrow({ where: { slug } })

      await prisma.salonHasProfessional.delete({
        where: {
          salonId_professionalId: {
            salonId: salon.id,
            professionalId
          }
        }
      })

      await prisma.locationHasProfessional.deleteMany({
        where: {
          location: {
            salonId: salon.id
          },
          professionalId
        }
      })

      return reply.send({ status: true })
    }
  )
}
