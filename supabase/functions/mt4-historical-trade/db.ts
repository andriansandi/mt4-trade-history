import postgres from 'https://deno.land/x/postgresql/mod.js';

// PostgreSQL
const pgsql = postgres({
    host            : 'localhost',         // Postgres ip address[s] or domain name[s]
    port            : 54322,               // Postgres server port[s]
    database        : 'postgres',          // Name of database to connect to
    username        : 'postgres',          // Username of database user
    password        : 'postgres', 
});

export default sql;