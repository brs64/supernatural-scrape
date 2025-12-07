# 🚀 Démarrage Rapide (5 minutes)

Guide express pour lancer l'app Supernatural Conventions Tracker.

## Étape 1 : Tester l'app en local (2 min)

```bash
# Installer les dépendances
npm install

# Lancer l'app
npm start
```

📱 Scannez le QR code avec :
- **iOS** : App Caméra
- **Android** : Expo Go

L'app fonctionnera déjà avec les données d'exemple ! 🎉

## Étape 2 : Configurer GitHub (3 min)

### A. Créer le repository

```bash
# Initialiser git
git init
git add .
git commit -m "🔥 Initial commit"

# Créer un repo sur GitHub, puis :
git remote add origin https://github.com/VOTRE_USERNAME/VOTRE_REPO.git
git branch -M main
git push -u origin main
```

### B. Activer GitHub Actions

1. GitHub → Votre repo → **Actions** → **Enable**
2. **Settings** → **Actions** → **General** → **Workflow permissions** → **Read and write** → **Save**

### C. Mettre à jour l'URL dans l'app

Ouvrir `src/services/ConventionsService.js` (ligne 6) :

```javascript
// AVANT
const CONVENTIONS_URL = 'https://raw.githubusercontent.com/VOTRE_USERNAME/supernatural-scraper/main/data/conventions.json';

// APRÈS (remplacer USERNAME et REPO)
const CONVENTIONS_URL = 'https://raw.githubusercontent.com/USERNAME/REPO/main/data/conventions.json';
```

### D. Lancer le premier scraping

GitHub → **Actions** → **Scrape Supernatural Conventions** → **Run workflow**

✅ **C'est tout !** Votre app est maintenant connectée au scraper automatique.

## Étape 3 : Vérifier que tout fonctionne

1. Attendez que le workflow se termine (1-2 min)
2. Vérifiez que `data/conventions.json` a été mis à jour sur GitHub
3. Dans l'app, tirez vers le bas pour rafraîchir
4. Les conventions doivent apparaître ! 🎉

## Prochaines étapes

- 📖 Lire le [README.md](README.md) complet pour plus de détails
- 🎨 Créer vos icônes (voir `assets/README.md`)
- 🔧 Personnaliser les sources de scraping
- 📱 Builder l'app pour production

## Problèmes ?

**L'app ne charge pas les conventions**
- Vérifier que l'URL GitHub est correcte
- Tester l'URL dans le navigateur
- Regarder les logs : `npx expo start --clear`

**GitHub Actions bloqué**
- Vérifier Settings → Actions → Permissions
- Relancer manuellement le workflow

**Notifications ne marchent pas**
- C'est normal en mode développement avec Expo Go
- Elles marcheront dans le build de production

---

**Besoin d'aide ?** Ouvrez une issue sur GitHub ! 🤝
