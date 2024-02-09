import nats, { Message } from 'node-nats-streaming';

console.clear();

const stan = nats.connect('ticketing', '123', {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log('Listener connected to NATS');

  const subscription = stan.subscribe('ticket:created');

  // message = event data
  subscription.on('message', (msg: Message) => {
    console.log('Message received');
    const data = msg.getData();

    if (typeof data === 'string') {
      console.log(`Received event #${msg.getSequence()}, with data: ${data}`);
    }
  });
});
