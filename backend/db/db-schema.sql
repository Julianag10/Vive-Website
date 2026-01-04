-- All your future schemas:
-----------------------------------------
-- IDEMPOTENCY -> stripe_session_id is UNIQUE
-- if stripe retries -> insert fails 
-- backend can INSERT ... ON CONFLICT DO NOTHING

-- MUTABLE -> status can be updated(not created) later by webhook

-- DONATION LIFE CYCLE:
-- created → pending → succeeded | failed → refunded (later)

-- DONATION WRITE happens after backedn stripe verification:
-- stripe_session_id -> refresh safe
-- INSERT … ON CONFLICT DO NOTHING -> idempotent (retry safe & webhook safe)

CREATE TABLE donations (
  id SERIAL PRIMARY KEY,

  -- Stripe identity (critical)
  stripe_session_id TEXT UNIQUE NOT NULL,
  stripe_payment_intent_id TEXT,

  -- Money
  amount_cents INTEGER NOT NULL,
--   currency TEXT NOT NULL DEFAULT 'usd',

  -- Classification
  donation_type TEXT NOT NULL CHECK (donation_type IN ('preset', 'custom')),
  preset_id TEXT,

  -- Lifecycle
--   weebhook wil lupdate status later, not create
  status TEXT NOT NULL CHECK (
    status IN ('pending', 'succeeded', 'failed', 'refunded')
  ),

  donor_email TEXT,
  name TEXT,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);


-- WEEBHOOKS FUTURE 
UPDATE donations
SET status = 'succeeded',
    stripe_payment_intent_id = 'pi_...',
    updated_at = NOW()
WHERE stripe_session_id = 'cs_...';


-- IDEMPOTENT WRITE:
INSERT INTO donations (
  stripe_session_id,
  stripe_payment_intent_id,
  amount_cents,
  currency,
  donation_type,
  preset_id,
  donor_email,
  status
)
VALUES (...)
ON CONFLICT (stripe_session_id) DO NOTHING;


-- RAW SQL IDEMPOTENT INSERT:
const query = `
  INSERT INTO donations (
    stripe_session_id,
    stripe_payment_intent_id,
    amount_cents,
    currency,
    donation_type,
    preset_id,
    donor_email,
    status
  )
  VALUES ($1, $2, $3, $4, $5, $6, $7, 'succeeded')
  ON CONFLICT (stripe_session_id) DO NOTHING;
`;

await pool.query(query, [
  session.id,
  session.payment_intent,
  session.amount_total,
  session.currency,
  donationType,
  presetId ?? null,
  session.customer_details?.email ?? null,
]);

-- ADMIN RAW READ
const { rows } = await pool.query(`
  SELECT
    amount_cents,
    currency,
    donation_type,
    status,
    created_at
  FROM donations
  ORDER BY created_at DESC;
`);
-----------------------------------------
-- admin wrties are authortitive
-- porgrams are mutatble 

-- PROGRAM WRITE 
-- admin only 
-- simple insert/update
CREATE TABLE programs (
  id SERIAL PRIMARY KEY,

  title TEXT NOT NULL,
  description TEXT NOT NULL,

  start_date DATE NOT NULL,
  end_date DATE,

  location TEXT,
  capacity INTEGER,

  is_active BOOLEAN DEFAULT TRUE,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);


-----------------------------------------
-- ADMIN
-----------------------------------------
-- Append-only = safe
-- no updates needed 
-- no user accounts implied
-- admin reads only

-- REGISTRATION WRITE:
-- public
-- always insert
-- never update

CREATE TABLE registrations (
  id SERIAL PRIMARY KEY,

  program_id INTEGER NOT NULL REFERENCES programs(id) ON DELETE CASCADE,

  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  notes TEXT,

  created_at TIMESTAMP DEFAULT NOW()
);




-----------------------------------------
CREATE TABLE admins (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

