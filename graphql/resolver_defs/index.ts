import { mergeResolvers } from "@graphql-tools/merge";
import { loadFilesSync } from "graphql-tools";
import path from "path";

const scalarTypeArray = loadFilesSync(path.join(__dirname, "./scalar_types"));

const resolvers = mergeResolvers(scalarTypeArray);

export default resolvers;
