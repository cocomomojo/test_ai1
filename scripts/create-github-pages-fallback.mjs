import { copyFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirectoryPath = path.dirname(currentFilePath);
const distDirectoryPath = path.resolve(currentDirectoryPath, "..", "dist");
const indexHtmlPath = path.join(distDirectoryPath, "index.html");
const fallbackHtmlPath = path.join(distDirectoryPath, "404.html");

await copyFile(indexHtmlPath, fallbackHtmlPath);