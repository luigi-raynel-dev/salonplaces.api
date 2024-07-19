import { PrismaClient } from '@prisma/client'
import { createInitialFrequencies } from './seed/frequency'
import { createInitialStaffs } from './seed/staff'
import { createInitialLanguages } from './seed/language'
import { createInitialCurrencies } from './seed/currency'
import { createInitialCountries } from './seed/country'
import { createInitialPlans } from './seed/plan'
import { createInitialGateways } from './seed/gateway'
import { createInitialPaymentStatus } from './seed/paymentStatus'
import { createInitialPaymentTypes } from './seed/paymentType'
import { createInitialGenders } from './seed/gender'

const prisma = new PrismaClient()

async function run() {
  try {
    await createInitialFrequencies(prisma)
    await createInitialGenders(prisma)
    await createInitialStaffs(prisma)
    await createInitialLanguages(prisma)
    await createInitialCurrencies(prisma)
    await createInitialCountries(prisma)
    await createInitialPlans(prisma)
    await createInitialPaymentStatus(prisma)
    await createInitialPaymentTypes(prisma)
    await createInitialGateways(prisma)
  } catch (error) {
    console.error('Error during seeding:', error)
  } finally {
    await prisma.$disconnect()
  }
}

run()
