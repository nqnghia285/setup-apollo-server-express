import { ContextFunction } from "apollo-server-core";
import { ApolloServer, ApolloServerExpressConfig, ExpressContext, IEnumResolver, IResolverObject, IResolverOptions } from "apollo-server-express";
import { BaseContext, GraphQLFieldResolverParams } from "apollo-server-plugin-base";
import { GraphQLRequestContext, GraphQLResponse } from "apollo-server-types";
import dotenv from "dotenv";
import { Express } from "express";
import { DocumentNode, GraphQLScalarType } from "graphql";
import { graphqlUploadExpress, UploadOptions } from "graphql-upload";
import { Server } from "http";
import { address } from "ip";
import resolvers from "./graphql/resolver_defs";
import typeDefs from "./graphql/type_defs";

dotenv.config();

export interface ResolverParams extends GraphQLFieldResolverParams<any, BaseContext, { [argName: string]: any }> {}

export interface ContextParams extends Object, ContextFunction<ExpressContext, object> {}

export interface IResolvers<TSource = any, TContext = any> {
	[key: string]: (() => any) | IResolverObject<TSource, TContext> | IResolverOptions<TSource, TContext> | GraphQLScalarType | IEnumResolver;
}

export interface ApolloConfig extends ApolloServerExpressConfig {
	typeDefs?: DocumentNode | DocumentNode[];
}

export interface ConfigOptions {
	typeDefs: DocumentNode;
	resolvers: any;
	context: ContextParams;
	handleResolver: (args: ResolverParams) => void;
	formatResponse: (response: GraphQLResponse, requestContext: GraphQLRequestContext<object>) => GraphQLResponse | null;
}

/**
 * @method createDefaultConfig
 * @param configOptions ConfigOptions
 * @returns ApolloConfig
 */
export function createDefaultConfig(configOptions: ConfigOptions): ApolloConfig {
	const config: ApolloConfig = {};

	config.typeDefs = configOptions.typeDefs;
	config.resolvers = configOptions.resolvers;
	config.context = configOptions.context;
	config.uploads = false;
	config.tracing = process.env.NODE_ENV !== "production";
	config.formatResponse = configOptions.formatResponse;
	config.plugins = [
		{
			requestDidStart(requestContext) {
				return {
					executionDidStart(executionRequestContext) {
						return {
							willResolveField(fieldResolverParams: ResolverParams) {
								configOptions.handleResolver(fieldResolverParams);
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
 * @param config ApolloConfig
 * @param app Express
 * @param httpServer Server
 * @param host string
 * @param port number
 * @param path string
 * @param uploadOptions UploadOptions | undefined
 * @returns Promise<ApolloServer>
 */
export async function startApolloServer(
	config: ApolloConfig,
	app: Express,
	httpServer: Server,
	host = "0.0.0.0",
	port = 5000,
	path = "/graphql",
	uploadOptions?: UploadOptions,
): Promise<ApolloServer> {
	// Init apollo server instance
	if (config.typeDefs && config.resolvers) {
		if (config.typeDefs instanceof Array) {
			config.typeDefs.push(typeDefs);
		} else {
			config.typeDefs = [typeDefs, config.typeDefs];
		}

		if (config.resolvers instanceof Array) {
			config.resolvers.push(resolvers);
		} else {
			config.resolvers = [resolvers, config.resolvers];
		}
	}
	const apolloServer = new ApolloServer(config);

	// Start apollo server
	await apolloServer.start();

	// Setup middleware upload file
	app.use(path, graphqlUploadExpress(uploadOptions));

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
