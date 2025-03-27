"use strict";

const amqp = require("amqplib");

const connectionString = "amqp://guest:guest@localhost";

const sendQueue = ({ msg }) => {
  return amqp
    .connect(connectionString)
    .then((conn) => conn.createChannel())
    .then((ch) => {
      const queue = "test_queue";
      ch.assertQueue(queue, { durable: false });
      // can encode to byte and support send with buffer, faster
      ch.sendToQueue(queue, Buffer.from(msg), {
        persistent: false, // persistent message, survives server restarts, default is true only affects when queue enabled option durable: true (save to disk or cache)
        expiration: "10000",
      });
      console.log(` [x] Sent:: '${msg}'`);
    })
    .catch((err) => console.error("Error sending message:", err));
};

sendQueue({ msg: "Hello, World!" });
