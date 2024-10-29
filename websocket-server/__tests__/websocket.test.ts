// __tests__/websocket.test.ts
// import WebSocket from 'ws';
// import { createServer } from '../src/server';

// describe('WebSocket Server', () => {
//     let wss;
//     let client;

//     beforeEach((done) => {
//         wss = createServer();
//         client = new WebSocket('ws://localhost:8080');
//         client.on('open', done);
//     });

//     afterEach((done) => {
//         client.close();
//         wss.close(done);
//     });

//     test('should receive crypto updates after subscribing', (done) => {
//         client.send(JSON.stringify({
//             event: 'subscribe',
//             channel: 'rates'
//         }));

//         client.on('message', (data) => {
//             const message = JSON.parse(data.toString());
//             expect(message[0].channel).toBe('rates');
//             expect(message[0].data).toHaveProperty('symbol');
//             done();
//         });
//     });
// });