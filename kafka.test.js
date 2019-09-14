const expect = require('chai').expect;
const { KafkaClient, Producer, Consumer } = require('kafka-node');

describe('Kafka example', () => {

  const topicName = 'kafka-node-testing';
  const kafkaClientConfig = { kafkaHost: 'localhost:9092' };

  before(done => {
    createTopic(done);
  });

  it('sends and receives a message', (done) => {
    const testMessage = 'a test message';
    produceMessage(testMessage);
    consumeMessage(message => {
      expect(message.topic).to.equal(topicName);
      expect(message.value).to.equal(testMessage);
      done();
    });
  });

  function createTopic(done) {
    const client = new KafkaClient(kafkaClientConfig);
    client.createTopics([{
      topic: topicName,
      partitions: 1,
      replicationFactor: 1
    }], (err, result) => {
      client.close(done);
    });
  }

  function produceMessage(message) {
    const producer = new Producer(new KafkaClient(kafkaClientConfig));
    producer.on('error', (err) => {
      console.log(err);
      console.log('connection errored');
      throw err;
    });
    const payloads = [
      {
        topic: topicName,
        messages: message
      }
    ];
    producer.on('ready', () => {
      producer.send(payloads, (err, data) => {
        if (err) {
          console.log('broker update fail');
        }
        producer.close();
      });
    });
  }

  function consumeMessage(messageHandler) {
    const consumerPayloads = [{ topic: topicName }];
    const consumer = new Consumer(new KafkaClient(kafkaClientConfig), consumerPayloads, {});
    consumer.on('message', (message) => {
      consumer.close(() => messageHandler(message));
    });
  }

});
