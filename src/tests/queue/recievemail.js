"use strict";

const amqp = require("amqplib");

const connectionString = "amqp://guest:guest@localhost";

const receiveQueue = () => {
  return amqp
    .connect(connectionString)
    .then((conn) => conn.createChannel())
    .then((ch) => {
      const queueTopic = "send_mail";
      const queueHandler = "queue_handler";
      ch.assertExchange(queueTopic, "topic", {
        durable: false,
      });

      const { queue } = ch.assertQueue(queueHandler, { exclusive: true });

      const args = process.argv.slice(2);
      if (args.length < 1) {
        console.error("Usage: node queue_consumer.js [message]");
        process.exit(1);
      }

      args.forEach((key) => {
        ch.bindQueue(queue, queueTopic, key);
      });

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
