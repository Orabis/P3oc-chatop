# ChâTop – API back-end

API REST de ChâTop, développée avec NestJS, Prisma et MySQL. Elle remplace l'API Mockoon utilisée par le front-end React (`../frontend`).

Le fonctionnement interne (architecture, authentification, base de données) est expliqué dans la [documentation technique](TECHNICAL.md).

## Prérequis

- Node.js 22 LTS ou supérieur
- pnpm (`npm install -g pnpm`)
- MySQL 8.0+ (ou MariaDB 10.5+)

## Installation

### 1. Cloner le projet et installer les dépendances

```bash
git clone https://github.com/Orabis/P3oc-chatop.git
cd P3oc-chatop/backend
pnpm install
```

### 2. Créer les bases de données

Connectez-vous à MySQL avec un utilisateur qui a le droit de créer des bases, puis exécutez :

```sql
CREATE DATABASE chatop_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE chatop_shadow CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

`chatop_shadow` est la base temporaire dont Prisma a besoin pour calculer les migrations.

### 3. Configurer les variables d'environnement

Copiez le fichier d'exemple, puis remplissez-le :

```bash
cp .env.example .env
```

| Variable              | Obligatoire | Description                                                  |
| --------------------- | ----------- | ------------------------------------------------------------ |
| `DATABASE_URL`        | oui         | `mysql://<user>:<password>@localhost:3306/chatop_db`         |
| `SHADOW_DATABASE_URL` | oui         | `mysql://<user>:<password>@localhost:3306/chatop_shadow`     |
| `PORT`                | non         | Port de l'API (`3000` par défaut, `3001` dans l'exemple)     |
| `JWT_SECRET`          | oui         | Chaîne aléatoire longue utilisée pour signer les tokens JWT  |
| `APP_URL`             | non         | URL publique de l'API, utilisée pour les URL des images      |
| `CORS_ORIGIN`         | non         | Origine autorisée pour le front (`http://localhost:5173`)    |

Pour générer un `JWT_SECRET` :

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Le fichier `.env` est ignoré par git : aucun identifiant n'est écrit dans le code.

### 4. Créer les tables et générer le client Prisma

```bash
pnpm exec prisma migrate deploy
pnpm exec prisma generate
```

Prisma lit automatiquement sa configuration dans `prisma7.config.ts` (schéma `prisma/schema.prisma`, migrations dans `prisma/migrations`).

### 5. Lancer l'API

```bash
# développement (rechargement automatique)
pnpm run start:dev

# production
pnpm run build
pnpm run start:prod
```

L'API répond sur **http://localhost:3001/api** (avec `PORT=3001`, comme dans `.env.example`).

## Documentation Swagger

Une fois l'API lancée, Swagger est disponible sur **http://localhost:3001/api**.

Si vous changez `PORT` dans le `.env`, remplacez `3001` par votre port.

Pour tester les routes protégées dans Swagger :

1. Appelez `POST /api/auth/register` ou `POST /api/auth/login` et copiez le `token` renvoyé.
2. Cliquez sur **Authorize**, collez le token, puis validez.
3. Le token reste enregistré quand vous rechargez la page.

## Routes

Toutes les routes sauf `register` et `login` exigent l'en-tête `Authorization: Bearer <token>`.

| Méthode | Route                | Description                                                 |
| ------- | -------------------- | ----------------------------------------------------------- |
| POST    | `/api/auth/register` | Créer un compte, renvoie un token                           |
| POST    | `/api/auth/login`    | Se connecter, renvoie un token                              |
| GET     | `/api/auth/me`       | Utilisateur connecté                                        |
| GET     | `/api/user/:id`      | Utilisateur par id                                          |
| GET     | `/api/rentals`       | Liste des locations, avec leur propriétaire                 |
| GET     | `/api/rentals/:id`   | Détail d'une location                                       |
| POST    | `/api/rentals`       | Créer une location (`multipart/form-data`, champ `picture`) |
| PUT     | `/api/rentals/:id`   | Modifier une location (propriétaire uniquement)             |
| POST    | `/api/messages`      | Envoyer un message sur une location                         |

Les images envoyées sont stockées dans `uploads/` et servies sur `/uploads/<fichier>` (jpeg, png, webp ou gif, 5 Mo maximum).

## Architecture

```
src/
├── core/            # Prisma, configuration des uploads, DTO partagés
├── iam/
│   ├── auth/        # register, login, me, stratégies et guards JWT/local
│   ├── credentials/ # hachage et vérification des mots de passe
│   └── users/       # GET /user/:id
├── rentals/         # CRUD des locations
└── messages/        # envoi de messages
```

Chaque fonctionnalité est découpée en quatre couches :

- **Modèle** : `prisma/schema.prisma` et les DTO (`dto/`)
- **Repository** : accès à la base via Prisma (`*.repository.ts`)
- **Service** : règles métier (`*.service.ts`)
- **Controller** : routes HTTP (`*.controller.ts`)

Le guard JWT est global : une route est protégée par défaut et ne devient publique qu'avec le décorateur `@Public()`. Les mots de passe sont hachés avant d'être enregistrés en base.

## Scripts utiles

| Commande          | Rôle                      |
| ----------------- | ------------------------- |
| `pnpm run lint`   | Analyse statique (oxlint) |
| `pnpm run format` | Formatage (Prettier)      |
| `pnpm run build`  | Compilation dans `dist/`  |
