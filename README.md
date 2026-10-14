# Jafes Healthcare

A responsive pharmacy storefront demo built with React and Vite. It includes an OTC wellness catalog, category filters and search, a working local shopping bag, a pharmacist chat UI, and a prescription refill request form.

## Run locally

Install dependencies, then start the Vite development server:

```sh
npm install
npm run dev
```

Create a production build with `npm run build`, or preview it locally with `npm run preview`.

## Demo limitations and production requirements

This frontend is a visual and interaction demo only. Cart checkout does not process payment or submit real orders. Chat messages and prescription requests are not transmitted or monitored; never enter real personal or health information. The prescription form's file input only selects a local file and does not upload it.

The staff inventory panel can add products, restock quantities, and deduct quantities when a demo checkout completes. Inventory persists only in the current browser's local storage; the panel has no authentication and is not synchronized between staff or devices. Do not use it for actual pharmacy stock, prescription medicines, or patient information.

The product-updates form saves a demo customer name, email address, and opt-in preferences for back-in-stock alerts and offers in the current browser only. It does not create a secure login or send email. Production alerts need a secure account/subscription backend, a mail delivery provider, explicit consent records, and unsubscribe/privacy controls.

Before production, connect a secure backend, authenticated pharmacist workflow, secure communications and document storage, prescription verification/dispensing processes, payment and order fulfillment, and applicable licensing, privacy, accessibility, and pharmacy compliance. A licensed pharmacist must review medication content and all clinical decisions. This site does not provide medical advice.
