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

module.exports = client.db(DATABASE);
