/*
 * Can be used with
 * https://github.com/tldraw/tldraw-yjs-example/tree/main/src
 * and the hostName
 * ws://127.0.0.1:1999/party
 */

import type * as Party from "partykit/server";
import { onConnect, unstable_getYDoc, type YPartyKitOptions } from "y-partykit";
import type { Doc } from "yjs";

export default class YjsServer implements Party.Server {
  yjsOptions: YPartyKitOptions = { persist: true };
  constructor(public party: Party.Party) {}

  getOpts() {
    // options must match when calling unstable_getYDoc and onConnect
    const opts: YPartyKitOptions = {
      persist: true,
      callback: { handler: (doc) => this.handleYDocChange(doc) },
    };
    return opts;
  }

  async onRequest() {
    const doc = await unstable_getYDoc(this.party, this.getOpts());
    const room = `tl_${this.party.id}`;
    return new Response(
      JSON.stringify({ [room]: doc.getArray(room) }, null, 2)
    );
  }
  onConnect(conn: Party.Connection) {
    return onConnect(conn, this.party, this.getOpts());
  }
  handleYDocChange(doc: Doc) {
    // console.log("ydoc changed");
    // called on every ydoc change
    // no-op
  }
}
