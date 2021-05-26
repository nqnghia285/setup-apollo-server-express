import dotenv from "dotenv";
import { ContextFunction, FileUploadOptions, GraphQLSchemaModule } from "apollo-server-core";
import { ApolloServer, ExpressContext, gql, IResolvers } from "apollo-server-express";
import { BaseContext, GraphQLFieldResolverParams } from "apollo-server-plugin-base";
import { Express } from "express";
import { DocumentNode, GraphQLSchema } from "graphql";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { Server } from "http";
import { address } from "ip";
import { GraphQLUpload } from "graphql-upload";
import { GraphQLModule } from "@graphql-modules/core";

dotenv.config();

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
 * @param module GraphQLSchemaModule | undefined
 * @returns Promise<ApolloServer>
 */
export async function startApolloServerWithSchema(
    app: Express,
    httpServer: Server,
    host: string,
    port: number,
    schema: GraphQLSchema,
    context?: object | ContextFunction<ExpressContext, object>,
    handleResolver?: (args: GraphQLFieldResolverParams<any, BaseContext, { [argName: string]: any }>) => void,
    path = "/graphql",
    uploads?: boolean | FileUploadOptions,
    module?: GraphQLSchemaModule,
): Promise<ApolloServer> {
    // Init apollo server instance
    const apolloServer = new ApolloServer({
        schema: schema,
        context: context,
        tracing: process.env.NODE_ENV === "development",
        uploads: uploads,
        modules: module ? [module] : module,
        plugins: [
            {
                requestDidStart(requestContext) {
                    return {
                        executionDidStart(executionRequestContext) {
                            return {
                                willResolveField({ source, args, context, info }: GraphQLFieldResolverParams<any, BaseContext, { [argName: string]: any }>) {
                                    if (handleResolver !== undefined) {
                                        handleResolver({ source, args, context, info });
                                    }
                                },
                            };
                        },
                    };
                },
            },
        ],
    });

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
 * @param module GraphQLSchemaModule | undefined
 * @returns Promise<ApolloServer>
 */
export async function startApolloServer(
    app: Express,
    httpServer: Server,
    host: string,
    port: number,
    typeDefs: string | DocumentNode | DocumentNode[] | string[],
    resolvers?: IResolvers<any, any> | IResolvers<any, any>[],
    context?: object | ContextFunction<ExpressContext, object>,
    handleResolver?: (args: GraphQLFieldResolverParams<any, BaseContext, { [argName: string]: any }>) => void,
    path = "/graphql",
    uploads?: boolean | FileUploadOptions,
    module?: GraphQLSchemaModule,
): Promise<ApolloServer> {
    // Merge schema
    const schema = makeExecutableSchema({
        typeDefs: typeDefs,
        resolvers: resolvers,
    });

    return startApolloServerWithSchema(app, httpServer, host, port, schema, context, handleResolver, path, uploads, module);
}
