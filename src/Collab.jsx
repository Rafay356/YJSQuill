import React, { useEffect, useRef } from "react";
import Quill from "quill";
import QuillCursors from "quill-cursors";
import "quill/dist/quill.snow.css";
// import "quill-cursors/dist/quill-cursors.css";
import * as awarenessProtocol from "y-protocols/awareness";
import { QuillBinding } from "y-quill";
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";

Quill.register("modules/cursors", QuillCursors);
const ydoc = new Y.Doc();
const provider = new WebrtcProvider("room", ydoc, {
  signaling: ["ws://localhost:5173"],
  password: null,
  awareness: new awarenessProtocol.Awareness(ydoc),
  // Maximal number of WebRTC connections.
  // A random factor is recommended, because it reduces the chance that n clients form a cluster.
  maxConns: 20,
  // Whether to disable WebRTC connections to other tabs in the same browser.
  // Tabs within the same browser share document updates using BroadcastChannels.
  // WebRTC connections within the same browser are therefore only necessary if you want to share video information too.
  filterBcConns: false,
  // simple-peer options. See https://github.com/feross/simple-peer#peer--new-peeropts for available options.
  // y-webrtc uses simple-peer internally as a library to create WebRTC connections.
  peerOpts: {},
});
// const provider = new WebrtcProvider('quill-demo-room', ydoc)
const Collab = () => {
  const editorRef = useRef(null);
  const ydocref = useRef(ydoc);
  const ytext = useRef(ydocref.current.getText("quill"));

  useEffect(() => {
    if (editorRef.current) {
      const quill = new Quill(editorRef.current, {
        modules: {
          cursors: true,
          toolbar: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline"],
            ["image", "code-block"],
          ],
          history: {
            userOnly: true,
          },
        },
        placeholder: "Start collaborating...",
        theme: "snow",
      });

      new QuillBinding(ytext.current, quill, provider.awareness);
    }
  }, [provider.awareness]);

  return <div id="editor" ref={editorRef} />;
};

export default Collab;
