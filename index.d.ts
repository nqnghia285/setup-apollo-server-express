import { Express } from "express";
import { Server } from "http";
import { ApolloServer, ExpressContext, IResolvers } from "apollo-server-express";
import { DocumentNode, GraphQLSchema } from "graphql";
import { ContextFunction, FileUploadOptions } from "apollo-server-core";

/**
 * @method startApolloServerWithSchema Start apollo server with apply middleware express
 * @param app Express
 * @param httpServer Server
 * @param host string
 * @param port number
 * @param schema GraphQLSchema
 * @param context object | ContextFunction<ExpressContext, object> | undefined
 * @param path string
 * @param uploads boolean | FileUploadOptions | undefined
 * @returns Promise<ApolloServer>
 */
export declare function startApolloServerWithSchema(
    app: Express,
    httpServer: Server,
    host: string,
    port: number,
    schema: GraphQLSchema,
    context?: object | ContextFunction<ExpressContext, object>,
    path?: string,
    uploads?: boolean | FileUploadOptions,
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
 * @param path string
 * @param uploads boolean | FileUploadOptions | undefined
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
    path?: string,
    uploads?: boolean | FileUploadOptions,
): Promise<ApolloServer>;
