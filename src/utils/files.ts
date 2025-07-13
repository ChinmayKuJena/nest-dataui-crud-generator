import fs from "fs";
import path from "path";

export function ensureDirExists(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

export function writeFileSafe(filePath: string, content: string) {
  if (fs.existsSync(filePath)) {
    console.log(`❌ File already exists: ${filePath}. Skipping.`);
    return false;
  }
  fs.writeFileSync(filePath, content);
  console.log(`✅ Created: ${filePath}`);
  return true;
}