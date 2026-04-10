import mysql from 'mysql2/promise';
import { config } from 'dotenv';

config();

let db;

export const connectDB = async () => {
  try {
    db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT
    });

    console.log("MySQL Connected");
  } catch (err) {
    console.error("DB Error:", err);
    process.exit(1);
  }
};

export const getDB = () => {
  if (!db) {
    throw new Error("DB not initialized. Call connectDB first.");
  }
  return db;
};