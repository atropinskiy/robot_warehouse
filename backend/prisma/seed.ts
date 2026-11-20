import { prisma } from '../lib/prisma';
import { user } from './seeds/user';
import { map } from './seeds/map';

async function main() {
  console.log('Start seeds');

  // Create a new users
  await user();
  // Create a new map
  await map();

  console.log('Finish seeds');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
