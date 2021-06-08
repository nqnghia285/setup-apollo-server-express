import { makeExecutableSchema } from "@graphql-tools/schema";
import resolvers from "./resolver_defs";
import typeDefs from "./type_defs";

const rootSchema = makeExecutableSchema({
	typeDefs: typeDefs,
	resolvers: resolvers,
});

export default rootSchema;
