import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2]?.trim();
  const password = process.argv[3]?.trim();

  if (!email || !password) {
    throw new Error('Uso: npm run admin:reset-password -- <email_admin> <nuevo_password>');
  }

  if (password.length < 12) {
    throw new Error('El nuevo password debe tener al menos 12 caracteres.');
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error(`No existe usuario con email ${email}`);
  }

  if (String(user.role).toLowerCase() !== 'admin') {
    throw new Error('El usuario indicado no es admin.');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash }
  });

  console.log(`Password actualizado para admin: ${email}`);
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
