import { ContextFunction } from "apollo-server-core";
import { ApolloServer, ApolloServerExpressConfig, ExpressContext } from "apollo-server-express";
import { BaseContext, GraphQLFieldResolverParams } from "apollo-server-plugin-base";
import { GraphQLRequestContext, GraphQLResponse } from "apollo-server-types";
import { Express } from "express";
import { DocumentNode, GraphQLSchema } from "graphql";
import { UploadOptions } from "graphql-upload";
import { Server } from "http";

export declare interface ResolverParams extends GraphQLFieldResolverParams<any, BaseContext, { [argName: string]: any }> {}

export declare interface ContextParams extends Object, ContextFunction<ExpressContext, object> {}

export declare interface ApolloConfig extends ApolloServerExpressConfig {
	typeDefs?: DocumentNode | DocumentNode[];
}

export declare interface ConfigOptions {
	schema?: GraphQLSchema;
	typeDefs?: DocumentNode;
	resolvers?: any;
	context?: ContextParams;
	handleResolver?: (args: ResolverParams) => void;
	formatResponse?: (response: GraphQLResponse, requestContext: GraphQLRequestContext<object>) => GraphQLResponse | null;
}

/**
 * @method createDefaultConfig
 * @param configOptions ConfigOptions
 * @returns ApolloConfig
 */
export declare function createDefaultConfig(configOptions: ConfigOptions): ApolloConfig;

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
export declare function startApolloServer(config: ApolloConfig, app: Express, httpServer: Server, host?: string, port?: number, path?: string, uploadOptions?: UploadOptions): Promise<ApolloServer>;
