"use client";

import { Editor, Tldraw, useEditor } from "@tldraw/tldraw";
import "@tldraw/tldraw/tldraw.css";
import { useTldraw } from "@/app/providers/tldraw-context";
import { useYjsStore } from "@/app/hooks/useYjsStore";

export const PARTYKIT_HOST = process.env.NEXT_PUBLIC_PARTYKIT_HOST!;

export const WEBSOCKET_PROTOCOL =
  PARTYKIT_HOST?.startsWith("localhost") ||
  PARTYKIT_HOST?.startsWith("127.0.0.1")
    ? "ws"
    : "wss";

export default function Whiteboard() {
  const { setEditor } = useTldraw();

  const store = useYjsStore({
    roomId: "example-room",
    hostUrl: PARTYKIT_HOST,
  });

  const handleMount = (editor: Editor) => {
    setEditor(editor);
  };

  return (
    <div className="tldraw__editor">
      <Tldraw store={store} onMount={handleMount}></Tldraw>
    </div>
  );
}
