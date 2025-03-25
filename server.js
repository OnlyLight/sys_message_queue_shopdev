"use strict";

const messageService = require("./src/services/consumerQueue.service");

const queueName = "test-queue";

messageService
  .consumerToQueue(queueName)
  .then(() => {
    console.log(`Consumer queue ${queueName}`);
  })
  .catch((err) => {
    console.error(`Error consuming queue: ${err}`);
  });
