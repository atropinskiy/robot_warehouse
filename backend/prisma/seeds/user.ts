import { prisma } from '../../lib/prisma';
import { hash } from 'bcrypt';

export async function user() {
  await prisma.user.createMany({
    skipDuplicates: true,
    data: [
      {
        name: 'Дарья',
        email: 'darya@ya.ru',
        password: await hash('Qwerty1!', 10),
        role: 'OWNER',
      },
      {
        name: 'Константин',
        email: 'test@ya.ru',
        password: await hash('Qwerty1!', 10),
      },
    ],
  });
  console.log('Users seeds done');
}
