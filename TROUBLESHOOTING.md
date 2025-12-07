# 🔧 Dépannage et Solutions

Guide de résolution des problèmes courants avec l'app Supernatural Conventions Tracker.

## ⚠️ Notifications ne fonctionnent pas dans Expo Go

### Problème

Vous voyez cette erreur :
```
ERROR  expo-notifications: Android Push notifications (remote notifications)
functionality provided by expo-notifications was removed from Expo Go with
the release of SDK 53.
```

### Explication

**C'est normal !** 🎉

Depuis Expo SDK 53, les notifications push ne fonctionnent plus dans **Expo Go** (l'app de développement). Elles fonctionneront parfaitement dans votre **build de production**.

### Solutions

#### Option 1 : Continuer avec Expo Go (Recommandé pour le développement)

Vous pouvez ignorer cet avertissement pendant le développement. Les notifications fonctionneront automatiquement quand vous builderez l'app.

**Ce qui fonctionne en Expo Go :**
- ✅ Affichage des conventions
- ✅ Rafraîchissement des données
- ✅ Cache local
- ✅ Interface utilisateur
- ❌ Notifications push (uniquement)

#### Option 2 : Créer un Development Build

Si vous avez **absolument besoin** de tester les notifications pendant le développement :

```bash
# Installer EAS CLI
npm install -g eas-cli

# Se connecter
eas login

# Créer un development build
eas build --profile development --platform android
# ou
eas build --profile development --platform ios
```

Plus d'infos : https://docs.expo.dev/develop/development-builds/introduction/

#### Option 3 : Builder pour Production

Pour tester l'app finale avec les notifications :

```bash
# Build Android (APK)
eas build --platform android --profile preview

# Build iOS (nécessite compte Apple Developer)
eas build --platform ios
```

---

## 🚫 Erreur 404 - GitHub URL not found

### Problème

```
ERROR  Erreur lors du fetch des conventions: [Error: HTTP error! status: 404]
```

### Causes possibles

1. **Le repository GitHub n'existe pas encore**
2. **Le fichier data/conventions.json n'est pas présent**
3. **GitHub Actions n'a pas encore été exécuté**
4. **L'URL dans le code est incorrecte**

### Solutions

#### 1. Vérifier que le repo est créé

```bash
# Créer et pousser vers GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/VOTRE_USERNAME/VOTRE_REPO.git
git push -u origin main
```

#### 2. Vérifier l'URL dans le code

Ouvrir `src/services/ConventionsService.js` ligne 6 :

```javascript
const CONVENTIONS_URL = 'https://raw.githubusercontent.com/USERNAME/REPO/main/data/conventions.json';
```

Remplacer `USERNAME` et `REPO` par vos vraies valeurs.

#### 3. Exécuter GitHub Actions

1. Aller sur GitHub → Votre repo → **Actions**
2. Cliquer sur **"Scrape Supernatural Conventions"**
3. Cliquer sur **"Run workflow"**
4. Attendre 1-2 minutes

#### 4. Vérifier que le fichier existe

Aller sur :
```
https://github.com/USERNAME/REPO/blob/main/data/conventions.json
```

Si le fichier n'existe pas, GitHub Actions n'a pas encore été exécuté.

#### 5. Mode développement (solution temporaire)

L'app utilise automatiquement le fichier local `data/conventions.json` si GitHub n'est pas accessible. Vous devriez voir :

```
✅ Utilisation des données locales (mode développement)
```

---

## 📱 Problème d'icônes

### Problème

```
Unable to resolve asset "./assets/icon.png"
```

### Solution

Les icônes ont été créées automatiquement. Si le problème persiste :

```bash
# Recréer les icônes
node create-icons.js

# Ou vérifier qu'elles existent
ls -la assets/
```

**Note** : Les icônes actuelles sont des placeholders 1x1 pixel. L'app fonctionnera mais pour une vraie app, créez de belles icônes (voir `assets/README.md`).

---

## 🔄 L'app ne rafraîchit pas les données

### Solutions

1. **Tirer vers le bas** pour forcer le rafraîchissement
2. **Fermer et rouvrir** l'app
3. **Vider le cache** :

```javascript
// Dans la console Metro (terminal où vous avez fait npm start)
// Appuyez sur 'r' pour reload
// Ou appuyez sur 'Shift+r' pour reload et clear cache
```

4. **Restart complet** :

```bash
# Arrêter le serveur (Ctrl+C)
npm start --clear
```

---

## ⚙️ GitHub Actions ne se déclenche pas

### Vérifier les permissions

1. GitHub → Votre repo → **Settings**
2. **Actions** → **General**
3. Descendre à **Workflow permissions**
4. Sélectionner **"Read and write permissions"**
5. Cocher **"Allow GitHub Actions to create and approve pull requests"**
6. **Save**

### Tester manuellement

1. **Actions** → **Scrape Supernatural Conventions**
2. **Run workflow** → **Run workflow**
3. Attendre et vérifier les logs

### Voir les logs

1. **Actions** → Cliquer sur une exécution
2. Cliquer sur **"scrape"**
3. Voir les logs détaillés

---

## 💥 Erreur 128 dans GitHub Actions

### Problème

```
Annotations
1 error
scrape
Process completed with exit code 128.
```

### Explication

L'erreur 128 de Git signifie généralement un problème de permissions ou d'authentification lors du `git push`.

### Solutions

#### 1. Vérifier les permissions du workflow ✅

Le fichier `.github/workflows/scrape.yml` doit contenir :

```yaml
jobs:
  scrape:
    runs-on: ubuntu-latest

    # IMPORTANT: Ajouter ces permissions
    permissions:
      contents: write

    steps:
      # ...
```

✅ **Cette configuration est déjà incluse dans votre workflow !**

#### 2. Vérifier les permissions du repository

**IMPORTANT** : C'est souvent la vraie cause !

1. GitHub → Votre repo → **Settings**
2. **Actions** → **General**
3. Descendre à **Workflow permissions**
4. Sélectionner **"Read and write permissions"** (pas "Read repository contents and packages")
5. Cocher **"Allow GitHub Actions to create and approve pull requests"**
6. Cliquer sur **Save**

#### 3. Vérifier que la branche n'est pas protégée

1. **Settings** → **Branches**
2. Si `main` est dans **Branch protection rules**, cliquer dessus
3. Décocher **"Require a pull request before merging"** pour les commits de GitHub Actions
4. Ou ajouter `github-actions[bot]` dans **"Allow specific actors to bypass required pull requests"**

#### 4. Relancer le workflow

Après avoir vérifié les permissions :

1. **Actions** → **Scrape Supernatural Conventions**
2. **Run workflow** → **Run workflow**
3. Vérifier que ça fonctionne cette fois

#### 5. Si l'erreur persiste

Regarder les logs détaillés :

```bash
# Dans les logs GitHub Actions, chercher :
- "fatal: could not read Username"
- "Permission denied"
- "remote: Permission to ... denied"
```

**Causes possibles :**
- Le GITHUB_TOKEN n'a pas les droits d'écriture → Retour à l'étape 2
- La branche est protégée → Retour à l'étape 3
- Le repo est en mode "read-only" temporairement → Attendre quelques minutes

---

## 🐛 Erreurs de scraping

### Problème

Le scraper ne trouve aucune convention :

```
📊 Total conventions found: 0
```

### Causes

Les sites web changent leur structure HTML régulièrement. Les sélecteurs CSS peuvent devenir obsolètes.

### Solutions

#### 1. Tester le scraper localement

```bash
cd scraper
npm install
npm run scrape
cat ../data/conventions.json
```

#### 2. Ajuster les sélecteurs CSS

Ouvrir `scraper/scrape.js` et modifier les sélecteurs :

```javascript
// Exemple pour People Conventions
$('.event, .convention').each((i, elem) => {
  // Ajuster selon la vraie structure du site
  const name = $(elem).find('h2').text(); // Changer h2 si nécessaire
  // ...
});
```

#### 3. Inspecter le site manuellement

1. Ouvrir le site dans le navigateur
2. **F12** → Inspecteur
3. Trouver la structure HTML des événements
4. Adapter les sélecteurs dans le code

#### 4. Ajouter des conventions manuellement

Dans `scraper/scrape.js`, fonction `addManualConventions()` :

```javascript
const manualConventions = [
  {
    id: 'custom-2025',
    name: 'Ma Convention',
    location: 'Paris, France',
    date: 'June 2025',
    url: 'https://example.com',
    source: 'Manual Entry',
    guests: ['Guest 1']
  }
];
```

---

## 🍎 Problèmes spécifiques iOS

### SafeAreaView deprecated

✅ **Corrigé !** L'app utilise maintenant `react-native-safe-area-context`.

Si vous voyez encore le warning :
```bash
npm install react-native-safe-area-context
```

---

## 🤖 Problèmes spécifiques Android

### Permissions manquantes

Dans `app.json`, vérifier :

```json
"android": {
  "permissions": ["NOTIFICATIONS"]
}
```

---

## 📞 Autres problèmes

### Metro Bundler ne démarre pas

```bash
# Nettoyer et redémarrer
npx expo start --clear
```

### Dépendances cassées

```bash
# Supprimer node_modules et réinstaller
rm -rf node_modules
npm install
```

### L'app crash au démarrage

```bash
# Voir les logs détaillés
npx expo start
# Appuyer sur 'j' pour ouvrir le debugger
```

---

## 🆘 Besoin d'aide supplémentaire ?

1. **Documentation Expo** : https://docs.expo.dev/
2. **GitHub Issues** : Ouvrir une issue sur le repo
3. **Logs détaillés** : Partager les logs de Metro et GitHub Actions

---

**Carry on, hunters! 🔥**
