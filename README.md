# Setup Apollo Server Express [![Build Status](https://github.com/Links2004/arduinoWebSockets/workflows/CI/badge.svg?branch=master)](https://github.com/nqnghia285/setup-apollo-server-express.git)

### Functions:

```typescript
/**
 * @method startApolloServerWithSchema Start apollo server with apply middleware express
 * @param app Express
 * @param httpServer Server
 * @param host string
 * @param port number
 * @param schema GraphQLSchema
 * @param context object | ContextFunction<ExpressContext, object> | undefined
 * @param handleResolver (args: GraphQLFieldResolverParams<any, BaseContext, { [argName: string]: any }>) => void
 * @param path string
 * @param uploads boolean | FileUploadOptions | undefined
 * @param modules GraphQLSchemaModule[] | undefined
 * @returns Promise<ApolloServer>
 */
function startApolloServerWithSchema(
    app: Express,
    httpServer: Server,
    host: string,
    port: number,
    schema: GraphQLSchema,
    context?: object | ContextFunction<ExpressContext, object>,
    handleResolver?: (args: GraphQLFieldResolverParams<any, BaseContext, { [argName: string]: any }>) => void,
    path?: string,
    uploads?: boolean | FileUploadOptions,
    modules?: GraphQLSchemaModule[],
): Promise<ApolloServer>;
```

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
 * @param handleResolver (args: GraphQLFieldResolverParams<any, BaseContext, { [argName: string]: any }>) => void
 * @param path string
 * @param uploads boolean | FileUploadOptions | undefined
 * @param modules GraphQLSchemaModule[] | undefined
 * @returns Promise<ApolloServer>
 */
function startApolloServer(
    app: Express,
    httpServer: Server,
    host: string,
    port: number,
    typeDefs: string | DocumentNode | DocumentNode[] | string[],
    resolvers?: IResolvers<any, any> | IResolvers<any, any>[],
    context?: object | ContextFunction<ExpressContext, object>,
    handleResolver?: (args: GraphQLFieldResolverParams<any, BaseContext, { [argName: string]: any }>) => void,
    path?: string,
    uploads?: boolean | FileUploadOptions,
    modules?: GraphQLSchemaModule[],
): Promise<ApolloServer>;
```

### Example:

```typescript
// ES6
import dotenv from "dotenv";
import { createServer } from "http";
import express from "express";
import { Models } from "./interface";
import models from "./database/models";
import { startApolloServer } from "setup-apollo-server-express";
import typeDefs from "./graphql/type_defs";
import resolvers from "./graphql/resolvers";
import { gql, ExpressContext } from "apollo-server-express";
import { makeExecutableSchema } from "@graphql-tools/chema";
import { BaseContext, GraphQLFieldResolverParams } from "apollo-server-plugin-base";
import { GraphQLModule } from "@graphql-modules/core";
import { GraphQLUpload } from "graphql-upload";

dotenv.config();

const HOST_NAME = process.env.HOST_NAME || "0.0.0.0";
const PORT = parseInt(process.env.PORT || "5000", 10);
const GRAPHQL_PATH = process.env.GRAPHQL_PATH || "/graphql";

const app = express();
const httpServer = createServer(app);

function handleReq({ req }: ExpressContext): { message?: string; models?: Models } {
    return { message: req.headers.cookie, models: models };
}

function handleResolver({ source, args, context, info }: GraphQLFieldResolverParams<any, BaseContext, { [argName: string]: any }>) {
    // TODO
}

const UploadOptions = {
    maxFileSize: 10000000, // 10 MB
    maxFiles: 20,
};

const UploadModule = new GraphQLModule({
    typeDefs: gql`
        scalar Upload
    `,
    resolvers: {
        Upload: GraphQLUpload,
    },
});

// Start Apollo server
startApolloServer(app, httpServer, HOST_NAME, PORT, typeDefs, resolvers, handleReq, handleResolver, GRAPHQL_PATH, UploadOptions, UploadModule);

// Or
// Merge schema
const schema = makeExecutableSchema({
    typeDefs: typeDefs,
    resolvers: resolvers,
});

startApolloServerWithSchema(app, httpServer, HOST_NAME, PORT, schema, handleReq, handleResolver, GRAPHQL_PATH, UploadOptions, UploadModule);
```
