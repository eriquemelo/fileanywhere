import './style.css'
import "quill/dist/quill.core.css";
import * as Y from "yjs"
import Quill from "quill"
import QuillCursors from "quill-cursors"
import { QuillBinding } from "y-quill"
Quill.register("modules/cursors", QuillCursors)

const ydoc = new Y.Doc();
const ytext = ydoc.getText("quill")
const ws = new WebSocket(`ws://localhost:3000/ws?username=nilson&fileId=test`)
ws.binaryType = "arraybuffer"

ws.onmessage = (event) => {
  const update = new Uint8Array(event.data)
  console.log("Recieved update from server: ", update)

  Y.applyUpdate(ydoc, update)
}
ydoc.on("update", (update) => {
  ws.send(update)
})
const quill = new Quill(document.querySelector("#app"), {
  modules: {
    cursors: true,
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline'],
      ['image', 'code-block']
    ],
    history: {
      userOnly: true
    }
  },
  theme: "snow"
})
new QuillBinding(ytext, quill)

