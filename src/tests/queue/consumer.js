"use strict";

const amqp = require("amqplib");

const connectionString = "amqp://guest:guest@localhost";

const receiveQueue = () => {
  return amqp
    .connect(connectionString)
    .then((conn) => conn.createChannel())
    .then((ch) => {
      const queue = "test_queue";
      ch.assertQueue(queue, { durable: false });
      ch.consume(
        queue,
        (msg) => {
          console.log(`Received:: ${msg.content.toString()}`);
        },
        {
          noAck: true, // mark this message have been consume
        }
      );
    })
    .catch((err) => console.error("Error sending message:", err));
};

receiveQueue();
