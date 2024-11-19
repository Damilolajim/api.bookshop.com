/* eslint-disable linebreak-style */
const app = require("./app");
const { MongoClient, ServerApiVersion } = require("mongodb");

const catchErr = require("./utilities/catchError");

const start = catchErr(async () => {
  const client = new MongoClient(process.env.MONGO_URI, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  await client.connect();
  await client
    .db("admin")
    .command({ ping: 1 })
    .then(() => console.log("connection successfu;"));

  app.listen(process.env.PORT, () =>
    console.log(`Bookshop server listening on ${process.env.PORT}...`)
  );
});

start();
