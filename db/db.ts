import { PrismaClient } from "@prisma/client/edge";

const db = new PrismaClient();

(async () => {
  try {
    console.log(await db.widget.create({ data: {} }));
  } catch (err) {
    console.error("error executing query:", err);
  } finally {
    db.$disconnect();
  }
})();

export default db;
