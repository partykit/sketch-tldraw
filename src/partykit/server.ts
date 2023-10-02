/*
 * Can be used with
 * https://github.com/tldraw/tldraw-yjs-example/tree/main/src
 * and the hostName
 * ws://127.0.0.1:1999/party
 */

import type * as Party from "partykit/server";
import { onConnect } from "y-partykit";
import { YPartyKitStorage } from "y-partykit/storage";
import type { Doc as YDoc } from "yjs";

import { type TLInstancePresence } from "@tldraw/tldraw";

export default class TldrawServer implements Party.Server {
  constructor(public party: Party.Party) {}

  onConnect(ws: Party.Connection) {
    console.log("[main] onConnect: someone connected");
    return onConnect(ws, this.party, {
      persist: true,
      callback: {
        handler: (ydoc) => {
          try {
            this.handleYDocChange(ydoc);
          } catch (e) {
            console.error("Error in ydoc update handler", e);
          }
        },
      },
    });
  }

  async handleYDocChange(ydoc: YDoc) {
    // called on every ydoc change
    // no-op
  }

  async onRequest(req: Party.Request) {
    const roomStorage = new YPartyKitStorage(this.party.storage);
    const ydoc = await roomStorage.getYDoc(this.party.id);
    const awareness = (ydoc as any).awareness;
    const states =
      (awareness?.getStates() as Map<
        number,
        { presence: TLInstancePresence }
      >) || {};

    if (req.method === "GET") {
      if (!ydoc) {
        return new Response("No ydoc yet", { status: 404 });
      }
      const map = ydoc.getMap(`tl_${this.party.id}`);
      return new Response(
        JSON.stringify(
          {
            ydoc: map,
            awareness: states,
          },
          null,
          2
        )
      );
    }

    return new Response("Unsupported method", { status: 400 });
  }
}
