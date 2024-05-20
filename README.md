# InvoiceHero

[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Generate professional invoices for free in seconds, unlock blockchain-powered security and crypto payments. Perfect for freelancers, entrepreneurs, and businesses of all sizes!

## Features

**Free Tier: PDF Downloads:**  High-quality, printable invoices. 

**Premium Tier (Blockchain-Powered):**
(No subscription or credit cards required, the user just pay to save invoice onchain, the cost its dynamic to cover the blockchain fees when you're ready to send them.)

*   **Secure Sharing:**  Share invoices via unique, private links.
*   **Privacy and Security:** Lit Protocol encrypts your data and stores it on a decentralized network.
*   **Crypto Payments:** Accept a wide range of cryptocurrencies through Squid Router.

## Why InvoiceHero?

*   **User-Friendly:**  No blockchain knowledge required to get started.
*   **Future-Proof:**  Embrace the power of web3 and crypto payments.

## Tech Stack

*   **Frontend:** React, Next.js, Viem, Wagmi
*   **Backend:** Solidity, Node.js, browserless/chromium (headless browser)
*   **Web3:** Lit Protocol, Squid Router, Fleek (decentralized hosting)

## Get Started

1.  **Visit our website:** [https://invoice-hero.vercel.app](https://invoice-hero.vercel.app) 
2.  **Create your free account, or not 🫡**
3.  **Start invoicing!**

## Development

Interested in contributing? feel free to fork the repository and submit a pull request. We're always looking for talented developers to join our team!

1.  **Fork and clone the repository:**  `https://github.com/alexx855/InvoiceHero.git`
2.  **Install dependencies:**  `pnpm install`
3.  **Run browserless with docker: (optional)**  `docker run -p 3000:3000 ghcr.io/browserless/chromium` and add `BROWSERLESS_WS_URL=ws://localhost:3000` to your `.env.local`, also, get the dev url or ip:port add it to your `.env.local`, for example: `NEXT_PUBLIC_BASE_URL=http://192.168.56.1:3001` (docker uses a different network than your host machine and it will not work with localhost by default)
4.  **Start the local anvil blockachain:**  `anvil`
5.  **Deploy to anvil:** `pnpm run deploy:anvil`
6.  **Start the development server:** `pnpm run dev`
7.  **Open your browser:**  `http://localhost:3001`

## License

MIT License
