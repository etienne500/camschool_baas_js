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
10. [💡 Module Factures & Services Concessionnaires (ENEO, CamWater, Canal+, Airtime)](#-module-factures--services-concessionnaires)
11. [📜 Historique des Transactions & Factures (Invoices)](#-module-factures--services-concessionnaires)
12. [🛡️ Sécurité & Bonnes Pratiques](#️-sécurité--bonnes-pratiques)
13. [📄 Licence & Support](#-licence--support)

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

### 2. Requêtes Complexes & Arbres Logiques ($or, $and, $nor, $regex)

CamSchool BaaS permet d'exécuter des requêtes NoSQL hautement complexes avec imbrication arbitraire de conditions :

```typescript
// Requête complexe avec branches $or et $and imbriquées
const snapshot = await baas.database
  .collection('produits')
  .whereComplex({
    $or: [
      {
        $and: [
          { status: 'published' },
          { prix: { $gte: 1000, $lte: 10000 } },
          { stock: { $gt: 0 } },
        ]
      },
      {
        $and: [
          { is_featured: true },
          { note_moyenne: { $gte: 4.5 } }
        ]
      }
    ]
  })
  .orderBy('prix', 'asc')
  .limit(25)
  .get();

// Utilisation des helpers fluides .whereOr() et .whereAnd()
const articles = await baas.database
  .collection('articles')
  .where('is_published', '==', true)
  .whereOr([
    { categorie: 'Science' },
    { tags: { $contains: 'technologie' } },
    { vues: { $gte: 1000 } }
  ])
  .get();
```

---

### 3. 🚀 Jointures Multi-Tables & Relations Profondes (Profondeur 10+ Ultra-Rapide)

Le moteur de jointure NoSQL CamSchool BaaS résout les relations multi-tables en **O(1) requêtes SQL groupées** (Zéro problème N+1), permettant d'atteindre une **profondeur de 10 niveaux et plus** en moins de **15 millisecondes** !

#### A. Notation Shorthand par Chemins Délimités (`.expand()` / `.populate()`) :
```typescript
// Récupérer des commandes avec leurs relations imbriquées jusqu'à 10+ niveaux de profondeur :
// Commande -> Client -> Entreprise -> Ville -> Région -> Pays -> Devise -> Continent...
const commandes = await baas.database
  .collection('commandes')
  .where('statut', '==', 'livre')
  .expand('client.entreprise.ville.region.pays.devise.continent,articles.produit.fournisseur.banque')
  .limit(50)
  .get();

console.log('Nom client :', commandes[0].data.client.nom);
console.log('Entreprise :', commandes[0].data.client.entreprise.nom);
console.log('Pays :', commandes[0].data.client.entreprise.ville.region.pays.nom);
console.log('Devise :', commandes[0].data.client.entreprise.ville.region.pays.devise.code);
```

#### B. Jointures Riches avec Filtres, Tris et Sélections Spécifiques (`.join()`) :
```typescript
const posts = await baas.database
  .collection('articles')
  .where('status', '==', 'published')
  .join({
    collection: 'utilisateurs',
    localField: 'auteur_id',
    foreignField: 'document_id',
    as: 'auteur',
    single: true,
    select: ['id', 'nom', 'email', 'avatar', 'entreprise_id'],
    join: [
      {
        collection: 'entreprises',
        localField: 'entreprise_id',
        foreignField: 'document_id',
        as: 'entreprise',
        single: true,
        join: [
          {
            collection: 'pays',
            localField: 'pays_id',
            foreignField: 'document_id',
            as: 'pays'
            // ... imbrication possible jusqu'à 15+ niveaux !
          }
        ]
      }
    ]
  })
  .join({
    collection: 'commentaires',
    localField: 'document_id',
    foreignField: 'article_id',
    as: 'commentaires',
    single: false, // Relation 1-à-N (hasMany)
    where: [['is_approuve', '==', true]],
    orderBy: 'created_at:desc',
    limit: 10,
    join: [
      {
        collection: 'utilisateurs',
        localField: 'auteur_id',
        foreignField: 'document_id',
        as: 'auteur',
        select: ['nom', 'avatar']
      }
    ]
  })
  .get();
```

---

### 4. 📊 Agrégations Statistiques ($sum, $avg, $min, $max, $count, $groupBy)

Calculez des métriques statistiques en temps réel sur des millions de documents sans charger les enregistrements bruts en mémoire :

```typescript
// Calcul global
const stats = await baas.database
  .collection('ventes')
  .where('statut', '==', 'paye')
  .aggregate({
    total_chiffre_affaires: 'sum:montant',
    panier_moyen: 'avg:montant',
    vente_max: 'max:montant',
    vente_min: 'min:montant',
    nombre_ventes: 'count:id',
  });

console.log('Chiffre d\'affaires total :', stats.total_chiffre_affaires, 'XAF');
console.log('Panier moyen :', stats.panier_moyen, 'XAF');

// Agrégation groupée par catégorie / pays ($groupBy)
const statsParCategorie = await baas.database
  .collection('ventes')
  .aggregate(
    {
      ca_categorie: 'sum:montant',
      commandes_count: 'count:id'
    },
    'categorie' // Regroupement par champ
  );

console.log('Groupes calculés :', statsParCategorie.groups);
// [ { group: 'Informatique', count: 140, ca_categorie: 14500000 }, { group: 'Livres', count: 85, ca_categorie: 850000 } ]
```

---

### 5. [V2] Filtrage des champs (Select) & Sync Différentiel

L'API V2 permet de réduire la bande passante consommée (Zéro octet gaspillé) en utilisant la projection de champs et le cache ETag :

```typescript
// Récupérer uniquement les titres et les prix
const snapshotOptimized = await baas.v2.database
  .collection('livres')
  .select(['titre', 'prix'])
  .updatedAfter('2023-10-01T00:00:00Z') // Sync différentiel
  .get();
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
| `between` | Intervalle de valeurs | `.where('age', 'between', [18, 35])` |
| `array-contains` | Tableau JSON contient la valeur | `.where('passions', 'array-contains', 'Musique')` |
| `array-contains-any` | Tableau contient au moins un des éléments | `.where('tags', 'array-contains-any', ['promo', 'flash'])` |
| `starts_with` | Commence par le préfixe | `.where('titre', 'starts_with', 'NGÙL')` |
| `ends_with` | Se termine par le suffixe | `.where('email', 'ends_with', '@camschool.cm')` |
| `like` / `ilike` | Recherche de sous-chaîne | `.where('nom', 'like', 'dupont')` |
| `regex` | Expression régulière | `.where('code', 'regex', '^[A-Z]{3}-[0-9]{4}$')` |
| `is_null` | Teste si le champ est null ou non | `.where('deleted_at', 'is_null', true)` |
| `.expand()` | Jointure multi-tables récursive (profondeur 10+) | `.expand('auteur.entreprise.pays.devise')` |
| `.join()` | Configuration détaillée de jointure | `.join({ collection: 'commentaires', as: 'comments' })` |
| `.aggregate()` | Calcul statistique groupé ($sum, $avg, $min, $max) | `.aggregate({ total: 'sum:prix' }, 'categorie')` |
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
* 📱 **Orange Money** (`'ORANGE_MONEY'`, `'ORANGE_MONEY_NOKASH'`) via **NoKash** ou **PayMooney** (Push USSD `#150*50#`)
* 📱 **MTN Mobile Money** (`'MTN_MOMO'`, `'MTN_MOMO_NOKASH'`) via **NoKash** ou **PayMooney** (Push USSD `*126#`)
* 💼 **Express Union Mobile** (`'EU_MOBILE'`, `'EU_MOBILE_NOKASH'`) via **NoKash**
* 🌐 **PayPal** (`'PAYPAL'`, `'PAYPAL_PAYMOONEY'`) via **PayMooney**
* 💳 **Cartes Bancaires Visa & Mastercard** (`'CARD'`, `'CARD_PAYMOONEY'`, `'CARD_NOKASH'`) via **PayMooney** ou **NoKash**

> ⚡ **Passerelle NoKash Haute Performance :**  
> Intégrée nativement au BaaS avec push USSD direct, vérification de statut en temps réel (`REQUEST_OK`, `PENDING`, `SUCCESS`) et reversements automatisés (Payouts).

> 📊 **Calcul Dynamique des Frais par Tranches de Montant :**  
> Les administrateurs peuvent configurer pour chaque moyen de paiement des **tranches de montants** personnalisées (ex: 0 à 2 500 FCFA à 3%, 2 501 à 10 000 FCFA à 3%, 10 001 à 50 000 FCFA à 2.5%, > 50 000 FCFA à 2%). Les frais sont automatiquement appliqués et détaillés lors de l'encaissement.

### 1. Consulter les Moyens de Paiement et Grilles Tarifaires Actives

```typescript
const methods = await baas.payments.getMethods();
console.log('Moyens disponibles :', methods.data);
// Affiche la passerelle (NoKash / PayMooney), le statut, le tarif SMS (25 FCFA) et les tranches de frais
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
  allowedMethods: ['ORANGE_MONEY_NOKASH', 'MTN_MOMO_NOKASH', 'EU_MOBILE_NOKASH', 'CARD_PAYMOONEY'],
  metadata: { orderId: 'CMD_9941', userId: 'usr_8471' },
});

console.log('Lien de paiement unique généré :', session.checkout_url);
console.log('Référence transaction :', session.reference);

// Rediriger le client vers la page de paiement sécurisée :
window.location.href = session.checkout_url;
```

---

### 3. 🌐 Intégration Simple par Balise Script (Widget Universel)

Pour les sites vitrines, e-commerce, applications web simples ou pages sans framework, vous pouvez intégrer le widget de paiement officiel CamSchool BaaS en **une seule ligne de code** :

```html
<!-- 1. Inclusion du script universel -->
<script src="https://camschool.kmrshop.com/baas/app/views/Widget/js/scriptwidget.js"></script>

<!-- 2. Bouton de déclenchement et gestionnaire -->
<button id="paiement">Payer maintenant</button>

<script>
var mykey = "pk_live_votre_cle_api"; // ou "key" pour le mode test

document.addEventListener("DOMContentLoaded", function () {
  const paiementBtn = document.getElementById("paiement");
  paiementBtn.addEventListener("click", function (e) {
    // Passage du montant dynamique (ex: 5000 FCFA) :
    paiement(callbackReussite, callbackErreur, mykey, 5000);
  });
});

function callbackReussite(data) {
  console.log("Le paiement a réussi !", data);
  alert("Paiement validé avec succès ! Réf: " + data.reference);
}

function callbackErreur(data) {
  console.log("Le paiement a échoué !", data);
  alert("Échec du paiement : " + data.message);
}
</script>
```

#### 💰 Passage du Montant et de la Devise Dynamique au Widget

Le widget accepte le montant et la devise de manière ultra-flexible :

1. **Directement en 4ème argument numérique (Montant XAF par défaut)** :
   ```javascript
   paiement(callbackReussite, callbackErreur, mykey, 5000);
   ```
2. **Via un objet de configuration complet avec Devise (`currency`)** :
   ```javascript
   paiement(callbackReussite, callbackErreur, mykey, {
     amount: 50,
     currency: "USD", // "USD", "EUR", "CAD", "XAF", "XOF"
     description: "Commande Internationale #9021"
   });
   ```
3. **Via les attributs HTML `data-amount` et `data-currency` sur le bouton déclencheur** :
   ```html
   <button id="paiement" data-amount="25" data-currency="USD" data-label="Buy Subscription">
     Pay $25 USD
   </button>
   ```

---

#### 🌍 Filtrage Intelligent des Moyens de Paiement par Devise

Le widget filtre automatiquement les moyens de paiement présentés au client en fonction de la **devise choisie** ET des **passerelles activées par le développeur dans son Dashboard** :

* 🇨🇲 **Devises Locales (`XAF`, `XOF`, Franc CFA)** :
  * 📱 **Orange Money** (`ORANGE_MONEY_NOKASH` ou `ORANGE_MONEY_PAYMOONEY`)
  * 📱 **MTN Mobile Money** (`MTN_MOMO_NOKASH` ou `MTN_MOMO_PAYMOONEY`)
  * 💼 **Express Union Mobile** (`EU_MOBILE_NOKASH`)
  * 💳 **Cartes Bancaires Visa & Mastercard**
* 🌐 **Devises Internationales (`USD`, `EUR`, `CAD`, `GBP`, etc.)** :
  * 🅿️ **PayPal** (via PayMooney)
  * 💳 **Cartes Bancaires Visa & Mastercard**
  * *(Les modes Mobile Money locaux ne sont pas affichés pour les devises internationales)*
* ⚙️ **Respect strict du Dashboard Développeur** : Si le développeur active uniquement *PayPal* pour les paiements en devises étrangères, seul PayPal s'affichera pour l'USD. Si *PayPal* et *Carte* sont tous les deux activés, les deux options seront proposées.

---

#### 🔄 Flux de Paiement Intelligent : USSD Direct & Redirection PayMooney / Cartes

Le widget gère automatiquement les spécificités de chaque mode de paiement :

* 📱 **Mobile Money Direct (NoKash)** :  
  Une notification Push USSD est envoyée directement sur le téléphone de l'acheteur (`#150*50#` pour Orange Money, `*126#` pour MTN MoMo) pour composer son code PIN. Le widget affiche un compte à rebours et écoute la validation en temps réel.
* 🌐 **PayMooney, Cartes Bancaires (Visa/Mastercard) & PayPal** :  
  1. Le widget initie la transaction et récupère le lien de paiement sécurisé fourni par la passerelle.
  2. **Un nouvel onglet s'ouvre automatiquement (`_blank`)** vers la page de paiement sécurisée pour permettre à l'utilisateur de régler sa transaction.
  3. **L'onglet initial avec le widget reste grand ouvert** : il affiche l'écran de vérification avec un bouton de secours cliquable (*« 🔗 Ouvrir la page de paiement »*) si les fenêtres popups sont bloquées.
  4. Le widget effectue un **contrôle continu en arrière-plan (polling toutes les 2.5 secondes)**.
  5. Dès que le client a finalisé le règlement et que la passerelle confirme l'opération, le widget dans l'onglet initial bascule automatiquement sur l'**écran vert de succès** et exécute votre fonction `callbackReussite(data)`.

---

#### 🎨 Personnalisation Graphique du Widget (Couleurs, Logo, Label, Champs)

Vous pouvez configurer l'apparence du widget **directement depuis la Console Développeur BaaS** (avec aperçu en temps réel) ou **dynamiquement via votre code JavaScript / HTML** :

| Option | Description | Valeur par défaut | Exemple |
| :--- | :--- | :--- | :--- |
| **`amount`** / `data-amount` | Montant de la transaction | Dérivé du projet / 0 | `5000` ou `25` |
| **`currency`** / `data-currency` | Devise de paiement (`XAF`, `USD`, `EUR`, etc.) | `"XAF"` | `"USD"`, `"EUR"`, `"XAF"` |
| **`label`** / `data-label` | Sous-titre descriptif / libellé de l'action de paiement | `"Paiement sécurisé et instantané"` | `"Règlement de vos achats"` |
| **`Widget title hex color`** | Couleur hexadécimale du titre du widget (Secondary) | `"#1E1B4B"` (Dark Indigo) | `"#0F172A"` ou `"#111827"` |
| **`Widget hex color`** | Couleur hexadécimale principale des boutons et accents (Primary) | `"#FF6B00"` (Orange CamSchool) | `"#10B981"` ou `"#2563EB"` |
| **`logo`** / `data-logo` | URL du logo personnalisé de votre entreprise/application | Logo officiel SVG CamSchool BaaS | `"https://monsite.com/logo.png"` |
| **`showCustomerName`** | Afficher (`true`) ou masquer (`false`) la saisie du nom complet | `true` | `false` ou `data-show-customer-name="false"` |
| **`lang / language`** | Code langue de l'interface (`fr`, `en`, `es`, `de`, `pt`) | Auto-détection GeoIP | `"fr"` ou `"en"` |

#### Méthodes de Configuration Disponibles :

##### Option A : Directement depuis la Console Développeur BaaS
Dans votre console BaaS (Menu **Paiements & Checkout Hébergé** > Onglet **🎨 Personnalisation du Widget**) : configurez visuellement vos couleurs, votre logo, le titre et choisissez d'activer ou de masquer le champ du nom complet avec un **aperçu interactif en temps réel**.

##### Option B : Variables globales JavaScript
```html
<script>
var widgetLabel = "Valider ma commande";
var widgetTitleHexColor = "#0F172A"; // Titre
var widgetHexColor = "#10B981";      // Bouton principal
var widgetLogo = "https://monsite.com/images/mon-logo.png";
var mykey = "pk_live_votre_cle";

paiement(callbackReussite, callbackErreur, mykey, {
  amount: 25,
  currency: "USD"
});
</script>
```

##### Option C : Objet de configuration optionnel en 4ème argument
```javascript
paiement(callbackReussite, callbackErreur, mykey, {
  label: "Abonnement Annuel",
  widgetTitleHexColor: "#1E1B4B",
  widgetHexColor: "#FF6B00",
  logo: "https://monsite.com/assets/logo.png",
  showCustomerName: false, // Masquer le champ Nom Complet optionnel
  amount: 25,              // Montant dynamique
  currency: "USD",         // Devise dynamique (USD, EUR, XAF...)
  description: "Accès Premium International"
});
```

##### Option D : Attributs HTML `data-*` sur le bouton déclencheur
```html
<button id="paiement"
  data-label="Acheter le produit"
  data-widget-title-hex-color="#1E1B4B"
  data-widget-hex-color="#FF6B00"
  data-logo="https://monsite.com/logo.png"
  data-show-customer-name="false"
  data-amount="25"
  data-currency="USD">
  Buy for $25 USD
</button>
```

---

### 4. Réception du Webhook IPN (`notify_url`) dans votre Backend


Lorsque le client finalise son paiement sur la page hébergée (ou via les passerelles NoKash / PayMooney), CamSchool BaaS envoie une requête `POST` à votre `notify_url` contenant les données de transaction et un header de signature HMAC SHA256 `X-Baas-Signature`.

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

## 💡 Module Factures & Services Concessionnaires (ENEO, CamWater, Canal+, Airtime)

Permettez à vos utilisateurs de régler leurs factures concessionnaires, recharger du crédit téléphonique ou souscrire à des forfaits TV/Data directement dans vos applications, tout en générant des **factures et reçus 100% personnalisés à l'image de votre entreprise**.

### 🌟 Services Concessionnaires Disponibles :
* **Factures d'Électricité & Eau** : `ENEO` (Police / Contrat), `CAMWATER`.
* **Bouquets TV & Câble** : `CANAL_PLUS` (Formules Access, Évasion, Tout Canal+...), `STARSAT`.
* **Recharges Crédit Téléphonique (Airtime)** : `MTN_AIRTIME`, `ORANGE_AIRTIME`, `CAMTEL_AIRTIME`, `NEXTTEL_AIRTIME`, `YOOMEE_AIRTIME`.
* **Forfaits Internet & Vouchers** : `MTN_DATA`, `SNS_VOUCHER`, `TALK360`.

---

### 1. Obtenir le Catalogue des Services & Frais de Commission

```typescript
// Récupérer tous les services actifs avec leur grille tarifaire
const services = await baas.bills.getServices();
console.log('Services disponibles :', services);

// Filtrer par catégorie : 'bill' (factures), 'tv' (bouquets), 'airtime' (crédit), 'data', 'voucher'
const tvServices = await baas.bills.getServices({ category: 'tv' });
```

---

### 2. Consulter les Factures Impayées (ENEO & CamWater)

Avant le règlement, interrogez le serveur concessionnaire pour afficher le montant exact dû par l'abonné ainsi que les frais de service calculés automatiquement :

```typescript
const result = await baas.bills.checkBill({
  serviceCode: 'ENEO',
  serviceNumber: '2010023456', // Numéro de police / contrat abonné
});

console.log(`Factures trouvées : ${result.bills_count}`);
console.log(`Montant total dû (factures + commission) : ${result.total_amount} XAF`);

result.bills.forEach(bill => {
  console.log(`- Facture N° ${bill.bill_number} (${bill.bill_month} ${bill.bill_year}) : ${bill.amount} XAF (Commission : ${bill.admin_fee} XAF)`);
});
```

---

### 3. Consulter les Bouquets et Formules (Canal+, StarSat)

```typescript
const bouquets = await baas.bills.getPackages('CANAL_PLUS');

bouquets.packages.forEach(pkg => {
  console.log(`Formule ${pkg.name} : ${pkg.total_price} XAF (PayItemId: ${pkg.pay_item_id})`);
});
```

---

### 4. Payer une Facture ou Souscrire à un Bouquet

```typescript
const payment = await baas.bills.payBill({
  serviceCode: 'ENEO',
  serviceNumber: '2010023456',
  amount: 15000,
  billNumber: 'FAC_ENEO_2026_09',
  customerName: 'Paul Tchinda',
  customerPhone: '699112233',
  customerEmail: 'paul.tchinda@gmail.com',
  paymentMethod: 'WALLET', // Ou 'MOMO', 'OM'
});

console.log('✅ Facture réglée avec succès !');
console.log('PTN de confirmation :', payment.ptn);
console.log('Lien de visualisation du reçu :', payment.render_url);
```

---

### 5. Recharger du Crédit Téléphonique (Airtime)

```typescript
const topup = await baas.bills.payAirtime({
  serviceCode: 'MTN_AIRTIME', // Ou 'ORANGE_AIRTIME', 'CAMTEL_AIRTIME', etc.
  phoneNumber: '677889900',
  amount: 1000, // Montant de la recharge en XAF
  customerName: 'Franck Kamga',
});

console.log(`✅ Recharge de ${topup.amount} XAF envoyée vers le ${topup.invoice.customer.phone}`);
console.log('Reçu disponible sur :', topup.render_url);
```

---

### 6. Personnaliser vos Factures et Reçus de Paiement

Vous pouvez configurer la marque blanche de vos reçus directement depuis votre code ou via l'API BaaS. Tous les reçus imprimés ou affichés par vos clients contiendront automatiquement votre identité visuelle :

```typescript
// Mettre à jour l'identité visuelle de vos reçus
await baas.bills.updateReceiptTemplate({
  companyName: 'Ma Super FinTech Cameroun',
  logoUrl: 'https://monapp.cm/assets/logo.png',
  primaryColor: '#6366f1', // Teinte personnalisée du reçu
  address: 'Boulevard de la Liberté, Akwa, Douala',
  phone: '+237 690 00 00 00',
  email: 'contact@masuperfintech.cm',
  taxId: 'M092100012345Z', // NUI / Registre de commerce
  footerNote: 'Merci d\'avoir utilisé notre guichet digital ! Service client 24/7.',
  showQrCode: true,
  customFields: {
    'Guichetier': 'Jean Dupont',
    'Agence': 'Douala Akwa Centre'
  }
});

// Récupérer le reçu officiel d'une transaction
const receipt = await baas.bills.getReceipt('BILL_O85QALTULG_1790160727');
console.log('Détails du reçu :', receipt);
```

> 💡 **Affichage Direct Client** : L'URL `render_url` fournie dans la réponse renvoie une page web HTML moderne, responsive et prête à l'impression (`window.print()`), compatible avec les imprimantes thermiques POS (80mm) et le format PDF A4.

---

### 7. Gestion des Commissions Administrateur

Les frais de transaction perçus sur les factures et recharges sont configurables en direct par l'administrateur de la plateforme via le panneau d'administration BaaS (`/baas/admin`) :
* **Frais fixes** (ex: `250 XAF` par facture ENEO, `200 XAF` par facture CamWater, `500 XAF` par bouquet Canal+).
* **Frais au pourcentage** (ex: `2%` sur le crédit MTN / Orange Airtime).
* L'API calcule automatiquement le montant exact prélevé et le détaille dans l'objet `invoice_data`.

---

### 8. Consulter l'Historique de vos Transactions & Factures / View Transaction History & Invoices

Après chaque paiement de facture ou recharge, vos utilisateurs peuvent retrouver l'intégralité de leur historique et obtenir les détails de chaque transaction directement depuis votre application.

> **FR** : Cette API est disponible avec la clé applicative (`X-Baas-App-Key`). Les résultats sont filtrés automatiquement par projet.  
> **EN** : This API is available with your app key (`X-Baas-App-Key`). Results are automatically scoped to your project.

```typescript
// FR: Lister toutes les transactions de factures (paginé)
// EN: List all bill transactions (paginated)
const invoices = await baas.bills.listInvoices({
  page: 1,
  perPage: 20,
  serviceCode: 'ENEO',         // Optionnel / Optional — filtre par service
  status: 'completed',         // 'pending' | 'completed' | 'failed'
});

console.log(`Total transactions : ${invoices.total}`);
invoices.data.forEach(tx => {
  console.log(`[${tx.reference}] ${tx.service_code} — ${tx.total_amount} XAF — ${tx.status}`);
  console.log('  Reçu :', tx.render_url);
});

// FR: Récupérer les détails complets d'une facture spécifique
// EN: Get full details of a specific invoice by reference
const invoice = await baas.bills.getInvoice('BILL_O85QALTULG_1790160727');

console.log('Service :', invoice.service_code);
console.log('Client :', invoice.invoice_data.customer.name);
console.log('Montant facture :', invoice.invoice_data.bill_amount, 'XAF');
console.log('Commission :', invoice.invoice_data.admin_fee, 'XAF');
console.log('Montant total :', invoice.invoice_data.total_amount, 'XAF');
console.log('Reçu HTML :', invoice.render_url);
```

> 💡 **Auto-service Développeur** : Depuis la console BaaS (`/baas/console/bills`), vous pouvez également initier des paiements de factures pour votre propre compte et retrouver tout votre historique de transactions en temps réel.
> 
> 💡 **Developer Self-Service** : From the BaaS Console (`/baas/console/bills`), you can also pay utility bills directly for your own account and access your full transaction history in real time.

---

## 🛡️ Sécurité & Bonnes Pratiques

* 🔑 **Clé Publique (`pk_live_...`)** : À intégrer dans vos clients web/mobiles. Les autorisations sont régies par les règles de sécurité NoSQL de votre projet.
* 🔒 **Clé Secrète (`sk_live_...`)** : **Uniquement pour les environnements serveurs / backends**. Ne jamais exposer dans un code JavaScript client !

---

## 📄 Licence & Support

* **Licence** : [MIT](LICENSE)
* **Dépôt GitHub** : [https://github.com/etienne500/camschool_baas_js](https://github.com/etienne500/camschool_baas_js)
* **Console BaaS** : [https://camschool.kmrshop.com/baas](https://camschool.kmrshop.com/baas)