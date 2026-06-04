import prisma from "../prisma/client";

export const connectDB = async () => {
  try {
    await prisma.$connect();

    console.log("Supabase PostgreSQL Connected");
  } catch (error) {
    console.error(error);

    process.exit(1);
  }
};