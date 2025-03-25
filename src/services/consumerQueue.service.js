"use strict";

const { connectToRabbitMQ, consumerQueue } = require("../dbs/init.rabbitmq");

class MessageService {
  async consumerToQueue(queueName) {
    try {
      const { channel } = await connectToRabbitMQ();

      await consumerQueue(channel, queueName);
    } catch (error) {
      console.error("Error consuming queue:", error);
    }
  }
}

module.exports = new MessageService();
