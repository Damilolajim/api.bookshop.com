const { MongoClient, ServerApiVersion } = require("mongodb");

const DATABASE =
  process.env.NODE_ENV === "development" ? "bookshop" : "bookstore";

const client = new MongoClient(process.env.MONGO_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

(async () => {
  try {
    await client.connect();

    await client
      .db("admin")
      .command({ ping: 1 })
      .then(() => console.log("connection successfu;"));
  } catch (err) {
    console.dir(err);
  }
})();

module.exports = client.db(DATABASE);
