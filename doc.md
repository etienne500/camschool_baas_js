# 🌐 CamSchool BaaS — Guide Complet & Documentation Officielle du SDK JavaScript / TypeScript

> **Package :** `@camschool/baas-js`  
> **Version :** `1.0.0`  
> **Environnements supportés :** Navigateurs Web (Chrome, Safari, Firefox, Edge), Node.js (16+), React, Next.js, Vue 3, Svelte, Angular, React Native, Electron.

---

## 1. 📖 Présentation du BaaS CamSchool

Le SDK JavaScript / TypeScript de **CamSchool BaaS** offre une interface fluide et moderne de type Firebase / Supabase pour communiquer avec votre backend Laravel.

### 🌟 Fonctionnalités Clés :
* **Base de données NoSQL (Firestore-like)** : Gestion complète de collections et documents JSON dynamiques, filtres complexes (`where`), tri, pagination et écritures atomiques par lots (*Batch writes*).
* **Système d'Authentification Complet** :
  * 📧 Inscription & Connexion par Email / Mot de passe.
  * 📱 Authentification par Numéro de Téléphone & OTP SMS.
  * 🕶️ Mode Invité (Connexion anonyme).
  * 💾 Sauvegarde et restauration automatique du Token JWT dans `localStorage`.
  * 🔔 Écouteur réactif des changements d'état (`onAuthStateChange`).
* **Cloud Storage** : Upload direct de fichiers (`File`, `Blob`, `Buffer`), récupération d'URLs signées temporaires.
* **Notifications Push** : Enregistrement de tokens d'appareils et déclenchement d'alertes ciblées.
* **Typage TypeScript Exhaustif** : IntelliSense complet avec types génériques pour vos modèles de données.

---

## 2. 📦 Installation & Intégration

### Option A : Installation via NPM / Yarn / PNPM
```bash
npm install @camschool/baas-js
# ou
yarn add @camschool/baas-js
# ou
pnpm add @camschool/baas-js
```

### Option B : Utilisation directe via script CDN (Sans bundler / HTML pur)
```html
<script type="module">
  import { createClient } from 'https://cdn.jsdelivr.net/npm/@camschool/baas-js/+esm';
  
  const baas = createClient({
    baseUrl: 'https://api.votre-domaine.cm',
    projectId: 'votre_project_id',
    apiKey: 'baas_pub_xxxxxxxxxxxxxxxxxxxx',
  });
</script>
```

---

## 3. ⚙️ Initialisation du Client

Dans votre projet (ex: `src/lib/baas.ts` ou `baas.js`) :

```typescript
import { createClient } from '@camschool/baas-js';

export const baas = createClient({
  baseUrl: 'https://api.votre-domaine.cm', // URL racine de votre backend BaaS
  projectId: 'mon-projet-camschool',       // Identifiant de votre projet
  apiKey: 'baas_pub_9a8b7c6d5e4f3a2b1c',   // Clé API publique de votre projet
  autoRestoreSession: true,               // Restauration automatique du token au rafraîchissement
});
```

---

## 4. 🔐 Authentification des Utilisateurs

### 4.1 Inscription par Email & Mot de passe
```typescript
try {
  const result = await baas.auth.signUpWithEmail(
    'jean.dupont@camschool.cm',
    'MotDePasseSecurise123!',
    'Jean Dupont',
    { role: 'enseignant', matiere: 'Physique' }
  );

  console.log('Utilisateur inscrit :', result.user);
  console.log('Token JWT actif :', result.token);
} catch (error: any) {
  console.error('Erreur d\'inscription :', error.message);
}
```

### 4.2 Connexion par Email & Mot de passe
```typescript
try {
  const { user, token } = await baas.auth.signInWithEmail(
    'jean.dupont@camschool.cm',
    'MotDePasseSecurise123!'
  );
  console.log('Connecté avec succès :', user.displayName);
} catch (error: any) {
  console.error('Identifiants incorrects :', error.message);
}
```

### 4.3 Connexion par Numéro de Téléphone & OTP SMS (Idéal Cameroun)
```typescript
// 1. Demander l'envoi du SMS avec le code OTP
const { otp_token } = await baas.auth.sendPhoneOtp('+237695512390');

// 2. Vérifier le code saisi par l'utilisateur
try {
  const { user } = await baas.auth.verifyPhoneOtp(
    '+237695512390',
    '482910', // Code à 6 chiffres reçu
    otp_token
  );
  console.log('Authentifié par téléphone :', user.phoneNumber);
} catch (error: any) {
  console.error('Code OTP invalide ou expiré :', error.message);
}
```

### 4.4 Connexion Anonyme (Invité)
```typescript
const { user } = await baas.auth.signInAnonymously();
console.log('Compte invité créé :', user.id);
```

### 4.5 Écouteur Réactif de Changement d'État (`onAuthStateChange`)
Idéal pour mettre à jour vos composants UI automatiquement :

```typescript
const unsubscribe = baas.auth.onAuthStateChange((user) => {
  if (user) {
    console.log('Utilisateur actuellement connecté :', user.displayName || user.email);
  } else {
    console.log('Aucun utilisateur connecté (mode déconnecté).');
  }
});

// Pour arrêter d'écouter :
// unsubscribe();
```

### 4.6 Déconnexion
```typescript
baas.auth.signOut();
```

---

## 5. 🗄️ Base de Données NoSQL (Firestore-like)

### 5.1 Ajouter un nouveau document avec ID automatique (`add`)
```typescript
interface Course {
  title: string;
  teacher: string;
  level: string;
  coefficient: number;
  published: boolean;
}

const docRef = await baas.collection<Course>('courses').add({
  title: 'Informatique & Algorithmique',
  teacher: 'Professeur Ndongo',
  level: 'Terminale TI',
  coefficient: 5,
  published: true,
});

console.log('Document créé avec ID généré :', docRef.id);
```

### 5.2 Créer ou écraser un document avec ID spécifique (`set`)
```typescript
await baas.collection('profiles').doc('user_12345').set({
  bio: 'Développeur Fullstack & Flutter',
  skills: ['TypeScript', 'Laravel', 'Flutter'],
  last_login: new Date().toISOString(),
}, { merge: true }); // merge: true préserve les champs existants
```

### 5.3 Mettre à jour des champs précis (`update`)
```typescript
await baas.collection('courses').doc('math-101').update({
  coefficient: 6,
  is_verified: true,
});
```

### 5.4 Lire un document unique (`get`)
```typescript
try {
  const doc = await baas.collection('courses').doc('math-101').get();
  console.log('Titre du cours :', doc.data.title);
  console.log('Date de création :', doc.created_at);
} catch (error: any) {
  if (error.name === 'BaasNotFoundError') {
    console.log('Ce document n\'existe pas.');
  }
}
```

### 5.5 Supprimer un document (`delete`)
```typescript
await baas.collection('courses').doc('math-101').delete();
```

### 5.6 Requêtes Avancées (Filtres `where`, Tri & Pagination)
```typescript
const courses = await baas
  .collection('courses')
  .where('level', '==', 'Terminale TI')
  .where('coefficient', '>=', 4)
  .where('category', 'in', ['Sciences', 'Technologie'])
  .orderBy('coefficient', 'desc')
  .limit(10)
  .page(1)
  .get();

courses.forEach((doc) => {
  console.log(`[${doc.id}] ${doc.data.title} — Coeff: ${doc.data.coefficient}`);
});
```

#### Opérateurs de filtrage supportés :
* `==` ou `=` (Égalité)
* `!=` (Différence)
* `>` (Strictement supérieur)
* `>=` (Supérieur ou égal)
* `<` (Strictement inférieur)
* `<=` (Inférieur ou égal)
* `in` (Appartient à la liste de valeurs)
* `not_in` (N'appartient pas à la liste)
* `contains` ou `array_contains` (Contient la sous-chaîne ou l'élément)

### 5.7 Écritures Atomiques par Lots (*Batch Writes*)
```typescript
const batch = baas.database.batch();

const doc1 = baas.collection('stats').doc('global');
const doc2 = baas.collection('logs').doc('log_999');

batch.update(doc1, { active_users: 1540 });
batch.set(doc2, { action: 'user_login', timestamp: Date.now() });

await batch.commit();
console.log('Lot d\'écritures validé en une seule transaction !');
```

---

## 6. 📁 Stockage de Fichiers (Cloud Storage)

### 6.1 Upload de Fichier depuis un input HTML (`<input type="file">`)
```typescript
const fileInput = document.querySelector<HTMLInputElement>('#myFileInput')!;
const file = fileInput.files![0];

try {
  const fileData = await baas.storage.upload(`cours/devoirs/${file.name}`, file, {
    isPublic: true,
  });

  console.log('Fichier téléversé avec succès ! URL publique :', fileData.url);
} catch (error: any) {
  console.error('Échec de l\'upload :', error.message);
}
```

### 6.2 Générer une URL Signée Temporaire (Fichier Privé Sécurisé)
```typescript
const signedUrl = await baas.storage.getSignedUrl('documents/bulletin_secret.pdf', 15);
console.log('Lien valable pendant 15 minutes :', signedUrl);
```

### 6.3 Supprimer un fichier
```typescript
await baas.storage.deleteFile('cours/devoirs/exercice.pdf');
```

---

## 7. 🔔 Notifications Push

### 7.1 Enregistrer le token de notification de l'appareil
```typescript
await baas.notifications.registerDeviceToken(
  'fcm_device_token_xxxxxxxxxxxxxx',
  'web',
  ['tous_les_eleves', 'terminale_c']
);
```

### 7.2 Envoyer une notification ciblée
```typescript
await baas.notifications.send({
  topic: 'terminale_c',
  title: 'Devoir de Mathématiques',
  body: 'La correction du DS N°2 est maintenant disponible en ligne.',
  data: { page: '/devoirs/ds-2' },
});
```

---

## 8. 🛡️ Gestion des Erreurs Typées

```typescript
import {
  BaasAuthError,
  BaasPermissionError,
  BaasNotFoundError,
  BaasQuotaError,
  BaasError,
} from '@camschool/baas-js';

try {
  await baas.collection('finances').doc('compte_principal').get();
} catch (err: any) {
  if (err instanceof BaasPermissionError) {
    // 403 : Règle de sécurité enfreinte
    alert('Accès refusé par les règles de sécurité.');
  } else if (err instanceof BaasNotFoundError) {
    // 404 : Non trouvé
    console.warn('Document introuvable.');
  } else if (err instanceof BaasAuthError) {
    // 401 : Session expirée
    baas.auth.signOut();
  } else if (err instanceof BaasQuotaError) {
    // 429 : Quotas de requêtes dépassés
    console.error('Quota d\'API atteint pour ce projet.');
  } else {
    console.error('Erreur inattendue :', err.message);
  }
}
```

---

## 9. ⚛️ Exemple d'Intégration dans React / Next.js

```tsx
import React, { useEffect, useState } from 'react';
import { createClient, BaasDocument } from '@camschool/baas-js';

const baas = createClient({
  baseUrl: 'https://api.votre-domaine.cm',
  projectId: 'camschool_demo',
  apiKey: 'baas_pub_xxxxxx',
});

export default function CoursesList() {
  const [courses, setCourses] = useState<BaasDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourses();
  }, []);

  async function loadCourses() {
    try {
      const data = await baas
        .collection('courses')
        .orderBy('created_at', 'desc')
        .limit(20)
        .get();
      setCourses(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd() {
    const title = prompt('Titre du cours :');
    if (!title) return;

    await baas.collection('courses').add({
      title,
      created_at: new Date().toISOString(),
    });
    loadCourses();
  }

  if (loading) return <div>Chargement des cours...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Liste des Cours (CamSchool BaaS)</h1>
      <button onClick={handleAdd}>+ Ajouter un cours</button>

      <ul>
        {courses.map((c) => (
          <li key={c.id}>
            <strong>{c.data.title}</strong> (ID: {c.id})
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

## 10. 🏆 Bonnes Pratiques & Sécurité

1. **Clé API Publique (`apiKey`)** : Vous pouvez exposer sans risque votre `apiKey` publique dans votre frontend JavaScript.
2. **Ne jamais exposer la `secret_key`** dans un environnement client/navigateur. Réservez la `secret_key` à vos scripts serveurs ou cron jobs backend.
3. **Configurez vos `Security Rules`** dans l'espace d'administration CamSchool BaaS pour sécuriser les accès par utilisateur (`auth.id == doc.user_id`).
