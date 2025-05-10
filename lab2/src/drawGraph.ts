import * as fs from "fs/promises";

export async function saveGraphAsImage(currentGraph: {
  getGraph: () => { drawMermaidPng: () => Promise<Blob> };
  name?: string;
}) {
  const drawableGraph = currentGraph.getGraph();
  const image = await drawableGraph.drawMermaidPng();
  const arrayBuffer = await image.arrayBuffer();
  const graphName = currentGraph.name ?? "graph";
  await fs.writeFile(`diagrams/${graphName}.png`, Buffer.from(arrayBuffer));
}
