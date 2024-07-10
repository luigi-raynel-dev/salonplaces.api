import { PrismaClient } from '@prisma/client'
import { run as runFrequencySeed} from './seed/frequencies'

const prisma = new PrismaClient()

async function run() {
  await runFrequencySeed(prisma)
}

run()