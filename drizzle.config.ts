import { defineConfig }from "drizzle-kit"
import * as dotenv from "dotenv"

dotenv.config({
    path :".env"
})

export default defineConfig({
    dialect: "postgresql",  //driver
    schema: "./src/lib/db/schema.ts",  //schema file location
    dbCredentials: {
        url : process.env.DATABASE_URL!,
    }
});