# 🚀 CamSchool BaaS — SDK JavaScript / TypeScript Officiel

[![GitHub](https://img.shields.io/badge/GitHub-etienne500%2Fcamschool__baas__js-blue?logo=github)](https://github.com/etienne500/camschool_baas_js)
[![npm](https://img.shields.io/badge/npm-v1.2.0-CB3837?logo=npm)](https://www.npmjs.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **SDK Universel Client & Backend pour CamSchool BaaS.**  
> Alternative puissante, moderne et souveraine à Firebase / Supabase avec support natif du NoSQL Firestore-like, de l'Auth multi-canal (Email, Téléphone OTP SMS, Anonyme), du Cloud Storage, des Push Notifications FCM, et des **Paiements & Retraits Mobile Money (MTN MoMo, Orange Money, Cartes bancaires)**.

---

## 📑 Table des Matières

1. [📦 Installation](#-installation)
2. [⚙️ Initialisation](#️-initialisation)
3. [🔐 Authentification Utilisateurs](#-authentification-utilisateurs)
4. [🗄️ Base de Données NoSQL (Firestore-like)](#️-base-de-données-nosql-firestore-like)
   - [CRUD de Base](#crud-de-base)
   - [Requêtes avec Filtres Avancés (Where, Search, OrderBy, Limit)](#requêtes-avec-filtres-avancés)
   - [Opérations Atomiques ($inc, $push, $pull, $unset)](#opérations-atomiques)
   - [Écritures Batch Transactionnelles](#écritures-batch-transactionnelles)
5. [☁️ Cloud Storage (Fichiers & Médias)](#️-cloud-storage-fichiers--médias)
6. [🔔 Push Notifications (FCM)](#-push-notifications-fcm)
7. [💳 Paiements & Retraits Mobile Money](#-paiements--retraits-mobile-money)
8. [🛡️ Gestion des Erreurs](#️-gestion-des-erreurs)

---

## 📦 Installation

### Via Gestionnaire de Paquets (Node.js, React, Vue, Next.js, Angular, Svelte)

```bash
npm install camschool-baas
# ou avec yarn / pnpm / bun
yarn add camschool-baas
pnpm add camschool-baas
bun add camschool-baas
```

### Via CDN (Vanilla HTML / JavaScript / PWA)

```html
<!-- Version UMD Universelle -->
<script src="https://camschool.kmrshop.com/api/baas/v1/sdk/camschool-baas.min.js"></script>
```

---

## ⚙️ Initialisation

```javascript
import { createClient } from 'camschool-baas';

// Initialisation du client
const baas = createClient({
  projectId: 'proj_zf3qirtdv4xc',
  apiKey: 'pk_live_smULRpyZL00lxUVG97sZ9o0ruB9MxUw7UXg8GfTw', // Clé Publique (Frontend)
  baseUrl: 'https://camschool.kmrshop.com/api/baas/v1/proj_zf3qirtdv4xc',
  // secretKey: 'sk_live_...' // Uniquement côté Backend Node.js / Serverless
});

// Références aux modules
const auth = baas.auth;
const db = baas.database;
const storage = baas.storage;
const notifications = baas.notifications;
const payments = baas.payments;
```

---

## 🔐 Authentification Utilisateurs

### 1. Inscription & Connexion par Email

```javascript
// Inscription d'un nouvel utilisateur
const newUser = await auth.signUpWithEmail(
  'auteur@exemple.com',
  'MotDePasseSecurise123!',
  'Jean Dupont',
  { role: 'author', city: 'Douala', phone: '+237699000000' }
);
console.log('Utilisateur créé avec token:', newUser.token);

// Connexion
const session = await auth.signInWithEmail('auteur@exemple.com', 'MotDePasseSecurise123!');
console.log('Connecté avec succès:', session.user);

// Profil de l'utilisateur connecté
const profile = await auth.getProfile();
console.log('Mon profil:', profile);
```

### 2. Authentification par Téléphone + OTP SMS

```javascript
// 1. Envoi du code OTP par SMS
const otpResponse = await auth.sendPhoneOtp('+237699000000');
console.log('SMS envoyé, session_token:', otpResponse.session_token);

// 2. Vérification du code reçu
const authSession = await auth.verifyPhoneOtp(
  '+237699000000',
  '123456',
  otpResponse.session_token
);
console.log('Connexion réussie:', authSession.user);
```

### 3. Connexion Anonyme

```javascript
// Idéal pour sessions invités, paniers temporaires
const guestSession = await auth.signInAnonymously('device_unique_uuid');
```

---

## 🗄️ Base de Données NoSQL (Firestore-like)

### CRUD de Base

```javascript
// 1. Ajouter un document avec ID auto-généré
const docRef = await db.collection('books').add({
  title: 'Le Soleil des Indépendances',
  author: 'Ahmadou Kourouma',
  price: 2500,
  category: 'Roman',
  status: 'published',
  views: 0
});
console.log('Document inséré ID:', docRef.id);

// 2. Définir ou écraser un document avec ID spécifique
await db.collection('books').doc('book_001').set({
  title: 'Les Bouts de bois de Dieu',
  author: 'Ousmane Sembène',
  price: 3000,
  status: 'published'
}, { merge: true });

// 3. Récupérer un document unique
const bookDoc = await db.collection('books').doc('book_001').get();
if (bookDoc.exists) {
  console.log('Données du livre:', bookDoc.data);
}

// 4. Supprimer un document
await db.collection('books').doc('book_001').delete();
```

---

### 🔍 Requêtes avec Filtres Avancés

Le moteur de requêtes CamSchool BaaS prend en charge les filtres riches chaînés, la recherche textuelle, le tri multi-champs et la pagination :

```javascript
// Requête complexe chaînée
const snapshot = await db.collection('books')
  .where('status', '==', 'published')            // Égalité
  .where('price', '<=', 5000)                    // Comparaison numérique
  .where('category_id', 'in', [1, 5, 13])        // Appartenance à une liste
  .where('tags', 'array-contains', 'afrique')    // Recherche dans tableau
  .orderBy('created_at', 'desc')                 // Tri descendant
  .limit(10)                                     // Pagination
  .page(1)
  .get();

console.log(`Total trouvé: ${snapshot.total}, Page actuelle: ${snapshot.currentPage}`);
snapshot.docs.forEach(doc => {
  console.log(`- ${doc.data.title} (${doc.data.price} XAF)`);
});

// Recherche plein texte ultra-rapide
const searchResults = await db.collection('books')
  .search('NGÙL LEKAN')
  .limit(5)
  .get();
```

#### Opérateurs de filtrage supportés :
| Opérateur | Syntaxe JS | Description |
| :--- | :--- | :--- |
| **Égalité** | `==`, `=`, `eq` | Correspondance exacte (texte, nombre, booléen, null) |
| **Différence** | `!=`, `<>`, `neq` | Différent de la valeur spécifiée |
| **Supériorité** | `>`, `gt`, `>=`, `gte` | Supérieur ou supérieur ou égal (numérique ou date) |
| **Infériorité** | `<`, `lt`, `<=`, `lte` | Inférieur ou inférieur ou égal |
| **Inclusivité** | `in` | Présent dans la liste `[val1, val2, ...]` |
| **Exclusion** | `not_in` | Absent de la liste `[val1, val2, ...]` |
| **Tableau / Texte** | `array-contains`, `contains`, `like` | Élément présent dans un tableau ou sous-chaîne |
| **Préfixe** | `starts_with` | Commence par le préfixe spécifié |

---

### ⚡ Opérations Atomiques

Modifiez des champs sans risque de concurrence :

```javascript
// Incrémentation atomique du nombre de vues et de likes
await db.collection('books').doc('book_001').update({
  $inc: {
    views_count: 1,
    likes_count: 5
  },
  $push: {
    readers: 'user_123'  // Ajoute à un tableau sans écraser
  }
});
```

---

### 📦 Écritures Batch Transactionnelles

Exécutez plusieurs opérations en une seule requête atomique :

```javascript
const batch = db.batch();

batch.set(db.collection('orders').doc('ord_101'), { total: 15000, status: 'paid' });
batch.update(db.collection('books').doc('book_001'), { $inc: { sales_count: 1 } });
batch.delete(db.collection('cart').doc('cart_user_45'));

const result = await batch.commit();
console.log('Batch exécuté avec succès:', result);
```

---

## ☁️ Cloud Storage (Fichiers & Médias)

Téléversez directement photos, vidéos, documents PDF et fichiers audio avec génération d'URLs sécurisées :

```javascript
const fileInput = document.querySelector('input[type="file"]');
const file = fileInput.files[0];

// Téléversement d'un document PDF ou d'une image
const uploadRes = await storage.upload('books/covers/cover_001.jpg', file, {
  onProgress: (percent) => console.log(`Téléversement: ${percent}%`)
});
console.log('URL publique CDN:', uploadRes.url);

// Obtenir une URL signée temporaire (ex: pour fichier PDF sécurisé)
const signedUrl = await storage.getSignedUrl('books/files/secure_book.pdf', 120); // Valide 120 minutes
console.log('Lien de lecture temporaire:', signedUrl);
```

---

## 🔔 Push Notifications (FCM)

```javascript
// 1. Enregistrer le token de l'appareil
await notifications.registerDeviceToken(
  'fcm_token_device_abc123',
  'web',
  ['nouveautes', 'auteurs', 'promotions']
);

// 2. Envoyer une notification push ciblée (ou par topic)
await notifications.send({
  topic: 'nouveautes',
  title: '📖 Nouveau Livre Disponible !',
  body: 'Découvrez la suite exclusive de NGÙL LEKAN disponible sur OCaLi.',
  data: { book_id: '6', action: 'open_book' }
});
```

---

## 💳 Paiements & Retraits Mobile Money

Module tout-en-un pour encaisser et reverser des fonds via **Orange Money**, **MTN Mobile Money** et **Cartes bancaires** :

```javascript
// 1. Encaisser un paiement (PayIn)
const payin = await payments.initiatePayin({
  amount: 2500,
  currency: 'XAF',
  phoneNumber: '699000000',
  method: 'orange_money', // 'mtn_momo' | 'orange_money' | 'card'
  description: 'Abonnement Lecteur Mensuel OCaLi'
});
console.log('Paiement initié, transaction_id:', payin.transaction_id);

// 2. Vérifier le statut de la transaction
const status = await payments.getStatus(payin.transaction_id);
console.log('Statut actuel:', status.status); // 'pending' | 'success' | 'failed'

// 3. Effectuer un retrait / virement à un auteur (PayOut)
const payout = await payments.initiatePayout({
  amount: 15000,
  phoneNumber: '677000000',
  method: 'mtn_momo',
  description: 'Retrait de royalties auteur'
});
console.log('Retrait en cours:', payout.transaction_id);
```

---

## 🛡️ Gestion des Erreurs

Toutes les erreurs lancées par le SDK héritent de la classe `BaasError` :

```javascript
import { BaasAuthError, BaasPermissionError, BaasNotFoundError } from 'camschool-baas';

try {
  await db.collection('confidential').doc('secret_1').get();
} catch (error) {
  if (error instanceof BaasPermissionError) {
    console.error('Accès refusé par les règles de sécurité:', error.message);
  } else if (error instanceof BaasNotFoundError) {
    console.error('Document inexistant.');
  } else {
    console.error('Erreur BaaS:', error.status, error.message);
  }
}
```

---

## 📄 Licence

Distribué sous licence **MIT**. Développé avec passion pour l'écosystème africain et international par **CamSchool Tech**.