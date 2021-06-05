import { ContextFunction } from "apollo-server-core";
import { ApolloServer, ApolloServerExpressConfig, ExpressContext } from "apollo-server-express";
import { BaseContext, GraphQLFieldResolverParams } from "apollo-server-plugin-base";
import dotenv from "dotenv";
import { Express } from "express";
import { GraphQLSchema } from "graphql";
import { Server } from "http";
import { address } from "ip";

dotenv.config();

export interface ResolverParams extends GraphQLFieldResolverParams<any, BaseContext, { [argName: string]: any }> {}

export interface ContextParams extends Object, ContextFunction<ExpressContext, object> {}

/**
 * @method createDefaultConfig
 * @param schema GraphQLSchema
 * @param context ContextParams
 * @param handleResolver (args: ResolverParams) => void
 * @returns ApolloServerExpressConfig
 */
export function createDefaultConfig(schema: GraphQLSchema, context: ContextParams, handleResolver: (args: ResolverParams) => void): ApolloServerExpressConfig {
	const config: ApolloServerExpressConfig = {};

	config.schema = schema;
	config.context = context;
	config.uploads = false;
	config.tracing = process.env.NODE_ENV !== "production";
	config.plugins = [
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
	];

	return config;
}

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
export async function startApolloServer(config: ApolloServerExpressConfig, app: Express, httpServer: Server, host = "0.0.0.0", port = 5000, path = "/graphql"): Promise<ApolloServer> {
	// Init apollo server instance
	const apolloServer = new ApolloServer(config);

	// Start apollo server
	await apolloServer.start();

	// Apply middleware
	apolloServer.applyMiddleware({ app: app, path: path });

	await new Promise(() => {
		// Server is listening clients
		httpServer.listen({ host: host, port: port }, () => {
			let announcement = {
				server: httpServer.address(),
				address: address(),
				message: "GraphQL Server is running!",
			};
			console.log(announcement);
		});
	});

	return apolloServer;
}
