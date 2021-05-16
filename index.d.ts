import { Express } from "express";
import { Server } from "http";
import { ApolloServer, ExpressContext, IResolvers } from "apollo-server-express";
import { BaseContext, GraphQLFieldResolverParams } from "apollo-server-plugin-base";
import { DocumentNode, GraphQLSchema } from "graphql";
import { ContextFunction } from "apollo-server-core";

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
 * @returns Promise<ApolloServer>
 */
export declare function startApolloServerWithSchema(
    app: Express,
    httpServer: Server,
    host: string,
    port: number,
    schema: GraphQLSchema,
    context?: object | ContextFunction<ExpressContext, object>,
    handleResolver?: (args: GraphQLFieldResolverParams<any, BaseContext, { [argName: string]: any }>) => void,
    path?: string,
): Promise<ApolloServer>;

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
 * @returns Promise<ApolloServer>
 */
export declare function startApolloServer(
    app: Express,
    httpServer: Server,
    host: string,
    port: number,
    typeDefs?: string | DocumentNode | DocumentNode[] | string[],
    resolvers?: IResolvers<any, any> | IResolvers<any, any>[],
    context?: object | ContextFunction<ExpressContext, object>,
    handleResolver?: (args: GraphQLFieldResolverParams<any, BaseContext, { [argName: string]: any }>) => void,
    path?: string,
): Promise<ApolloServer>;
