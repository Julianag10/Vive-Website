// Given an email + password, tell me whether this is a valid admin
// authenticate credentials
// return admin identity or null 

import bcrypt from "bcrypt"; // one way password hasshign algo
import {pool} from "../../db/db.js"; // need to check if crediential are saved in db

export async function authenticateAdmin(email, password) {
    // returns the db row for the email
    const {rows} = await pool.query(
        "SELECT * FROM admins WHERE email  = $1",
        [email]
    );

    const admin = rows[0];

    if(!admin) return null;

    // password is the user typed input
    // admin.password_hash is encrypted pass stored in admin table 
    // bcrypt takes teh plain text password the user typed & compares it agains teh stored hash in the database
    // bcrypt never decrypts, it hases the incoming pass w/ same factor embeded in admin.password_hash and checks if the HASHES match
    const match = await bcrypt.compare(password, admin.password_hash);

    if (!match) return null;

    // admin.id and admin.email are cols in admin table returned from db
    return {id: admin.id, email: admin.email};
}
