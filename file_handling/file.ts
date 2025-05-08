import * as Y from "yjs"
import { readFileSync, existsSync } from "fs"
export function loadDoc(fileId: string)  {
 const doc = new Y.Doc();

  if (existsSync(`./files/${fileId}.bin`)) {
    const update = new Uint8Array(readFileSync(`./files/${fileId}.bin`));
    Y.applyUpdate(doc, update);
  }
  return doc
}

export function persistence(doc: Y.Doc, fileId: string) {
  const saveToFile = () => {
    const fullUpdate = Y.encodeStateAsUpdate(doc);
    Bun.write(`./files/${fileId}.bin`, fullUpdate)
  }

  doc.on("update", saveToFile);
}

