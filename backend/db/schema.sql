/*

IDEMPTOTENCY
operation is idempotent if repeating it has same effect as doing it once

WHY IDEMPOTENCY IS IMPORTANT
- stripe can retry API calls
- browsers can refresh 
- webhooks can be delivered mulitple tiems 
- network failures can cause duplicate requests
- "this same event might hit my backend more than once"

RISKS OF NON-IDEMPOTENT OPERATIONS
admin sees two donations BUT money happended only once -> my database DATA IS lying
1. stripe creates checkout session 
2. backend inserts donation into DB
3. netwrok hiccup -> stripe retries sending checkout session to backend
4. backend inserts another donation, but backend must not create duplicate donation record

SOLUTION: USE UNIQUE CONSTRAINTS TO PREVENT DUPLICATES
- make sure each donation has a globally unique identity (UUID)
- DATABASE REJECTS DUPLICATE INSERTS:
    use stripe session ID as UNIQUE CONSTRAINT to prevent duplicate backend inserts
- INSERT … ON CONFLICT DO NOTHING -> idempotent (retry safe & webhook safe)

*/
-- ---------------------------------------
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
-- ---------------------------------------
-- DONATION LIFE CYCLE:
-- created → pending → succeeded | failed → refunded (later)

-- DONATION WRITE
-- happens after backedn stripe verification
-- idempotent write (retry safe & webhook safe):
    -- INSERT INTO donations … ON CONFLICT (stripe_session_id) DO NOTHING

-- WEEBHOOKS FUTURE
-- UPDATE donations
-- SET status = 'succeeded',
-- stripe*payment_intent_id = 'pi*...',
-- updated*at = NOW()
-- WHERE stripe_session_id = 'cs*...';

CREATE TABLE donations (
    -- each donation has a globally uunique identity -> NO RACE CONDITIONS 
    -- race condtions: two processes try to create same thing at same time
    -- race condtions -> use UNIQUE CONSTRAINTS to prevent duplicates
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- stripe guarntees session IDs are unique per checkout
    -- UNIQUE CONSTRAINT prevents duplicate backend INSERTS
    stripe_session_id TEXT UNIQUE NOT NULL,

    -- linke later via webhook or stuaus check
    stripe_payment_intent_id TEXT,

    amount_cents INTEGER NOT NULL CHECK (amount_cents > 0),

    currency TEXT NOT NULL DEFAULT 'usd',

    -- weebhook will update status later, not create
    -- every donation is in a known lifecycle stage
    status TEXT NOT NULL CHECK (
        status IN ('pending', 'succeeded', 'failed', 'refunded', 'abandond')
    ),

    donor_email TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ----------------------------------------
-- PROGRAM WRITE 
-- porgrams are mutatble 
-- admin only 
-- simple insert/update
CREATE TABLE IF NOT EXISTS programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    capacity INTEGER CHECK (capacity >= 0),
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP DEFAULT NOW(),
    image_url TEXT,
    activities TEXT[]
);

ALTER TABLE programs
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT false;
-- -------------------------------------------
-- REGISTRATION WRITE:
-- Append-only = safe
-- admin reads only
-- public
-- always insert
-- never update
CREATE TABLE IF NOT EXISTS program_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- foreign key to programs table
  -- you canot register for a progrma tht dose not exist
  -- ON DELETE CASCADE -> if program is deleted, delete registrations too (prevents orphan data )
  program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  status TEXT NOT NULL CHECK ( status IN ('waitlisted', 'registered', 'cancelled') ),
);

CREATE TABLE IF NOT EXISTS event_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    status TEXT NOT NULL CHECK ( status IN ('waitlisted', 'registered', 'cancelled') )
);

-- ---------------------------------------
CREATE TABLE IF NOT EXISTS admins (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  capacity INTEGER CHECK (capacity >= 0),
  waitlist_enabled BOOLEAN NOT NULL DEFAULT false,
  is_registerable BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE events
ADD COLUMN IF NOT EXISTS location TEXT;

ALTER TABLE events
ADD COLUMN IF NOT EXISTS is_registerable BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE events
ALTER COLUMN start_date TYPE TIMESTAMP USING start_date::timestamp,
ALTER COLUMN end_date TYPE TIMESTAMP USING end_date::timestamp;

-- ---------------------------------------
CREATE TABLE IF NOT EXISTS staff (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT,
  image_url TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
-- ---------------------------------------