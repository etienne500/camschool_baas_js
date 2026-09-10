# 🚀 CamSchool BaaS — SDK JavaScript / TypeScript Officiel

[![GitHub](https://img.shields.io/badge/GitHub-etienne500%2Fcamschool__baas__js-blue?logo=github)](https://github.com/etienne500/camschool_baas_js)
[![npm](https://img.shields.io/badge/npm-v1.2.0-CB3837?logo=npm)](https://www.npmjs.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **SDK Universel Client & Backend pour CamSchool BaaS.**  
> Alternative puissante, moderne et souveraine à Firebase / Supabase avec support natif du NoSQL Firestore-like, de l'Auth multi-canal (Email, Téléphone avec mot de passe ou SMS OTP, Anonyme), du Cloud Storage, des Push Notifications et des **Paiements & Retraits universels (`orange_money`, `mtn_momo`, `PayPal`, `card`)**.

---

## 📑 Sommaire

1. [🌟 Fonctionnalités](#-fonctionnalités)
2. [📦 Installation](#-installation)
3. [⚡ Initialisation Rapide](#-initialisation-rapide)
4. [🔐 Authentification (Email, Téléphone, OTP, Anonyme)](#-authentification)
5. [🗄️ Base de Données NoSQL (Query Builder Avancé)](#️-base-de-données-nosql)
6. [☁️ Cloud Storage (Fichiers, Médias)](#️-cloud-storage)
7. [🔔 Notifications Push](#-notifications-push)
8. [💳 Module Paiements & Retraits (`orange_money`, `mtn_momo`, `PayPal`, `card`)](#-module-paiements--retraits)
9. [🛡️ Sécurité & Bonnes Pratiques](#️-sécurité--bonnes-pratiques)
10. [📄 Licence & Support](#-licence--support)

---

## 🌟 Fonctionnalités

* 🗄️ **Base de Données NoSQL Document-Store (Firestore-like)** :
  * Documents JSON avec ID uniques.
  * Requêtes avec indexation rapide : `where`, `orderBy`, `limit`, `offset`, `search`.
  * Opérateurs avancés : `==`, `!=`, `>`, `>=`, `<`, `<=`, `in`, `not_in`, `array-contains`, `starts_with`.
  * Incrémentation atomique `$inc` et fusions de documents en direct.
* 🔐 **Authentification Multi-Canal Complète** :
  * Inscription & Connexion par **Email / Mot de passe** (`signUpWithEmail`, `signInWithEmail`).
  * Inscription & Connexion par **Numéro de Téléphone / Mot de passe** (`signUpWithPhone`, `signInWithPhone`).
  * Authentification par **SMS OTP** (`sendPhoneOtp`, `verifyPhoneOtp`).
  * Connexion **Anonyme / Invité** (`signInAnonymously`).
  * Gestion et rafraîchissement automatique des tokens JWT (`localStorage` / `sessionStorage`).
* ☁️ **Cloud Storage Haute Vitesse** :
  * Upload d'images, vidéos, documents PDF avec URLs CDN sécurisées.
* 🔔 **Notifications Push** :
  * Enregistrement en direct des tokens FCM / WebPush.
* 💳 **Paiements & Retraits Universels (BaaS Pay)** :
  * Moyens de paiement supportés : **`'orange_money'`**, **`'mtn_momo'`**, **`'PayPal'`**, **`'card'`** (Visa/Mastercard).
  * Encaissements (PayIn) et Retraits automatiques (PayOut).
  * Widgets UI intégrables en 1 ligne ou API programmatique complète.

---

## 📦 Installation

### NPM / Yarn / PNPM :
```bash
npm install camschool_baas_js
# ou
yarn add camschool_baas_js
```

### CDN / Navigateur HTML :
```html
<script src="https://camschool.kmrshop.com/packages/camschool_baas_js/dist/baas.umd.js"></script>
```

---

## ⚡ Initialisation Rapide

```typescript
import { CamSchoolBaaS } from 'camschool_baas_js';

const baas = CamSchoolBaaS.init({
  projectId: 'proj_zf3qirtdv4xc', // ID de votre projet BaaS
  publicKey: 'pk_live_smULRpyZL00lxUVG97sZ9o0ruB9MxUw7UXg8GfTw', // Clé Publique
  baseUrl: 'https://camschool.kmrshop.com/api/baas/v1',
});
```

---

## 🔐 Authentification

### 1. Inscription & Connexion par Numéro de Téléphone

```typescript
// Inscription par Téléphone + Mot de passe
const signupResult = await baas.auth.signUpWithPhone(
  '+237655797860',
  'MonMotDePasseSecurise123!',
  'Adonis BOPDA',
  { ville: 'Yaoundé', profession: 'Développeur' }
);
console.log('Utilisateur inscrit :', signupResult.user);

// Connexion par Téléphone + Mot de passe
const loginResult = await baas.auth.signInWithPhone(
  '+237655797860',
  'MonMotDePasseSecurise123!'
);
console.log('Utilisateur connecté :', loginResult.user);
```

### 2. Inscription & Connexion par Email

```typescript
// Inscription par Email
await baas.auth.signUpWithEmail('alex@camschool.cm', 'Pass@1234', 'Alexandre');

// Connexion par Email
await baas.auth.signInWithEmail('alex@camschool.cm', 'Pass@1234');
```

### 3. Authentification par SMS OTP

```typescript
// Étape 1 : Demander l'envoi du code OTP
const { token } = await baas.auth.sendPhoneOtp('+237697336094');

// Étape 2 : Vérifier le code reçu
await baas.auth.verifyPhoneOtp('+237697336094', '123456', token);
```

### 4. Connexion Anonyme & Écoute de session

```typescript
// Connexion Invité
await baas.auth.signInAnonymously();

// Écouter les changements d'état
const unsubscribe = baas.auth.onAuthStateChange((user) => {
  console.log('État utilisateur :', user ? user.email || user.phone_number : 'Déconnecté');
});

// Déconnexion
baas.auth.signOut();
```

---

## 🗄️ Base de Données NoSQL

### 1. Créer ou Mettre à Jour un Document

```typescript
// Créer un document avec ID automatique
const docRef = await baas.database.collection('livres').add({
  titre: 'NGÙL LEKAN Tome 1',
  auteur: 'BDSTARS 237',
  prix: 3000,
  categorie: 'Bande Dessinée',
  tags: ['bd', 'cameroun', 'culture'],
  is_published: true,
  created_at: new Date().toISOString(),
});

// Écrire avec ID explicite
await baas.database.collection('livres').doc('livre_ngul_01').set({
  titre: 'NGÙL LEKAN Tome 1',
  prix: 3000,
});

// Mise à jour partielle avec incrémentation atomique ($inc)
await baas.database.collection('livres').doc('livre_ngul_01').update({
  vues: { $inc: 1 },
  prix: 3500,
});
```

### 2. Requêtes Avancées & Filtres Puissants

```typescript
// Requête multi-critères NoSQL haute vitesse
const snapshot = await baas.database
  .collection('livres')
  .where('categorie', '==', 'Bande Dessinée')
  .where('prix', '<=', 5000)
  .where('tags', 'array-contains', 'cameroun')
  .orderBy('created_at', 'desc')
  .limit(20)
  .get();

console.log('Résultats trouvés :', snapshot.docs);
```

#### Opérateurs NoSQL Disponibles :

| Opérateur | Description | Exemple |
| :--- | :--- | :--- |
| `==` ou `=` | Égalité stricte | `.where('status', '==', 'active')` |
| `!=` ou `<>` | Différence | `.where('role', '!=', 'banned')` |
| `>`, `>=` | Comparaison numérique / date supérieure | `.where('prix', '>=', 1000)` |
| `<`, `<=` | Comparaison numérique / date inférieure | `.where('vues', '<', 500)` |
| `in` | Appartient à une liste | `.where('ville', 'in', ['Douala', 'Yaoundé'])` |
| `not_in` | N'appartient pas à la liste | `.where('tag', 'not_in', ['archive'])` |
| `array-contains` | Tableau JSON contient la valeur | `.where('passions', 'array-contains', 'Musique')` |
| `starts_with` | Commence par le préfixe | `.where('titre', 'starts_with', 'NGÙL')` |
| `.search()` | Recherche textuelle globale | `.collection('livres').search('Aventure').get()` |

---

## ☁️ Cloud Storage

```typescript
const fileInput = document.querySelector<HTMLInputElement>('#fileInput')!;
const file = fileInput.files![0];

// Téléversement d'un fichier réel
const uploadResult = await baas.storage.upload(file, {
  folder: 'covers',
  customName: 'cover_ngul_01.jpg',
});

console.log('URL Publique :', uploadResult.url);
console.log('Taille :', uploadResult.size);
```

---

## 🔔 Notifications Push

```typescript
// Enregistrer le token de notification de l'appareil
await baas.notifications.registerDevice({
  token: 'fcm_token_device_xyz...',
  platform: 'web', // 'web' | 'android' | 'ios'
});
```

---

## 💳 Module Paiements, Liens Hosted Checkout & Webhooks

Le module de paiement BaaS permet de générer des **liens de paiement hébergés uniques (`checkout_url`)** avec sélection multi-passerelles (Orange Money, MTN MoMo, Carte Bancaire, PayPal, Express Union), redirection automatique vers `success_url`/`fail_url` et notification instantanée vers `notify_url` (IPN Webhook signé).

> 💡 **Configuration Générale du Projet :**  
> Depuis la console BaaS (**Paiements & Passerelles**), vous pouvez activer/désactiver les moyens de paiement et définir des URLs par défaut (`notify_url`, `success_url`, `fail_url`). Si vous les fournissez dans la requête, elles écrasent les valeurs par défaut.

### 1. Créer une Session de Paiement Hébergée (Lien Unique de Redirection)

```typescript
// Générer un lien de paiement hébergé avec sélection des passerelles et URLs de retour
const session = await baas.payments.createCheckoutSession({
  amount: 5000,
  currency: 'XAF',
  customerName: 'Jean Dupont',
  customerEmail: 'jean.dupont@example.com',
  phone: '697336094',
  description: 'Abonnement Mensuel CamSchool',
  // URLs spécifiques (écrasent les paramètres par défaut du projet)
  notifyUrl: 'https://monsite.com/api/payment/webhook',
  successUrl: 'https://monsite.com/commande/succes',
  failUrl: 'https://monsite.com/commande/annulee',
  // Filtrer les moyens de paiement autorisés pour cette transaction (optionnel)
  allowedMethods: ['ORANGE_MONEY', 'MTN_MOMO', 'CARD'],
  metadata: { orderId: 'CMD_9941', userId: 'usr_8471' },
});

console.log('Lien de paiement unique généré :', session.checkout_url);
console.log('Référence transaction :', session.reference);

// Rediriger le client vers la page de paiement sécurisée :
window.location.href = session.checkout_url;
```

---

### 2. Réception du Webhook IPN (`notify_url`) dans votre Backend

Lorsque le client finalise son paiement sur la page hébergée, CamSchool BaaS envoie une requête `POST` à votre `notify_url` contenant les données de transaction et un header de signature HMAC SHA256 `X-Baas-Signature`.

#### Exemple de réception en Node.js / Express :
```typescript
import express from 'express';
import crypto from 'crypto';

const app = express();
app.use(express.json());

app.post('/api/payment/webhook', (req, res) => {
  const signature = req.headers['x-baas-signature'] as string;
  const appSecret = 'VOTRE_APP_SECRET_OU_CLE_SECRETE';

  // Vérifier la signature HMAC SHA256
  const expectedSignature = crypto
    .createHmac('sha256', appSecret)
    .update(JSON.stringify(req.body))
    .digest('hex');

  if (signature !== expectedSignature) {
    return res.status(401).json({ error: 'Signature invalide' });
  }

  const { event, reference, status, gross_amount, customer_name, metadata } = req.body;

  if (event === 'payment.success') {
    console.log(`✅ Paiement validé pour la commande ${metadata.orderId} : ${gross_amount} XAF`);
    // Livrer le produit / activer l'abonnement
  }

  return res.json({ received: true });
});
```

---

### 3. Initier un Paiement Direct en API (PayIn)

```typescript
// Paiement direct sans page de redirection
const payin = await baas.payments.initiatePayin({
  amount: 3000,
  paymentMethod: 'orange_money', // 'orange_money' | 'mtn_momo' | 'PayPal' | 'card'
  phone: '697336094',
  customerName: 'Kengne BOPDA',
  description: 'Achat de NGÙL LEKAN',
});
console.log('Transaction initiée :', payin.transaction_id);
```

---

### 4. Initier une Demande de Retrait (PayOut - 0% Frais)

```typescript
// Retrait vers un compte Orange Money ou MTN MoMo
const payout = await baas.payments.initiatePayout({
  amount: 25000,
  paymentMethod: 'orange_money',
  phone: '697336094',
  beneficiaryName: 'Auteur BDSTARS',
  description: 'Retrait des gains',
});
console.log('Retrait enregistré :', payout.payout_id);
```

---

### 5. Suivi en Direct d'une Transaction (Polling)

```typescript
// Écoute en temps réel jusqu'à confirmation
const validatedTx = await baas.payments.pollTransaction(session.reference, {
  intervalMs: 2500,
  onUpdate: (tx) => console.log('Statut actuel :', tx.status),
});
console.log('Paiement confirmé avec succès !', validatedTx);
```

---

## 🛡️ Sécurité & Bonnes Pratiques

* 🔑 **Clé Publique (`pk_live_...`)** : À intégrer dans vos clients web/mobiles. Les autorisations sont régies par les règles de sécurité NoSQL de votre projet.
* 🔒 **Clé Secrète (`sk_live_...`)** : **Uniquement pour les environnements serveurs / backends**. Ne jamais exposer dans un code JavaScript client !

---

## 📄 Licence & Support

* **Licence** : [MIT](LICENSE)
* **Dépôt GitHub** : [https://github.com/etienne500/camschool_baas_js](https://github.com/etienne500/camschool_baas_js)
* **Console BaaS** : [https://camschool.kmrshop.com/baas](https://camschool.kmrshop.com/baas)