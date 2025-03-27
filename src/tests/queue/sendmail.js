"use strict";

const amqp = require("amqplib");

const connectionString = "amqp://guest:guest@localhost";

const sendQueue = () => {
  return amqp
    .connect(connectionString)
    .then((conn) => conn.createChannel())
    .then((ch) => {
      const queue = "send_mail";
      ch.assertExchange(queue, "topic", {
        durable: false,
      });

      const args = process.argv.slice(2);
      const msg = args[1] || "Fixed";
      const topic = args[0];

      ch.publish(queue, topic, Buffer.from(msg));
      console.log(` [x] Sent '${topic}':: '${msg}'`);
      ch.close();
    })
    .catch((err) => console.error("Error sending message:", err));
};

sendQueue({ msg: "Hello, World!" });
