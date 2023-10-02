"use client";

/*
 *
 * Makes the TLDraw Editor available to the rest of the app.
 *
 */

import { createContext, useContext, useState, useEffect } from "react";
import { Editor } from "@tldraw/tldraw";

type TldrawContextType = {
  editor: Editor | null;
  setEditor: (editor: Editor | null) => void;
  currentUserId: string | null;
};

const TldrawContext = createContext<TldrawContextType>({
  editor: null,
  setEditor: () => {},
  currentUserId: null,
});

export function useTldraw() {
  return useContext(TldrawContext);
}

export function TldrawProvider({ children }: { children: React.ReactNode }) {
  const [editor, setEditor] = useState<Editor | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    if (!editor) return;

    setCurrentUserId(editor.user.id as string);
  }, [editor]);

  return (
    <TldrawContext.Provider
      value={{
        editor: editor,
        setEditor: setEditor,
        currentUserId: currentUserId,
      }}
    >
      {children}
    </TldrawContext.Provider>
  );
}
