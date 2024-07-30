import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'

export async function genderRoutes(fastify: FastifyInstance) {
  fastify.get('/', async () => {
    const genders = await prisma.gender.findMany({ orderBy: { id: 'asc' } })

    return { genders }
  })
}
