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

9. PROVE CONNECTIVITY:rerun you db test:
node backend/test-db.js
--------------------
check postgres server status RUN:   
brew services list

*/