# 🌐 CamSchool BaaS — SDK JavaScript & TypeScript Universel

[![GitHub](https://img.shields.io/badge/GitHub-etienne500%2Fcamschool__baas__js-yellow?logo=github)](https://github.com/etienne500/camschool_baas_js)
[![npm version](https://img.shields.io/badge/npm-1.0.0-cb3837?logo=npm)](https://www.npmjs.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **Client officiel JavaScript / TypeScript universel pour CamSchool BaaS (Backend-as-a-Service).**  
> Fonctionne sur Navigateurs Web, Node.js (16+), React, Next.js, Vue 3, Nuxt, React Native et Electron.

---

## 🌟 Fonctionnalités

* 🔥 **Base NoSQL Firestore-like** : Collections et documents JSON dynamiques, requêtes (`where`), tri (`orderBy`), pagination (`limit`, `page`), transactions et écritures par lots (*Batch writes*).
* 📱 **Authentification Complète** :
  * Inscription / Connexion par Email & Mot de passe.
  * Connexion par **Numéro de Téléphone & OTP SMS** (MTN, Orange, etc.).
  * Mode Invité / Connexion Anonyme.
  * Auto-restauration de la session JWT dans le `localStorage` navigateur.
  * Écouteur réactif des changements d'état (`onAuthStateChange`).
* 💾 **Cloud Storage** : Upload direct de fichiers (`File`, `Blob`, `Buffer`), URLs publiques et URLs signées temporaires.
* 🔔 **Notifications Push** : Enregistrement de device tokens (Web / Android / iOS) et envoi ciblé par Topics.
* 🛡️ **Typage TypeScript Exhaustif** : IntelliSense complet avec types génériques `collection<T>()`.

---

## 📦 Installation Directe depuis GitHub

### Via NPM :
```bash
npm install github:etienne500/camschool_baas_js
```

### Via Yarn :
```bash
yarn add https://github.com/etienne500/camschool_baas_js.git
```

### Via CDN (Sans outil de build / HTML pur) :
```html
<script type="module">
  import { createClient } from 'https://cdn.jsdelivr.net/gh/etienne500/camschool_baas_js/src/index.js';
  // ...
</script>
```

---

## ⚙️ Initialisation

```typescript
import { createClient } from 'camschool_baas_js'; // ou @camschool/baas-js

export const baas = createClient({
  baseUrl: 'https://votre-api-camschool.cm',
  projectId: 'votre_project_id',
  apiKey: 'baas_pub_xxxxxxxxxxxxxxxxxxxx',
  autoRestoreSession: true, // Restauration automatique du token au rafraîchissement
});
```

---

## 📖 Exemples de Code

### 1. 🔐 Authentification (Email & Téléphone OTP)
```typescript
// Connexion Email
const { user, token } = await baas.auth.signInWithEmail('professeur@camschool.cm', 'SecretPassword!');

// Authentification Téléphone OTP
const { otp_token } = await baas.auth.sendPhoneOtp('+237695512390');
const auth = await baas.auth.verifyPhoneOtp('+237695512390', '482910', otp_token);

// Écouteur réactif de session
baas.auth.onAuthStateChange((user) => {
  console.log('Utilisateur actif :', user?.displayName);
});
```

### 2. 🗄️ Base NoSQL (CRUD, Requêtes & Batch)
```typescript
// Ajouter un document
const docRef = await baas.collection('courses').add({
  title: 'Sciences Physiques',
  teacher: 'Mme Fouda',
  coefficient: 4,
  published: true,
});

// Requête filtrée
const courses = await baas
  .collection('courses')
  .where('coefficient', '>=', 4)
  .orderBy('coefficient', 'desc')
  .limit(10)
  .get();

// Batch write atomique
const batch = baas.database.batch();
batch.set(baas.collection('stats').doc('today'), { visits: 1200 });
batch.update(baas.collection('courses').doc('phys-101'), { published: true });
await batch.commit();
```

### 3. 📁 Cloud Storage (Upload HTML input)
```typescript
const file = document.querySelector('input[type=file]').files[0];

const fileInfo = await baas.storage.upload(`devoirs/${file.name}`, file, {
  isPublic: true,
});

console.log('Fichier disponible sur :', fileInfo.url);
```

---

## 📚 Documentation Complète

Pour consulter le guide exhaustif étape par étape avec architecture, gestion des erreurs, exemples React / Next.js / Vue 3 et Node.js, veuillez lire le fichier **[doc.md](./doc.md)**.

---

## 📄 Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](./LICENSE) pour plus de détails.
