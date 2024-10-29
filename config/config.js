require('dotenv').config(); 

module.exports = {
  development: {
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    host: process.env.PROD_HOST,
    dialect: 'postgres',
    port: Number(process.env.DATABASE_PORT),
  },
  production: {
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    host: process.env.PROD_HOST,
    dialect: 'postgres',
    port: Number(process.env.DATABASE_PORT),
  },
};
