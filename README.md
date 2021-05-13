# Setup Apollo Server Express [![Build Status](https://github.com/Links2004/arduinoWebSockets/workflows/CI/badge.svg?branch=master)](https://github.com/nqnghia285/setup-apollo-server-express.git)

### Functions:

```typescript
/**
 * @method startApolloServer Start apollo server with apply middleware express
 * @param app Express
 * @param httpServer Server
 * @param host string
 * @param port number
 * @param typeDefs string | DocumentNode | DocumentNode[] | string[] | undefined
 * @param resolvers IResolvers<any, any> | IResolvers<any, any>[] | undefined
 * @param context object | ContextFunction<ExpressContext, object> | undefined
 * @param path string
 * @returns Promise<ApolloServer>
 */
function startApolloServer(
    app: Express,
    httpServer: Server,
    host: string,
    port: number,
    typeDefs?: string | DocumentNode | DocumentNode[] | string[],
    resolvers?: IResolvers<any, any> | IResolvers<any, any>[],
    context?: object | ContextFunction<ExpressContext, object>,
    path?: string,
): Promise<ApolloServer>;
```

### Example:

```typescript
// ES6
import dotenv from "dotenv";
import { createServer } from "http";
import express from "express";
import { Socket } from "socket.io";
import io, { createNamespace, initIO } from "setup-socket.io";

dotenv.config();

const ORIGIN = process.env.ORIGIN || "*";

const app = express();
const server = createServer(app);

// Init io
initIO(server, ORIGIN);

// Create client namespace
const client = createNamespace("/client");

io.on("connection", (socket: Socket) => {
    socket.on("your-event", (message) => {
        console.log(message);
        console.log("Cookies:", socket.request.cookies);
    });
});

client.on("connection", (socket: Socket) => {
    socket.on("your-event", (message) => {
        console.log(message);
        console.log("Cookies:", socket.request.cookies);
    });
});
```
