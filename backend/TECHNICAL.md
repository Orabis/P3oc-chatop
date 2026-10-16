# ChâTop – Documentation technique

Ce document explique comment l'API est construite. Pour l'installer et la lancer, voir le [README](README.md).

## Stack

| Outil                   | Rôle                                               |
| ----------------------- | -------------------------------------------------- |
| NestJS                  | Framework HTTP (modules, controllers, injection)   |
| Prisma                  | ORM : schéma, migrations, requêtes typées          |
| MySQL / MariaDB         | Base de données                                    |
| Passport + JWT          | Authentification                                   |
| class-validator         | Validation des données reçues                      |
| Multer                  | Réception des images (`multipart/form-data`)       |
| Swagger                 | Documentation interactive sur `/api`               |

## Organisation du code

```
src/
├── main.ts          # démarrage : CORS, préfixe /api, validation, Swagger, fichiers statiques
├── app.module.ts    # assemble tous les modules
├── core/            # éléments partagés (Prisma, uploads, DTO communs)
├── iam/             # identité : auth, credentials, users
├── rentals/         # locations
└── messages/        # messages
```

Chaque dossier fonctionnel est un **module NestJS** : il déclare son controller, ses services et ce qu'il partage avec les autres modules.

## Les 4 couches

Une requête traverse toujours les mêmes couches, et chacune a un seul rôle :

```
Requête HTTP
   │
   ▼
Controller   → reçoit la requête, lit les paramètres, appelle le service
   │
   ▼
Service      → applique les règles métier (existe ? propriétaire ? …)
   │
   ▼
Repository   → parle à la base via Prisma, sans logique métier
   │
   ▼
Base MySQL
```

Le **modèle** est défini dans `prisma/schema.prisma` (les tables) et dans les **DTO** (`dto/`), qui décrivent ce qui entre dans l'API et ce qui en sort.

Exemple avec `PUT /api/rentals/:id` :

1. `RentalsController.update` récupère l'id, le body, l'image et l'utilisateur connecté.
2. `RentalsService.update` vérifie que la location existe et que l'utilisateur en est le propriétaire.
3. `RentalsRepository.update` exécute la mise à jour en base.

Grâce à ce découpage, on peut changer la base de données sans toucher aux règles métier, et inversement.

## Les DTO

- **DTO d'entrée** (`CreateRentalDto`, `RegisterDto`…) : leurs décorateurs (`@IsString`, `@IsEmail`…) déclarent les règles de validation. Le `ValidationPipe` global (`main.ts`) renvoie automatiquement une erreur 400 si les données sont invalides, et rejette les champs inconnus.
- **DTO de sortie** (`RentalResponseDto`, `UserResponseDto`) : leur méthode `fromEntity()` transforme une ligne de la base en réponse JSON. Le mot de passe n'est donc jamais renvoyé, et la location expose `owner: { id, name }` au lieu de `owner_id`.

## Authentification

### Inscription et connexion

- **Register** : `AuthService` vérifie que l'email est libre, `CredentialsService` hache le mot de passe, puis l'utilisateur est créé et un token est renvoyé.
- **Login** : le `LocalAuthGuard` (stratégie `local`) vérifie l'email et le mot de passe, puis un token est renvoyé.

Le mot de passe n'est jamais stocké en clair : seul son hash est en base.

### Protection des routes

Le `JwtAuthGuard` est enregistré **globalement** (`auth.module.ts`). Toutes les routes sont donc protégées par défaut.

- Le client envoie `Authorization: Bearer <token>`.
- La `JwtStrategy` vérifie la signature (avec `JWT_SECRET`) et l'expiration (24 h).
- L'utilisateur est ensuite disponible dans le controller via `req.user` (`{ id, email }`).
- Pour rendre une route publique, on ajoute `@Public()`. Seuls `register` et `login` l'utilisent.

La durée de validité du token se règle avec `expiresIn` dans `auth.module.ts`.

## Base de données

- Le schéma Prisma est dans `prisma/schema.prisma` et les migrations dans `prisma/migrations/`.
- `PrismaService` (`core/prisma`) ouvre la connexion à partir de `DATABASE_URL`. Il est injecté dans les repositories.
- Les relations utilisent `onDelete: Cascade` : supprimer un utilisateur supprime ses locations et ses messages.
- Les ids sont en `AUTO_INCREMENT` : un id supprimé n'est jamais réutilisé, donc il est normal d'avoir des trous (1, 2, 5…).

Pour modifier le schéma :

```bash
# 1. modifier prisma/schema.prisma
# 2. créer et appliquer la migration
pnpm exec prisma migrate dev --name <nom_de_la_modif>
```

## Upload des images

La configuration se trouve dans `core/uploads/uploads.config.ts` :

- Formats acceptés : jpeg, png, webp et gif, 5 Mo maximum.
- Les fichiers sont enregistrés dans `uploads/` sous un nom unique (UUID).
- Ils sont servis sur `/uploads/<fichier>`, et la base stocke leur URL complète (construite avec `APP_URL`).

## Configuration

Toutes les valeurs sensibles ou propres à l'environnement viennent du `.env`, lu par `ConfigModule` (voir `.env.example`). Aucun secret n'est écrit dans le code.

## Ajouter une nouvelle route

1. **DTO** : créer la classe d'entrée avec ses règles de validation, et celle de sortie si besoin.
2. **Repository** : ajouter la requête Prisma.
3. **Service** : ajouter la logique métier et les erreurs (`NotFoundException`, `ForbiddenException`…).
4. **Controller** : ajouter la méthode avec son décorateur (`@Get`, `@Post`…) et un commentaire `/** … */`. Ce commentaire apparaît automatiquement comme résumé dans Swagger.
5. Si la route doit être accessible sans token, ajouter `@Public()`.

## Codes de réponse

| Code | Quand                                                  |
| ---- | ------------------------------------------------------ |
| 200  | Lecture ou mise à jour réussie                         |
| 201  | Création réussie (register, location, message)        |
| 400  | Données invalides, ou email déjà utilisé               |
| 401  | Token absent, invalide ou expiré ; identifiants faux   |
| 403  | Modification d'une location dont on n'est pas proprio  |
| 404  | Ressource introuvable                                  |
