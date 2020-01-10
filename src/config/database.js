require('dotenv').config();

module.exports = {
  development: {
    dialect: 'sqlite',
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    storage: './src/database/db/database.sqlite3',
    define: {
      timestamps: true,
      underscored: true,
      underscoredAll: true,
    },
  },
  test: {
    dialect: 'sqlite',
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    storage: './src/database/db/database-test.sqlite3',
    define: {
      timestamps: true,
      underscored: true,
      underscoredAll: true,
    },
  },
  dialect: 'sqlite',
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  storage: './src/database/db/database.sqlite3',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
