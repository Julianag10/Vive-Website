import dotenv from "dotenv";
dotenv.config();

import pkg from 'pg';

const { Pool } = pkg;

// THIS FILE is the database connection manager
// db.js creates 1 db connection → every file reuses it

// this pool is the source of DB access
// allows every route to write SQL like pool.any();
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function ensureBaseTables() {
  await pool.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS donations (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      stripe_session_id TEXT UNIQUE NOT NULL,
      stripe_payment_intent_id TEXT,
      amount_cents INTEGER NOT NULL CHECK (amount_cents > 0),
      currency TEXT NOT NULL DEFAULT 'usd',
      status TEXT NOT NULL CHECK (
        status IN ('pending', 'succeeded', 'failed', 'refunded', 'abandond')
      ),
      donor_email TEXT,
      donation_email_sent_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS programs (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title TEXT NOT NULL,
      description TEXT,
      location TEXT,
      start_date TIMESTAMP NOT NULL,
      end_date TIMESTAMP NOT NULL,
      capacity INTEGER CHECK (capacity >= 0),
      is_active BOOLEAN NOT NULL DEFAULT true,
      is_featured BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMP NOT NULL DEFAULT now(),
      updated_at TIMESTAMP DEFAULT now(),
      image_url TEXT,
      gallery_images TEXT[] NOT NULL DEFAULT '{}',
      activities TEXT[]
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS program_schedules (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
      day_of_week TEXT NOT NULL,
      start_time TIME NOT NULL,
      end_time TIME NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS events (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title TEXT NOT NULL,
      description TEXT,
      location TEXT,
      color TEXT NOT NULL DEFAULT '#f0c15d',
      notes TEXT[] NOT NULL DEFAULT '{}',
      start_date TIMESTAMP NOT NULL,
      end_date TIMESTAMP NOT NULL,
      is_active BOOLEAN NOT NULL DEFAULT true,
      capacity INTEGER CHECK (capacity >= 0),
      waitlist_enabled BOOLEAN NOT NULL DEFAULT false,
      is_registerable BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMP NOT NULL DEFAULT now(),
      updated_at TIMESTAMP DEFAULT now()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS staff (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      staff_group TEXT NOT NULL DEFAULT 'staff',
      bio TEXT,
      image_url TEXT,
      display_order INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT now(),
      updated_at TIMESTAMP DEFAULT now()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS admins (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT now()
    );
  `);
}

export async function ensureEventColumns() {
  await pool.query(`
    ALTER TABLE events
    ADD COLUMN IF NOT EXISTS is_registerable BOOLEAN NOT NULL DEFAULT false;
  `);

  await pool.query(`
    ALTER TABLE events
    ADD COLUMN IF NOT EXISTS capacity INTEGER CHECK (capacity >= 0);
  `);

  await pool.query(`
    ALTER TABLE events
    ADD COLUMN IF NOT EXISTS color TEXT NOT NULL DEFAULT '#f0c15d';
  `);

  await pool.query(`
    ALTER TABLE events
    ADD COLUMN IF NOT EXISTS notes TEXT[] NOT NULL DEFAULT '{}';
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS event_occurrences (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
      occurrence_date DATE NOT NULL,
      start_time TIME NOT NULL,
      end_time TIME NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);

}

export async function ensureDonationColumns() {
  await pool.query(`
    ALTER TABLE donations
    ADD COLUMN IF NOT EXISTS donation_email_sent_at TIMESTAMPTZ;
  `);
}

export async function ensureProgramColumns() {
  await pool.query(`
    ALTER TABLE programs
    ADD COLUMN IF NOT EXISTS location TEXT;
  `);

  await pool.query(`
    ALTER TABLE programs
    ADD COLUMN IF NOT EXISTS gallery_images TEXT[] NOT NULL DEFAULT '{}';
  `);
}

export async function ensureStaffColumns() {
  await pool.query(`
    ALTER TABLE staff
    ADD COLUMN IF NOT EXISTS staff_group TEXT NOT NULL DEFAULT 'staff';
  `);
}

export async function ensureRegistrationTables() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS program_registrations (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      status TEXT NOT NULL CHECK (status IN ('waitlisted', 'registered', 'cancelled'))
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS event_registrations (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      status TEXT NOT NULL CHECK (status IN ('waitlisted', 'registered', 'cancelled'))
    );
  `);

  await pool.query(`
    ALTER TABLE event_registrations
    ADD COLUMN IF NOT EXISTS event_occurrence_id UUID REFERENCES event_occurrences(id) ON DELETE SET NULL;
  `);

  await pool.query(`
    ALTER TABLE program_registrations
    ADD COLUMN IF NOT EXISTS notes TEXT;
  `);

  await pool.query(`
    ALTER TABLE event_registrations
    ADD COLUMN IF NOT EXISTS notes TEXT;
  `);
}

export async function ensureVolunteerApplicationTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS volunteer_applications (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      roles TEXT[] NOT NULL DEFAULT '{}',
      availability TEXT[] NOT NULL DEFAULT '{}',
      skills TEXT,
      motivation TEXT,
      manage_token TEXT UNIQUE,
      status TEXT NOT NULL DEFAULT 'active',
      withdrawn_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);

  await pool.query(`
    ALTER TABLE volunteer_applications
    ADD COLUMN IF NOT EXISTS manage_token TEXT UNIQUE,
    ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active',
    ADD COLUMN IF NOT EXISTS withdrawn_at TIMESTAMPTZ;
  `);
}

export async function ensureContactMessagesTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      organization TEXT,
      message TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);
}

// Now anywhere in the backend can import:
// import { pool } from "../db/db.js";



/*------------------------------------------------
1. Postgres is a SERVER, like MySQL
2. Postgress must be RUNNING to accept CONNECTIONS
3. The Pool object manages multiple CONNECTION to the DB
4. The Pool uses the CONNECTION STRING to connect to the right DB 
5. The CONNECTION STRING = DATABASE_URL
6. a DATA BASE is just a named container of TABLES inside POSTGRES SERVER
7. LIBRARIES like PG only CONNECT to 1 existing DATABASE at a time

--------------------------------------------------
1. start posergresSQL RUN:
brew services start postgresql@16

2. verify postgres server is running RUN:
pg_isready

3. connect to psql shell RUN(enter/connect to posgress ):
psql postgres

4. list databases RUN:
\l

5. connect to a database RUN:
\c your_database_name

6. list tables in connected database RUN:
\dt

7. quit psql shell RUN:
\q

check postgres server status RUN:   
brew services list

*/
