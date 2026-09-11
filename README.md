# 🚀 CamSchool BaaS — SDK JavaScript / TypeScript Officiel

[![GitHub](https://img.shields.io/badge/GitHub-etienne500%2Fcamschool__baas__js-blue?logo=github)](https://github.com/etienne500/camschool_baas_js)
[![npm](https://img.shields.io/badge/npm-v1.2.0-CB3837?logo=npm)](https://www.npmjs.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **SDK Universel Client & Backend pour CamSchool BaaS.**  
> Alternative puissante, moderne et souveraine à Firebase / Supabase avec support natif du NoSQL Firestore-like, de l'Auth multi-canal (Email, Téléphone avec mot de passe ou SMS OTP, Anonyme), du Cloud Storage, des Push Notifications et des **Paiements Hosted Checkout multi-passerelles (`orange_money`, `mtn_momo`, `PayPal`, `card`)**. *(Les retraits de fonds s'effectuent directement depuis le tableau de bord développeur et sont traités sous un délai de 3 jours par un administrateur).*

---

## 📑 Sommaire

1. [🌟 Fonctionnalités](#-fonctionnalités)
2. [📦 Installation](#-installation)
3. [⚡ Initialisation Rapide](#-initialisation-rapide)
4. [🔐 Authentification (Email, Téléphone, OTP, Anonyme)](#-authentification)
5. [🗄️ Base de Données NoSQL (Query Builder Avancé)](#️-base-de-données-nosql)
6. [☁️ Cloud Storage (Fichiers, Médias)](#️-cloud-storage)
7. [🔔 Notifications Push](#-notifications-push)
8. [💬 Envoi de SMS & Emails (Messagerie)](#-envoi-de-sms--emails-messagerie)
9. [💳 Module Paiements Hosted Checkout & Webhooks](#-module-paiements-liens-hosted-checkout--webhooks)
10. [🛡️ Sécurité & Bonnes Pratiques](#️-sécurité--bonnes-pratiques)
11. [📄 Licence & Support](#-licence--support)

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
* 💬 **Messagerie SMS & Emails Transactionnels** :
  * Envoi de **SMS professionnels facturés à 25 FCFA / SMS** (envois uniques ou en masse / bulk).
  * Envoi d'**Emails transactionnels HTML ou texte brut** avec expéditeur personnalisé, Reply-To, CC et BCC.
  * Suivi complet et journalisation en temps réel des messages envoyés.
* 💳 **Paiements Hosted Checkout Multi-Passerelles (BaaS Pay)** :
  * Moyens de paiement supportés : **`'orange_money'`**, **`'mtn_momo'`**, **`'PayPal'`**, **`'card'`** (Visa/Mastercard).
  * Génération de liens uniques sécurisés (`checkout_url`) et notification IPN Webhook avec signature HMAC.
  * *Note : Les retraits de solde sont initiés depuis le tableau de bord développeur et traités sous un délai de 3 jours par un administrateur.*

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

## 🔔 Notifications Push (Web Push & FCM)

CamSchool BaaS intègre un système unifié de **Notifications Push** basé sur Firebase Cloud Messaging (FCM) et le standard Web Push (VAPID), permettant de notifier instantanément vos utilisateurs sur navigateurs Web (Chrome, Firefox, Edge, Safari macOS/iOS) et applications mobiles.

---

### 1. Prérequis & Configuration Firebase Web

Pour recevoir des notifications push dans une application Web :
1. Créez un projet sur la [Console Firebase](https://console.firebase.google.com).
2. Ajoutez une application **Web** (`</>`) et copiez la configuration `firebaseConfig`.
3. Rendez-vous dans **Paramètres du projet > Cloud Messaging > Certificats Web Push** et générez une **Paire de clés VAPID** (ex: `BEl...pubKey`).
4. Dans votre console CamSchool BaaS, renseignez votre clé serveur FCM / compte de service.

---

### 2. Mise en Place du Service Worker (`firebase-messaging-sw.js`)

Créez un fichier nommé **`firebase-messaging-sw.js`** à la racine publique de votre site web (accessible via `https://votresite.com/firebase-messaging-sw.js`) :

```javascript
// firebase-messaging-sw.js (Placer à la racine /public)
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSy...",
  authDomain: "mon-projet.firebaseapp.com",
  projectId: "mon-projet",
  storageBucket: "mon-projet.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef"
});

const messaging = firebase.messaging();

// Gestion des notifications reçues en arrière-plan (quand l'onglet/navigateur est fermé)
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Notification reçue en arrière-plan :', payload);
  
  const notificationTitle = payload.notification?.title || payload.data?.title || 'CamSchool BaaS';
  const notificationOptions = {
    body: payload.notification?.body || payload.data?.body || '',
    icon: payload.notification?.icon || '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    data: payload.data || {},
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
```

---

### 3. Initialisation Client & Enregistrement de l'Appareil

Dans votre application Web (React, Vue, Angular, Svelte ou Vanilla JS) :

```typescript
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { CamSchoolBaaS } from 'camschool_baas_js';

const baas = CamSchoolBaaS.init({
  projectId: 'proj_zf3qirtdv4xc',
  publicKey: 'pk_live_smULRpyZL00lxUVG97sZ9o0ruB9MxUw7UXg8GfTw',
});

// 1. Initialiser Firebase côté client
const firebaseApp = initializeApp({
  apiKey: "AIzaSy...",
  projectId: "mon-projet",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef"
});

const messaging = getMessaging(firebaseApp);

// 2. Demander la permission et enregistrer le token sur CamSchool BaaS
async function setupPushNotifications() {
  try {
    // Demander la permission à l'utilisateur
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.warn('Permission de notification refusée par l\'utilisateur.');
      return;
    }

    // Récupérer le token FCM Web Push (VAPID Key)
    const currentToken = await getToken(messaging, {
      vapidKey: 'VOTRE_CLE_PUBLIQUE_VAPID_DEPUIS_FIREBASE_CONSOLE'
    });

    if (currentToken) {
      console.log('FCM Web Token obtenu :', currentToken);

      // Enregistrer le token auprès de CamSchool BaaS
      await baas.notifications.registerDevice({
        token: currentToken,
        platform: 'web', // 'web' | 'android' | 'ios'
        topics: ['actualites', 'annonces_cours'],
      });
      console.log('Appareil enregistré avec succès sur CamSchool BaaS !');
    }
  } catch (err) {
    console.error('Erreur lors de l\'activation des notifications :', err);
  }
}

// 3. Écouter les notifications au premier plan (Foreground)
onMessage(messaging, (payload) => {
  console.log('Notification reçue au premier plan :', payload);
  // Afficher un Toast / Banner in-app personnalisé
  alert(`🔔 ${payload.notification?.title}\n${payload.notification?.body}`);
});

// Appeler la fonction au démarrage ou après connexion
setupPushNotifications();
```

---

### 4. Envoi de Notifications Push depuis le Backend / Node.js

Envoyez des notifications ciblées via la clé secrète ou depuis vos fonctions Cloud / serveurs Node.js :

```typescript
// 1. Diffusion générale (Broadcast à tous les appareils du projet)
await baas.notifications.send({
  targetType: 'all',
  title: 'Nouvelle mise à jour disponible !',
  body: 'Découvrez la nouvelle interface de votre espace étudiant.',
  data: { route: '/nouveautes', version: '2.0.0' },
});

// 2. Envoi ciblé à un utilisateur spécifique (par son ID utilisateur BaaS)
await baas.notifications.send({
  targetType: 'user',
  target: 'usr_8471', // ID de l'utilisateur connecté
  title: 'Votre devoir a été corrigé 📝',
  body: 'Consultez la note et les commentaires de votre enseignant.',
  data: { homeworkId: 'hw_992' },
});

// 3. Envoi sur un Topic thématique (Abonnés au sujet)
await baas.notifications.send({
  targetType: 'topic',
  target: 'annonces_cours',
  title: 'Cours en direct ce soir à 20h !',
  body: 'Rejoignez la masterclass Flutter sur CamSchool.',
});
```

---

## 💬 Envoi de SMS & Emails (Messagerie)

CamSchool BaaS inclut un module complet d'envoi de messages transactionnels et alertes à vos utilisateurs.

> 💰 **Tarification SMS :** Les SMS envoyés sont facturés à **25 FCFA (25 frs) par SMS**. Le montant est automatiquement débité et journalisé sur votre projet.

### 1. Envoi de SMS (Unitaire ou en Masse)

```typescript
// Envoi d'un SMS unitaire (Coût : 25 FCFA / SMS)
const smsResult = await baas.sms.send({
  to: '+237655797860',
  message: 'Bonjour ! Votre commande #CMD_9872 est validée et en cours d’expédition.',
  senderId: 'CamSchool', // Optionnel (jusqu'à 11 caractères)
});

console.log('Statut SMS :', smsResult.success);
console.log('Coût total débité :', smsResult.total_cost, smsResult.currency); // 25 XAF

// Envoi groupé / Bulk SMS (Coût : 25 FCFA x nombre de destinataires)
const bulkResult = await baas.sms.sendBulk(
  ['+237655797860', '+237697336094', '+237670000000'],
  'Offre spéciale : -30% sur tous les cours cette semaine !'
);

console.log('SMS envoyés avec succès :', bulkResult.sent_count);
console.log('Coût total :', bulkResult.total_cost, 'FCFA'); // 75 XAF (3 x 25 FCFA)
```

### 2. Envoi d'Emails (HTML & Texte Brut)

```typescript
// Envoi d'un Email transactionnel riche en HTML
const mailResult = await baas.mail.send({
  to: 'client@example.com',
  subject: 'Confirmation de votre abonnement CamSchool',
  html: `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <h2 style="color: #10b981;">Bienvenue dans la communauté !</h2>
      <p>Votre abonnement a bien été activé.</p>
      <a href="https://monsite.com/dashboard" style="background:#10b981; color:white; padding:10px 20px; text-decoration:none; border-radius:5px;">Accéder à mon espace</a>
    </div>
  `,
  fromName: 'Service Client CamSchool',
  replyTo: 'support@camschool.cm',
  cc: ['manager@example.com'],
});

console.log('Email envoyé avec succès :', mailResult.success);
```

---

## 💳 Module Paiements, Liens Hosted Checkout & Passerelles (PayMooney & NoKash)

Le module de paiement BaaS permet de générer des **liens de paiement hébergés uniques (`checkout_url`)** supportant les passerelles de premier ordre :
* 📱 **Orange Money** (`'ORANGE_MONEY'`) via **PayMooney** ou **NoKash**
* 📱 **MTN Mobile Money** (`'MTN_MOMO'`) via **PayMooney** ou **NoKash**
* 🌐 **PayPal** (`'PAYPAL'`) via **PayMooney**
* 💳 **Cartes Bancaires Visa & Mastercard** (`'CARD'`) via **PayMooney**
* 💼 **Express Union Mobile** (`'EU_MOBILE'`) via **NoKash**

> 📊 **Calcul Dynamique des Frais par Tranches de Montant :**  
> Les administrateurs peuvent configurer pour chaque moyen de paiement des **tranches de montants** personnalisées (ex: 0 à 2 500 FCFA à 3%, 2 501 à 10 000 FCFA à 3%, 10 001 à 50 000 FCFA à 2.5%, > 50 000 FCFA à 2%). Les frais sont automatiquement appliqués et détaillés lors de l'encaissement.

### 1. Consulter les Moyens de Paiement et Grilles Tarifaires Actives

```typescript
const methods = await baas.payments.getMethods();
console.log('Moyens disponibles :', methods.data);
// Affiche la passerelle (PayMooney / NoKash), le tarif SMS (25 FCFA) et les tranches de frais
```

### 2. Créer une Session de Paiement Hébergée (Lien Unique de Redirection)

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
  allowedMethods: ['ORANGE_MONEY', 'MTN_MOMO', 'CARD', 'PAYPAL'],
  metadata: { orderId: 'CMD_9941', userId: 'usr_8471' },
});

console.log('Lien de paiement unique généré :', session.checkout_url);
console.log('Référence transaction :', session.reference);

// Rediriger le client vers la page de paiement sécurisée :
window.location.href = session.checkout_url;
```

---

### 3. Réception du Webhook IPN (`notify_url`) dans votre Backend

Lorsque le client finalise son paiement sur la page hébergée (ou via les passerelles PayMooney / NoKash), CamSchool BaaS envoie une requête `POST` à votre `notify_url` contenant les données de transaction et un header de signature HMAC SHA256 `X-Baas-Signature`.

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

  const { event, reference, status, gross_amount, customer_name, metadata, fee_rate, net_amount } = req.body;

  if (event === 'payment.success') {
    console.log(`✅ Paiement validé pour la commande ${metadata.orderId} : ${gross_amount} XAF (Net reçu : ${net_amount} XAF)`);
    // Livrer le produit / activer l'abonnement
  }

  return res.json({ received: true });
});
```

---

### 4. Suivi en Direct d'une Transaction (Polling)

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