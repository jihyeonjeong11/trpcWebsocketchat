import { createContext } from './context';
import { appRouter } from './routers/_app';
import { applyWSSHandler } from '@trpc/server/adapters/ws';
import http from 'http';
import next from 'next';
import { parse } from 'url';
import ws from 'ws';

// const wss1 = new ws.Server({ port: 3001 });

// wss1.on('connection', function connection(ws) {
//   console.log('hello');
//   ws.on('error', console.error);

//   // ...
// });

const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

void app.prepare().then(() => {
  const server = http.createServer((req, res) => {
    const proto = req.headers['x-forwarded-proto'];
    if (proto && proto === 'http') {
      // redirect to ssl
      res.writeHead(303, {
        location: `https://` + req.headers.host + (req.headers.url ?? ''),
      });
      res.end();
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const parsedUrl = parse(req.url!, true);
    void handle(req, res, parsedUrl);
  });
  const wss = new ws.Server({ ...server, port: 3001 });
  const handler = applyWSSHandler({ wss, router: appRouter, createContext });

  process.on('SIGTERM', () => {
    console.log('SIGTERM');
    handler.broadcastReconnectNotification();
  });

  server.listen(port);

  // tslint:disable-next-line:no-console
  console.log(
    `> Servers listening at http://localhost:${port} as ${
      dev ? 'development' : process.env.NODE_ENV
    }`,
  );
});

// import { createContext } from './context';
// import { appRouter } from './routers/_app';
// import { applyWSSHandler } from '@trpc/server/adapters/ws';
// import http from 'http';
// import next from 'next';
// import { parse } from 'url';
// import ws, { WebSocketServer } from 'ws';

// const wss1 = new WebSocketServer({ noServer: true, port: 3001 });

// wss1.on('connection', function connection(ws) {
//   ws.on('error', console.error);

//   // ...
// });

// const port = parseInt(process.env.PORT || '3000', 10);
// const dev = process.env.NODE_ENV !== 'production';
// const app = next({ dev });
// const handle = app.getRequestHandler();

// void app.prepare().then(() => {
//   const server = http.createServer((req, res) => {
//     const proto = req.headers['x-forwarded-proto'];
//     if (proto && proto === 'http') {
//       // redirect to ssl
//       res.writeHead(303, {
//         location: `https://` + req.headers.host + (req.headers.url ?? ''),
//       });
//       res.end();
//       return;
//     }
//     // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
//     const parsedUrl = parse(req.url!, true);
//     void handle(req, res, parsedUrl);
//   });
//   console.log({ ...server, port: 3001 });
//   const wss = new ws.Server({ ...server, port: 3001 });
//   const handler = applyWSSHandler({ wss, router: appRouter, createContext });

//   process.on('SIGTERM', () => {
//     console.log('SIGTERM');
//     handler.broadcastReconnectNotification();
//   });
//   server.listen(port);

//   server.on('upgrade', function upgrade(request, socket, head) {
//     const { pathname } = parse(request.url);

//     if (pathname === '/foo') {
//       wss1.handleUpgrade(request, socket, head, function done(ws) {
//         wss1.emit('connection', ws, request);
//       });
//     } else if (pathname === '/bar') {
//       wss2.handleUpgrade(request, socket, head, function done(ws) {
//         wss2.emit('connection', ws, request);
//       });
//     } else {
//       socket.destroy();
//     }
//   });

//   // tslint:disable-next-line:no-console
//   console.log(
//     `> Servers listening at http://localhost:${port} as ${
//       dev ? 'development' : process.env.NODE_ENV
//     }`,
//   );
// });
