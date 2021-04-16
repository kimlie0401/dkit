const rootDir = process.env.NODE_ENV === "development" ? "src" : "build";

module.exports = {
  type: process.env.DB_DIALECT,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: false,
  logging: process.env.NODE_ENV === "development",
  entities: [rootDir + "/entities/**/*{.ts,.js}"],
  migrations: [rootDir + "/migrations/**/*{.ts,.js}"],
  subscribers: [rootDir + "/subscribers/**/*{.ts,.js}"],
  seeds: [rootDir + "/seeds/**/*{.ts,.js}"],
  cli: {
    entitiesDir: rootDir + "/entities",
    migrationsDir: rootDir + "/migrations",
    subscribersDir: rootDir + "/subscribers",
  },
};

// module.exports={
//   "type": "postgres",
//   "host": "192.168.1.117",
//   "port": 4321,
//   "username": "postgres",
//   "password": "04012548",
//   "database": "dkit",
//   "synchronize": true,
//   "logging": false,
//   "entities": ["src/entities/**/*.ts"],
//   "migrations": ["src/migrations/**/*.ts"],
//   "subscribers": ["src/subscribers/**/*.ts"],
//   "seeds": ["src/seeds/**/*{.ts,.js}"],
//   "cli": {
//     "entitiesDir": "src/entities",
//     "migrationsDir": "src/migrations",
//     "subscribersDir": "src/subscribers"
//   }
// }
