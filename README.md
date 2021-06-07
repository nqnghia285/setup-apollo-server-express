# Setup Apollo Server Express [![Build Status](https://github.com/Links2004/arduinoWebSockets/workflows/CI/badge.svg?branch=master)](https://github.com/nqnghia285/setup-apollo-server-express.git)

### Functions:

```typescript
/**
 * @method createDefaultConfig
 * @param configOptions ConfigOptions
 * @returns ApolloServerExpressConfig
 */
function createDefaultConfig(configOptions: ConfigOptions): ApolloServerExpressConfig;
```

```typescript
/**
 * @method startApolloServer Start apollo server with apply middleware express
 * @param config ApolloServerExpressConfig
 * @param app Express
 * @param httpServer Server
 * @param host string
 * @param port number
 * @param path string
 * @returns Promise<ApolloServer>
 */
function startApolloServer(config: ApolloServerExpressConfig, app: Express, httpServer: Server, host: string, port: number, path: string): Promise<ApolloServer>;
```

### Example:

```typescript
// ES6
import dotenv from "dotenv";
import { createServer } from "http";
import express from "express";
import { Models } from "./interface";
import models from "./database/models";
import { startApolloServer, ResolverParams, ContextParams } from "setup-apollo-server-express";
import typeDefs from "./graphql/type_defs";
import resolvers from "./graphql/resolvers";
import { makeExecutableSchema } from "@graphql-tools/chema";
import { ApolloServerExpressConfig, ExpressContext } from "apollo-server-express";

dotenv.config();

const app = express();
const httpServer = createServer(app);

// Setup app
app.use(cors...)

// Handle req before passed to resolver functions
function handleReq({ req }: ExpressContext): { message?: string; models?: Models } {
	return { message: req.headers.cookie, models: models };
}

// Handle data before passed to resolver functions
function handleResolver({ source, args, context, info }: ResolverParams) {
	// TODO
}

// Format response
function formatResponse(response: GraphQLResponse, requestContext: GraphQLRequestContext<object>): GraphQLResponse | null {
		if (response.data?.getAllOfUsers !== undefined) {
			response.data.users = response.data.getAllOfUsers;
			delete response.data.getAllOfUsers;
		}
		return response;
	}

// Merge schema
const schema = makeExecutableSchema({
	typeDefs: typeDefs,
	resolvers: resolvers,
});

// Create config
const configOptions: ConfigOptions = {
   schema: schema,
   context: handleReq,
   handleResolver: handleResolver,
   formatResponse: formatResponse,
}

const config = createDefaultConfig(configOptions);

// Or declare config as follow:
const config: ApolloServerExpressConfig = {
   schema: schema,
	context: handleReq,
	uploads: false,
	tracing: process.env.NODE_ENV !== "production",
	formatResponse: formatResponse,
	plugins: [
		{
			requestDidStart(requestContext) {
				return {
					executionDidStart(executionRequestContext) {
						return {
							willResolveField(fieldResolverParams: ResolverParams) {
								handleResolver(fieldResolverParams);
							},
						};
					},
				};
			},
		},
	],
   ...
}

// Start Apollo server
const apolloServer = startApolloServer(config, app, httpServer); // Default values: host = "0.0.0.0", port = 5000, path = "/graphql"
```
