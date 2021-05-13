import { Express } from "express";
import { Server } from "http";
import { address } from "ip";
import { ApolloServer, ExpressContext, IResolvers } from "apollo-server-express";
import { DocumentNode } from "graphql";
import { ContextFunction } from "apollo-server-core";
import dotenv from "dotenv";

dotenv.config();

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
 * @returns Promise<ApolloServer>
 */
export async function startApolloServer(
    app: Express,
    httpServer: Server,
    host: string,
    port: number,
    typeDefs?: string | DocumentNode | DocumentNode[] | string[],
    resolvers?: IResolvers<any, any> | IResolvers<any, any>[],
    context?: object | ContextFunction<ExpressContext, object>,
    path = "/graphql",
): Promise<ApolloServer> {
    // Init apollo server instance
    const apolloServer = new ApolloServer({
        typeDefs: typeDefs,
        resolvers: resolvers,
        context: context,
        tracing: process.env.NODE_ENV === "development",
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
