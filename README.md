# ChainVault

Decentralized document storage — files are pinned to IPFS and their content
hash (CID) is registered on a Solidity smart contract deployed to Sepolia.
Anyone can verify a document's authenticity by CID, without an account.

**Live:** https://chainvault-minor-project.vercel.app
**Repo:** https://github.com/vinay27112/chainvault_minor-project

---

## How it works

1. A logged-in user uploads a file with a title/description.
2. The backend pins the file to IPFS via Pinata and gets back a CID.
3. The backend (using its own signer wallet, not the user's) calls
   `DocumentRegistry.registerDocument()` on Sepolia, permanently recording
   the CID on-chain against that user's address.
4. Anyone — logged in or not — can visit the Verify page, paste a CID, and
   the backend calls `verifyCID()` on the contract to confirm the document
   is genuinely registered, who owns it, and when.

Auth itself is plain email/password + JWT (not wallet-based) — the wallet
is only used server-side to pay gas for the on-chain registration.

## Architecture

```
frontend/   React + Redux + Tailwind — Login, Register, Dashboard,
            Upload, Verify pages
backend/    Node.js + Express REST API
contracts/  Solidity (Hardhat) — DocumentRegistry.sol
```

### Backend routes

**Auth** (`/api/auth`)
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/register` | – | Create account |
| POST | `/login` | – | Log in, sets JWT cookie |
| POST | `/logout` | – | Clear session |
| POST | `/verify-account` | cookie | Email verification |
| POST | `/is-auth` | cookie | Check session validity |
| POST | `/reset-password` | – | Password reset |

**Documents** (`/api/doc`)
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/` | cookie | List your documents |
| POST | `/upload` | cookie | Upload file → IPFS pin → on-chain register |
| DELETE | `/:id` | cookie | Delete a document |
| GET | `/verify/:cid` | – (public) | Verify authenticity by CID |

**User** (`/api/user`)
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/data` | cookie | Get current user's profile |

### Smart contract — `DocumentRegistry.sol`

| Function | Description |
|---|---|
| `registerDocument(cid, ...)` | Records a new document's CID on-chain |
| `getMyDocuments()` | Returns the caller's registered documents |
| `verifyCID(cid)` | Public — confirms a CID is registered and returns its metadata |

## Environment variables

### `backend/.env`
```
PORT=
MONGODB_URI=
JWT_SECRET=
NODE_ENV=              # set to "production" when deployed
CLIENT_URL=            # your deployed frontend URL (for CORS)
SENDER_EMAIL=
SMTP_USER=
SMTP_PASS=
PINATA_JWT=
PINATA_GATEWAY=
PRIVATE_KEY=           # backend's signer wallet — pays gas for on-chain writes
SEPOLIA_RPC_URL=
CONTRACT_ADDRESS=      # deployed DocumentRegistry address
```

### `frontend/.env`
```
VITE_API_URL=          # backend URL, e.g. http://localhost:4000 locally
```

> **Never commit real values.** Keep `.env` out of git (already covered by
> `.gitignore`); only commit an `.env.example` with empty/placeholder values.

## Running locally

```bash
# Backend
cd backend
npm install
npm run dev          # http://localhost:4000

# Frontend (separate terminal)
cd frontend
npm install
npm run dev           # http://localhost:5173
```

Make sure `backend/.env` and `frontend/.env` are filled in first (see above).
CORS on the backend must allow whatever port the frontend actually runs on.

## Smart contract deployment (Hardhat)

```bash
cd contracts
npm install
npx hardhat compile
npx hardhat run scripts/deploy.js --network sepolia
```
Copy the deployed address into `backend/.env` as `CONTRACT_ADDRESS`.

## Docker

There's no `docker-compose.yml` for this project currently — each half
(backend/frontend) runs directly via `npm run dev`/`node server.js`. Adding
Dockerfiles for both would be a reasonable next step if containerized local
dev or a non-Vercel/Render deploy target is ever needed.

## Deployment (how the live version is actually hosted)

- **Backend → Render.** Root directory `backend`, build `npm install`,
  start `node server.js`. Requires all the backend env vars above, plus
  `CLIENT_URL` set to the real Vercel URL once known.
- **Frontend → Vercel.** Root directory `frontend`. Needs a `vercel.json`
  rewriting all paths to `/index.html` (React Router requires this, since
  Vercel doesn't know about client-side routes by default):
  ```json
  { "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
  ```
- **MongoDB Atlas** — free M0 cluster. Network Access must allow
  `0.0.0.0/0` since Render doesn't offer a fixed outbound IP on the free tier.

## Known limitations

- OTP-based email flows (verify/reset) may fail on Render's free tier if
  using SMTP directly — Render blocks outbound SMTP ports (25/465/587) as
  of Sept 2025. If email stops working after a fresh deploy, switch to
  Brevo's HTTP API (or similar) instead of SMTP.
- No automated tests — contract and API behavior have been verified manually
  against Sepolia rather than via a Hardhat/Jest test suite.
