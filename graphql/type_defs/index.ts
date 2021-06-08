import { loadFilesSync } from "@graphql-tools/load-files";
import { mergeTypeDefs } from "@graphql-tools/merge";
import path from "path";

const scalarTypes = loadFilesSync(path.join(__dirname, "./scalar_types"));

const typeDefs = mergeTypeDefs(scalarTypes);

export default typeDefs;
