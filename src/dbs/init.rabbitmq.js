"use strict";

const amqp = require("amqplib");

const connectToRabbitMQ = async () => {
  try {
    const connection = await amqp.connect("amqp://guest:guest@localhost");
    if (!connection) throw new Error("Couldn't connect to RabbitMQ");

    const channel = await connection.createChannel();
    if (!channel) throw new Error("Couldn't create channel");

    return { channel, connection };
  } catch (error) {
    console.error("Error connecting to RabbitMQ:", error.message);
  }
};

const connectToRabbitMQForTest = async () => {
  try {
    const { channel, connection } = await connectToRabbitMQ();

    const queue = "test-queue";
    const message = "hello world";

    await channel.assertQueue(queue);
    await channel.sendToQueue(queue, Buffer.from(message));
    console.log(`Sent message: ${message}`);

    await channel.close();
    await connection.close();
  } catch (error) {
    console.error("Error connecting to RabbitMQ for test:", error.message);
  }
};

module.exports = {
  connectToRabbitMQ,
  connectToRabbitMQForTest,
};
