import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

async function globalTeardown() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    const deleted = await prisma.user.deleteMany({
      where: {
        email: {
          startsWith: 'test-',
        },
      },
    });

    if (deleted.count > 0) {
      console.log(`[teardown] テストユーザーを ${deleted.count} 件削除しました`);
    }
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

export default globalTeardown;
