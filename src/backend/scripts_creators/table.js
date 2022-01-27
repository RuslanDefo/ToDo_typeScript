const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  port: '5432',
  database: 'ruslandb',
  user: 'postgres',
  password: '784944'
});

let table = `
    CREATE TABLE  "tasks" (
        "id" SERIAL PRIMARY KEY,
        "text" VARCHAR(255) NOT NULL,
        "checked" BOOLEAN NOT NULL
    );
`

const createTable = async (query) => {
  try {
    await client.connect();
    await client.query(query);
  } catch (error) {
    console.log(error);
    return false;
  } finally {
    await client.end();
  }
};

createTable(table).then((result) => {
  console.log('Table created');
});
