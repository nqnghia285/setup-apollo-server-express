import { ContextFunction } from "apollo-server-core";
import { ApolloServer, ApolloServerExpressConfig, ExpressContext } from "apollo-server-express";
import { BaseContext, GraphQLFieldResolverParams } from "apollo-server-plugin-base";
import { Express } from "express";
import { GraphQLSchema } from "graphql";
import { Server } from "http";
import { GraphQLResponse, GraphQLRequestContext } from "apollo-server-types";

export declare interface ResolverParams extends GraphQLFieldResolverParams<any, BaseContext, { [argName: string]: any }> {}

export declare interface ContextParams extends Object, ContextFunction<ExpressContext, object> {}

export declare interface ConfigOptions {
	schema: GraphQLSchema;
	context: ContextParams;
	handleResolver: (args: ResolverParams) => void;
	formatResponse: (response: GraphQLResponse, requestContext: GraphQLRequestContext<object>) => GraphQLResponse | null;
}

/**
 * @method createDefaultConfig
 * @param configOptions ConfigOptions
 * @returns ApolloServerExpressConfig
 */
export declare function createDefaultConfig(configOptions: ConfigOptions): ApolloServerExpressConfig;

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
export declare function startApolloServer(config: ApolloServerExpressConfig, app: Express, httpServer: Server, host: string, port: number, path: string): Promise<ApolloServer>;
