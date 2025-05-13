import path from "path";
import * as fs from "fs";
import { CompiledStateGraph } from "@langchain/langgraph";

// Disable ESLint warnings about 'any' for this specific use case
/* eslint-disable @typescript-eslint/no-explicit-any */
export default class MermaidGraph {
  static async drawMermaidByConsole(
    graph: CompiledStateGraph<any, any, any, any, any, any>,
  ) {
    console.log("Mermaid:");
    console.log((await graph.getGraphAsync()).drawMermaid());
    console.log();
  }

  static async drawMermaidAsImage(
    graph: CompiledStateGraph<any, any, any, any, any, any>,
  ) {
    console.log("JPEG:");
    const jpegBlob = await (await graph.getGraphAsync()).drawMermaidPng();
    console.log(jpegBlob);
    console.log();

    // Convert Blob to Buffer
    const arrayBuffer = await jpegBlob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Define the output path using import.meta.url instead of __dirname for ES modules
    const moduleURL = new URL(import.meta.url);
    const moduleDirPath = path.dirname(new URL(moduleURL).pathname);
    const outputPath = path.join(moduleDirPath, "output", `${graph.name}.jpeg`);

    // Ensure the output directory exists
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });

    // Write the buffer to a file
    fs.writeFile(outputPath, buffer, (err) => {
      if (err) {
        console.error("Error writing file:", err);
      } else {
        console.log("File saved successfully:", outputPath);
      }
    });
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */
