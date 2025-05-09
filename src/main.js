import './style.css'
import * as Y from "yjs"
import Quill from "quill"
import QuillCursors from "quill-cursors"
import { QuillBinding } from "y-quill"
Quill.register("modules/cursors", QuillCursors)

let username = prompt("Enter your username!")
while (username == null || username == " " || username == "") {
 username = prompt("Enter your username!")
}
let fileId = prompt("Enter the name of the file you'd like to edit/create!")
while (fileId == null || fileId == "" || fileId == " ") {
  fileId = prompt("Invalid fileId, please enter a valid fileId")
}
document.getElementById("fileName").innerHTML = `${fileId}.rtf`
const ydoc = new Y.Doc();
const ytext = ydoc.getText("quill")
const ws = new WebSocket(`ws://localhost:3000/ws?username=${username}&fileId=${fileId}`)
ws.binaryType = "arraybuffer"

ws.onmessage = (event) => {
      const update = new Uint8Array(event.data)
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




