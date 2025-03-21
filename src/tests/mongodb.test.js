"use strict";

const { default: mongoose } = require("mongoose");

const connectString = "mongodb://localhost:27017/shopDEV";
const testSchema = new mongoose.Schema({ name: String });
const Test = mongoose.model("test", testSchema);

describe("Mongoose Collection", () => {
  let connection;

  beforeAll(async () => {
    connection = await mongoose.connect(connectString);
  });

  afterAll(async () => {
    await Test.collection.drop();
    await connection.disconnect();
  });

  it("Should connect to MongoDB", () => {
    expect(mongoose.connection.readyState).toBe(1);
  });

  it("Should create a new document in the 'test' collection", async () => {
    const doc = new Test({ name: "New Test Document" });
    await doc.save();
    const result = await Test.findOne({ name: "New Test Document" });
    expect(result).toBeTruthy();
  });
});
