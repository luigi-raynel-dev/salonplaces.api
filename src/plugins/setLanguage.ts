import { FastifyRequest } from 'fastify'

export async function setLanguage(request: FastifyRequest) {
  ;(global as any).languageIsoCode =
    request.headers['content-language'] || process.env.APP_DEFAULT_LANGUAGE
}
