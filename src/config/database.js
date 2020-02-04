module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  port: 3333,
  username: 'postgres',
  password: 'postgres',
  database: 'fastfeet',
  define: {
    timestamp: true,
    underscored: true,
    underscoredAll: true,
  },
};
