import { Pinecone } from "@pinecone-database/pinecone";
import { convertToAscii } from "./utils";
import { getEmbeddings } from "./embeddings";

export async function getMatchesFromEmbeddings(
  embeddings: number[],
  fileKey: string
) {
  try {
    console.log("Connecting to Pinecone with embeddings array of length:", embeddings.length);
    const client = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    });
    
    const indexName = process.env.PINECONE_INDEX_NAME || "pdfgenie-yt";
    console.log(`Using Pinecone index: ${indexName}`);
    
    const pineconeIndex = await client.index(indexName);
    const namespace = pineconeIndex.namespace(convertToAscii(fileKey));
    
    const queryResult = await namespace.query({
      topK: 5,
      vector: embeddings,
      includeMetadata: true,
    });
    
    console.log(`Received ${queryResult.matches?.length || 0} matches from Pinecone`);
    return queryResult.matches || [];
  } catch (error) {
    console.error("Error querying embeddings from Pinecone:", error);
    return [];
  }
}

export async function getContext(query: string, fileKey: string): Promise<string | null> {
  try {
    console.log(`Getting context for query: "${query.substring(0, 50)}..." with fileKey: ${fileKey}`);
    const queryEmbeddings = await getEmbeddings(query);

    if (!queryEmbeddings) {
      console.error("Failed to generate embeddings for the query:", query);
      return null;
    }

    const matches = await getMatchesFromEmbeddings(queryEmbeddings, fileKey);
    
    if (matches.length === 0) {
      console.warn("No matches found in vector database for this query");
      return "No relevant information found in the document.";
    }

    const qualifyingDocs = matches.filter(
      (match) => match.score && match.score > 0.3
    );
    
    console.log(`Found ${qualifyingDocs.length} qualifying matches with score > 0.5`);

    type Metadata = {
      text: string;
      pageNumber: number;
    };

    let docs = (qualifyingDocs.length > 0 ? qualifyingDocs : matches.slice(0, 5))
      .map(match => {
        if (!match.metadata) {
          console.warn("Match missing metadata:", match);
          return null;
        }
        return (match.metadata as Metadata).text;
      })
      .filter((text): text is string => typeof text === 'string' && text.length > 0);
    
    if (docs.length === 0) {
      console.warn("No valid document text found in matches");
      return "Retrieved content was invalid or empty.";
    }
    
    const context = docs.join("\n").substring(0, 4000);
    console.log(`Generated context of length ${context.length}`);
    return context;
  } catch (error) {
    console.error("Error getting context:", error);
    return null;
  }
}