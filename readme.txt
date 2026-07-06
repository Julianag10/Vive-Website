dotenv.config()

cd backend
node server.js

OR

npm run dev   # where dev runs server.js from backend

in backend/package.json:
{
  "scripts": {
    "dev": "node server.js"
  }
}

Then always start the backend like this:

cd backend
npm run dev

------------------------------------------
Always start the backend like this:

cd backend
npm run dev


❌ Do NOT run:

node backend/server.js
------------------------------
HOW TO ACCESS DATANSE
do this i s beackend folder:
psql -d nonprofit_db


1. list databses:
\l


2. list tables 
\dt