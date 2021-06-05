import { ContextFunction } from "apollo-server-core";
import { ApolloServer, ApolloServerExpressConfig, ExpressContext } from "apollo-server-express";
import { BaseContext, GraphQLFieldResolverParams } from "apollo-server-plugin-base";
import { Express } from "express";
import { GraphQLSchema } from "graphql";
import { Server } from "http";

export declare interface ResolverParams extends GraphQLFieldResolverParams<any, BaseContext, { [argName: string]: any }> {}

export declare interface ContextParams extends Object, ContextFunction<ExpressContext, object> {}

/**
 * @method createDefaultConfig
 * @param schema GraphQLSchema
 * @param context ContextParams
 * @param handleResolver (args: ResolverParams) => void
 * @returns ApolloServerExpressConfig
 */
export declare function createDefaultConfig(schema: GraphQLSchema, context: ContextParams, handleResolver: (args: ResolverParams) => void): ApolloServerExpressConfig;

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
