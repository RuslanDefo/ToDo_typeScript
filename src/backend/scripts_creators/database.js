const { Client } = require('pg');

const client = new Client({
  user: 'postgres',
  password: '784944',
  host: 'localhost',
  port: '5432'
});

const createDatabase = async () => {
  try {
    await client.connect();
    await client.query('CREATE DATABASE ruslandb');
  } catch (error) {
    console.log(error);
    return false;
  } finally {
    await client.end();
  }
};

createDatabase().then((result) => {
  console.log('Database created');
});
