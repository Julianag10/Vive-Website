// PUBLIC WRITE + STATUS UPDATES

import { pool } from "../db/db.js";

// IDEMPOTENT INSERT OF DONATION RECORD
// safe for RETRIES (webhook retries & stripe duplicate events)
// function acceors a single object 
export async function insertDonation({
  stripeSessionId,
  stripePaymentIntentId,
  amountCents,
  currency = "usd",
  donorEmail,
  status = "pending",
}) {
    const query = `
        INSERT INTO donations (
            stripe_session_id,
            stripe_payment_intent_id,
            amount_cents,
            currency,
            donor_email,
            status
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (stripe_session_id) DO NOTHING
        RETURNING id;
    `;
    // ON CONFLICT ... DO NOTHING:
    // If duplicate → does nothing (safe retry)

    // RETURNING id:
    // returns the new row's id if inserted, else nothing

    // VALUES $1, $2, ... are placeholders
    // $1 -> values[0]
    const values = [
        stripeSessionId,        // $1
        stripePaymentIntentId,  // $2
        amountCents,            // $3
        currency,               // $4
        donorEmail,             // $5
        status,                 // $6
    ];      

    // pool.query sends SQL to Postgres
    // pool.query returns an object:
    // {
    //     rows: [ { id: "uuid-here" } ],
    //     rowCount: 1,
    //     ...
    // }
    // const {rows} getting the row's id from the result
    // passign the actual values separately prevents SQL injection
    const { rows } = await pool.query(query, values);
    
    // if INSERT happened -> rows[0] EXISTS and is the new row
    // if CONFLICT ...DO NOTHING -> no new row(row already existed) -> rows[0] is NULL/UNDEFINED
    // if INSERT HAOEndED -> function returns the new donation's id
    // if CONFLICT -> function returns NULL ( know that row already existed)
    return rows[0] ?? null; 
}


export async function markDonationSucceeded({
    stripeSessionId,
    stripePaymentIntentId,
}) {
    const query = `
            UPDATE donations
            SET
                status = 'succeeded',
                stripe_payment_intent_id = COALESCE($2, stripe_payment_intent_id)
            WHERE stripe_session_id = $1
                AND status != 'succeeded'
            RETURNING id;
    `;
    // AND status != 'succeeded' -> idempotent:
    // if donation already SUCCEEDED, no update happens
    // if donation is PENDING, UPDATE to SUCCEEDED

    const { rows } = await pool.query(query, [
            stripeSessionId,
            stripePaymentIntentId,
    ]);

    return rows[0] ?? null;
}


