const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', err => {
  console.log(err);
  console.log('Uncaught exception. app is shuting down');
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log('DB connected');
  });

// start the server and choose the port
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`app running on port ${port}`);
});

process.on('unhandledRejection', err => {
  console.log(err);
  console.log('Unhandled rejection. app is shuting down');
  server.close(() => {
    process.exit(1);
  });
});
