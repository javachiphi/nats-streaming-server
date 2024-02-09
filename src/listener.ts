import nats, { Message } from 'node-nats-streaming';
import { randomBytes } from 'crypto';

console.clear();

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log('Listener connected to NATS');

  stan.on('close', () => {
    console.log('NATS connection closed!');
    process.exit();
  });

  const options = stan
    .subscriptionOptions()
    .setManualAckMode(true)
    .setDeliverAllAvailable()

    .setDurableName('accounting-service');

  const subscription = stan.subscribe(
    'ticket:created',
    'queue-group-name',
    options
  );

  // message = event data
  subscription.on('message', (msg: Message) => {
    console.log('Message received');
    const data = msg.getData();

    if (typeof data === 'string') {
      console.log(`Received event #${msg.getSequence()}, with data: ${data}`);
    }

    msg.ack();
  });
});

// graceful client shutdown
process.on('SIGINT', () => stan.close()); //interrupt signal
process.on('SIGTERM', () => stan.close());
