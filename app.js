import express from "express";
import { connectDB, getDB } from "./connectDB.js";
import router from "./router.js";

const app = express();
app.use(express.json());
app.use('/',router)
await connectDB(); 

const db = getDB(); 

const createTableQuery = `
CREATE TABLE IF NOT EXISTS schools (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  latitude FLOAT NOT NULL,
  longitude FLOAT NOT NULL
);
`;

try {
  await db.execute(createTableQuery);
  console.log("Schools table ready");
} catch (err) {
  console.error("Table creation failed:", err);
}

app.listen(3000, () => console.log("Server running"));