import { IndexClient } from "candb-client-typescript/dist/IndexClient";
import { idlFactory as IndexCanisterIDL } from "../declarations/index/index";
import { IndexCanister } from "../declarations/index/index.did";

const path = require("path");

interface CanisterIdMap {
  [key: string]: {
    local?: string;
    ic?: string;
  }
}

// Get main network canister ids
function getICCanisterIds(): CanisterIdMap {
  throw new Error("TODO: developer needs to replace this with the path to their main network canister_ids.json file")
}

// Get local canister ids
function getLocalCanisterIds(): CanisterIdMap {
  return require(path.resolve(
    "../",
    ".dfx",
    "local",
    "canister_ids.json"
  ));
}

export function initializeIndexClient(isLocal: boolean): IndexClient<IndexCanister> {
  const host = isLocal ? "http://127.0.0.1:8000" : "https://ic0.app";
  const canisterIds = isLocal ? getLocalCanisterIds() : getICCanisterIds();
  console.log("canisterIds", canisterIds)
  const canisterId = isLocal 
    ? getLocalCanisterIds()["index"]["local"] as string 
    // replace this with the fixed main network index canister id or dynamically through 
    // a call to getICCanisterIds (like the call to getLocalCanisterIds above)
    : "<prod_canister_id>";
  return new IndexClient<IndexCanister>({
    IDL: IndexCanisterIDL,
    canisterId, 
    agentOptions: {
      host,
      // !! Recommended - for application management, you can use your locally generated identity to manage your canisters
      // This allows you to gate canister management (upgrade/deletion) APIs on the index canister by your identity
      //
      // identity: await identityFromSeed(`${homedir}/.config/dfx/identity/<your_identity>/seed.txt`),
      //
      // P.S. - to locally generate an identity see steps 1-6 of https://forum.dfinity.org/t/using-dfinity-agent-in-node-js/6169/50
    },
  })
};