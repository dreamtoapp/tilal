import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined };

const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: [
      { emit: "event", level: "query" },
      { emit: "stdout", level: "error" },
      { emit: "stdout", level: "info" },
      { emit: "stdout", level: "warn" },
    ],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

export default db;





// import { PrismaClient } from "@prisma/client";

// declare global {
//   var prisma: PrismaClient | undefined;
// }

// const db =
//   global.prisma ||
//   new PrismaClient({
//     log: [
//       {
//         emit: "event",
//         level: "query",
//       },
//       {
//         emit: "stdout",
//         level: "error",
//       },
//       {
//         emit: "stdout",
//         level: "info",
//       },
//       {
//         emit: "stdout",
//         level: "warn",
//       },
//     ],
//   });

// if (process.env.NODE_ENV !== "production") global.prisma = db;

// export default db;




// import { PrismaClient } from '@prisma/client';

// const globalForPrisma = globalThis as unknown as {
//   prisma: PrismaClient | undefined;
// };

// const db =
//   globalForPrisma.prisma ??
//   new PrismaClient({
//     log: ['error', 'warn', 'info'],
//   });

// if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;

// export default db;