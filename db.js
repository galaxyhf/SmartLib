const { Pool } = require('pg');

const pool = new Pool({
    user: 'smartlib',
    host: 'localhost',
    database: 'SMARTLIB',
    password: '123456',
    port: 5432,
    options: '-c search_path=auth'
});

module.exports = pool;
