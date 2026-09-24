import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pool } from "./pool.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const schema = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8");

try {
  await pool.query(schema);
  console.log("Database schema initialized.");
} catch (error) {
  console.error("Database initialization failed.");
  console.error(error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
