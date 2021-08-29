# Setup Apollo Server Express [![Build Status](https://github.com/Links2004/arduinoWebSockets/workflows/CI/badge.svg?branch=master)](https://github.com/nqnghia285/setup-apollo-server-express.git)

### Functions:

```typescript
/**
 * @method createDefaultConfig
 * @param configOptions ConfigOptions
 * @returns ApolloConfig
 */
function createDefaultConfig(configOptions: ConfigOptions): ApolloConfig;
```

```typescript
/**
 * @method startApolloServer Start apollo server with apply middleware express
 * @param config ApolloConfig
 * @param app Express
 * @param httpServer Server
 * @param host string
 * @param port number
 * @param path string
 * @param uploadOptions UploadOptions | undefined
 * @returns Promise<ApolloServer>
 */
function startApolloServer(config: ApolloConfig, app: Express, httpServer: Server, host?: string, port?: number, path?: string, uploadOptions?: UploadOptions): Promise<ApolloServer>;
```

### Example:

```typescript
// ES6
import dotenv from "dotenv";
import { createServer } from "http";
import express from "express";
import { Models } from "./interface";
import models from "./database/models";
import { startApolloServer, ResolverParams, ContextParams, ApolloConfig } from "setup-apollo-server-express";
import { ApolloServerPluginLandingPageGraphQLPlayground, ApolloServerPluginLandingPageDisabled, ContextFunction } from "apollo-server-core";
import typeDefs from "./graphql/type_defs";
import resolvers from "./graphql/resolvers";
import schema from "./graphql";
import { makeExecutableSchema } from "@graphql-tools/chema";
import { ExpressContext } from "apollo-server-express";

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
			response.data.users = response.data.getAllOfUsers; // Add users attribute into data object
			delete response.data.getAllOfUsers; // Delete getAllOfUsers attribute in data object
		}
		return response;
	}

// Create config
const configOptions: ConfigOptions = {
   typeDefs: typeDefs,
   resolvers: resolvers,
   context: handleReq,
   handleResolver: handleResolver,
   formatResponse: formatResponse,
}

// Or
const configOptions: ConfigOptions = {
   schema: schema,
   context: handleReq,
   handleResolver: handleResolver,
   formatResponse: formatResponse,
}

const config = createDefaultConfig(configOptions);

// Or declare config as follow:
const config: ApolloConfig = {
   schema: schema,
	context: handleReq,
	formatResponse: formatResponse,
	plugins: [
		process.env.NODE_ENV !== "production" ? ApolloServerPluginLandingPageGraphQLPlayground() : ApolloServerPluginLandingPageDisabled(),
		{
			async requestDidStart(requestContextDidStart) {
				return {
					async executionDidStart(executionRequestContext) {
						return {
							willResolveField(fieldResolverParams: ResolverParams) {
								return (error: any, result: any) => {
									if (configOptions.handleResolver) {
										configOptions.handleResolver(fieldResolverParams);
									}
								};
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
const apolloServer = startApolloServer(config, app, httpServer); // Default values: host = "0.0.0.0", port = 5000, path = "/graphql". Default added middleware graphqlUploadExpress with scalar Upload in schema
```
