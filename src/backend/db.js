const Pool = require('pg').Pool;
const pool = new Pool({
  user: 'postgres',
  password: '784944',
  host: 'localhost',
  port: '5432',
  database: 'ruslandb'
});

module.exports = pool;
