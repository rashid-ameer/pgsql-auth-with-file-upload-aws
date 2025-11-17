import { ColumnDefinitions, MigrationBuilder } from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(
    "CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, username VARCHAR(200) NOT NULL, email VARCHAR(250) UNIQUE NOT NULL, password TEXT NOT NULL, is_verified BOOLEAN NOT NULL DEFAULT false, profile_image TEXT, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP);"
  );

  pgm.sql(
    "CREATE TABLE IF NOT EXISTS email_verifications (id SERIAL PRIMARY KEY, code TEXT NOT NULL, user_id INT NOT NULL, expires_at TIMESTAMP NOT NULL, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE);"
  );
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.sql("DROP TABLE IF EXISTS email_verifications;")
  pgm.sql("DROP TABLE IF EXISTS users;");
}
