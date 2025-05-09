import {persistence, loadDoc} from "./file_handling/file.ts"
import * as Y from "yjs"
const DOCS = new Map<string, Y.Doc>()
const server = Bun.serve<{ username: string, fileId: string, doc: any}>({ 
 async fetch(req, server) {
    const url = new URL(req.url)

    if (url.pathname === "/ws") {
       const  username = url.searchParams.get("username")
       const fileId = url.searchParams.get("fileId")

       console.info("Websocket attempting upgrade")
       if (server.upgrade(req, { data: { username, fileId } } )) return;
       return new Response("Upgrade failed", { status: 500 })
    }  
    return new Response("Not found", {status: 404})
  }, 
  websocket: {
    async open(ws) {
      console.log("Connection with websocket opened")
      ws.subscribe(ws.data.fileId);
      let doc = DOCS.get(ws.data.fileId);
      if (!doc) {
        doc = loadDoc(ws.data.fileId)
        persistence(doc, ws.data.fileId)
        DOCS.set(ws.data.fileId, doc)
      }
      ws.data.doc = doc;
      const initialDoc = Y.encodeStateAsUpdate(doc)
      ws.send(initialDoc)
    },
     message(ws, message) {
      const update = new Uint8Array(message);
      const doc = ws.data.doc;
      Y.applyUpdate(doc, update);
      server.publish(ws.data.fileId, message)
    },
    close(ws) {
    }
  }
})


console.log(`Listening on ${server.hostname}:${server.port}`);


