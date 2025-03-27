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

  async consumerToQueueNormal() {
    try {
      const { channel } = await connectToRabbitMQ();

      const notiQueue = "notificationQueueProcess"; // assertQueue

      await channel.consume(notiQueue, (msg) => {
        try {
          console.log(`Received message: ${msg.content.toString()}`);
          channel.ack(msg);
        } catch (error) {
          console.error("Error processing message:", error);
          // argument 2: có gửi lại queue ban đầu không
          // argument 3: có từ chối tất cả message ko (chỉ từ chối message này)
          channel.nack(msg, false, false);
        }
      });
    } catch (error) {
      console.error("Error consuming queue:", error);
    }
  }

  async consumerToQueueFailed() {
    try {
      const { channel } = await connectToRabbitMQ();

      const notificationExchangeDLX = "notificationExDLX"; // dlx
      const notificationRoutingKeyDLX = "notificationRoutingKeyDLX";
      const notificationQueueHandle = "notificationQueueHandle";

      await channel.assertExchange(notificationExchangeDLX, "direct", {
        // access to deadletterExchange to get message error
        durable: true,
      });

      const queueResult = await channel.assertQueue(notificationQueueHandle, {
        exclusive: true,
      });

      // queueResult.queue => name Queue tmp
      // bind message from deadletterExchange with new queue
      await channel.bindQueue(
        queueResult.queue,
        notificationExchangeDLX,
        notificationRoutingKeyDLX
      );
      await channel.consume(
        queueResult.queue,
        (msgFailed) => {
          console.log(
            `Received message failed: ${msgFailed.content.toString()}`
          );
        },
        {
          noAck: true,
        }
      );
    } catch (error) {}
  }
}

module.exports = new MessageService();
