import dotenv from "dotenv";
dotenv.config();

import pkg from 'pg';

const { Pool } = pkg;

console.log("DB connection string seen by pg:", process.env.DATABASE_URL);

// allows every route to write SQL like db.any();
// this pool is the source of DB access
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});


// Now anywhere in the backend can import:
// import { pool } from "../db/db.js";

// THIS FILE is the database connection manager
// db.js creates 1 db connection → every file reuses it


/*------------------------------------------------
1. Postgres is a server, like MySQL
2. Postgress must be running to accept connections
    To start Postgres locally:
    1. Open terminal
    2. Run: pg_ctl -D /usr/local/var/postgres start
    3. To stop: pg_ctl -D /usr/local/var/postgres stop
3. The Pool object manages multiple connections to the DB
4. The Pool uses the connection string to connect to the right DB
5. The connection string is stored in the .env file as DATABASE_URL

6. a data base is just a named container of tables inside postgres server
7. libraries like pg only connects to 1 EXISTING database at a time

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

9. PROVE CONNECTIVITY:rerun you db test:
node backend/test-db.js
--------------------
check postgres server status RUN:   
brew services list

*/