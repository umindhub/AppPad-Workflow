// One-time: creates the Ed25519 key pair that signs index.json.
//
//   node scripts/keygen.mjs
//
// market-signing-key.pem → GitHub secret MARKET_SIGNING_KEY (then delete the file or keep it offline).
// The printed public key → WorkflowMarket.publicKey in AppPad.

import { generateKeyPairSync } from "node:crypto"
import { existsSync, writeFileSync } from "node:fs"

const FILE = "market-signing-key.pem"
if (existsSync(FILE)) {
    console.error(`${FILE} already exists; move it away first.`)
    process.exit(1)
}

const { privateKey, publicKey } = generateKeyPairSync("ed25519")
writeFileSync(FILE, privateKey.export({ type: "pkcs8", format: "pem" }), { mode: 0o600 })

// SPKI DER for Ed25519 = 12-byte header + 32-byte raw key (CryptoKit rawRepresentation).
const raw = publicKey.export({ type: "spki", format: "der" }).subarray(-32)
console.log(`Private key written to ${FILE} (never commit it).`)
console.log(`Public key (base64, for AppPad):\n${raw.toString("base64")}`)
