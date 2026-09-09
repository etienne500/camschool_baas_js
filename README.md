# 🚀 CamSchool BaaS — SDK JavaScript / TypeScript Officiel

[![GitHub](https://img.shields.io/badge/GitHub-etienne500%2Fcamschool__baas__js-blue?logo=github)](https://github.com/etienne500/camschool_baas_js)
[![npm](https://img.shields.io/badge/npm-v1.0.0-CB3837?logo=npm)](https://www.npmjs.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **Client JS/TS universel pour CamSchool BaaS (Browser, Node.js, React, Vue, Next.js).**  
> Moteur complet NoSQL, Auth Téléphone OTP, Cloud Storage, Push Notifications et **Paiements & Retraits Mobile Money (MTN, Orange, Cartes)**.

---

## 📦 Installation

```bash
npm install camschool-baas
# ou via CDN HTML
<script src="https://unpkg.com/camschool-baas/dist/baas.min.js"></script>
```

---

## ⚙️ Initialisation

```javascript
import { BaaS, BaasPay } from 'camschool-baas';

const baas = BaaS.initialize({
  baseUrl: 'https://camschool.kmrshop.com', // URL BaaS Cloud Officiel
  projectId: 'proj_zf3qirtdv4xc', // Votre Project ID
  apiKey: 'pk_live_Gjh1W9LY8DpJJJyfUuW4iGqHewiJhRDvrb9gyCZI', // Clé Publique
});

// Initialiser le widget Web UI
BaasPay.initialize(baas);
```

---

## 💳 1. PAIEMENTS & RETRAITS (MOBILE MONEY & CARTES)

### A. Modal de Paiement Web Drop-in (Vanilla JS / React / HTML)
```javascript
BaasPay.openPaymentModal({
  amount: 5000,
  currency: 'XAF',
  description: 'Commande Panier KmrShop #4829',
  customerName: 'Jean Dupont',
  onSuccess: (transaction) => {
    console.log('✅ Paiement validé :', transaction.reference);
    alert('Paiement réussi ! Réf: ' + transaction.reference);
  },
  onError: (error) => {
    console.error('❌ Erreur :', error);
  },
});
```

### B. Initier un Paiement par API (PayIn - 7% Frais)
```javascript
const payin = await baas.payments.initiatePayin({
  amount: 10000,
  paymentMethod: 'MTN_MOMO', // ou 'ORANGE_MONEY', 'CARD'
  phone: '670000000',
  description: 'Achat Article',
});

console.log('Réf:', payin.reference);
console.log('Frais 7%:', payin.fee_amount, 'XAF');
console.log('Net reçu:', payin.net_amount, 'XAF');

// Attendre confirmation automatique
const confirmedTx = await baas.payments.pollTransaction(payin.reference, {
  onUpdate: (tx) => console.log('Statut actuel :', tx.status),
});
console.log('Transaction finale confirmée :', confirmedTx);
```

### C. Initier un Retrait (PayOut - 0% Frais)
```javascript
const payout = await baas.payments.initiatePayout({
  amount: 15000,
  paymentMethod: 'ORANGE_MONEY',
  phone: '690000000',
  beneficiaryName: 'Paul Kamdem',
  description: 'Retrait de solde vendeur',
});

console.log('Retrait en cours de traitement :', payout.reference);
```

---

## 🗄️ 2. BASE DE DONNÉES NoSQL

```javascript
// Ajouter un document
const doc = await baas.collection('products').add({
  name: 'Chaussures Sport',
  price: 15000,
  in_stock: true,
});

// Requête filtrée
const products = await baas.collection('products')
  .whereEqualTo('in_stock', true)
  .orderBy('price', 'desc')
  .limit(20)
  .get();
```

---

## 📄 Licence
Licence MIT - voir le fichier [LICENSE](./LICENSE).
