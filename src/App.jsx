import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import * as awarenessProtocol from "y-protocols/awareness";
const ydoc = new Y.Doc();
const provider = new WebrtcProvider("collab", ydoc, {
  signaling: ["ws://localhost:4444"],
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

const yarray = ydoc.get("array", Y.Array);

yarray.observe(() => {
  console.log("yarray was modified");
});
provider.on("synced", () => {
  console.log("synced!");
});

yarray.observeDeep(() => {
  console.log("yarray updated: ", yarray.toJSON());
});

yarray.insert(0, ["ddd", "rafay", "updated"]);

// @ts-ignore
window.example = { provider, ydoc, yarray };

function App() {
  return (
    <>
      <h1>Colab</h1>
    </>
  );
}

export default App;
