# 🧪 Partie E2E — Travail réalisé

Dans cette partie du projet, **j’ai mis en place des tests automatisés** pour vérifier les fonctionnalités critiques de l’application.

Mon objectif était de :

- automatiser la vérification des fonctionnalités principales
- détecter rapidement les erreurs après une modification du code
- éviter les régressions avant la mise en production

Pour cela, j’ai utilisé **Selenium WebDriver** pour contrôler le navigateur et **Mocha** comme framework de test.

# 1️⃣ Architecture des Tests

J’ai organisé les scripts de tests dans le dossier suivant :


tests/e2e/


Chaque fichier correspond à un scénario utilisateur spécifique.

## `login.test.js`

Dans ce test, **j’ai vérifié le fonctionnement du système d’authentification**.

Ce test simule un utilisateur qui :

1. ouvre la page de connexion
2. saisit ses identifiants
3. valide le formulaire
4. accède à l’application

L’objectif était de vérifier que :

- la connexion fonctionne avec des identifiants valides
- l’utilisateur est correctement redirigé après connexion


## `create_task.test.js`

Dans ce test, **j’ai automatisé la création d’une nouvelle tâche**.

Le script :

1. ouvre la page des tâches
2. remplit le formulaire de création
3. valide le formulaire
4. vérifie que la tâche apparaît dans la liste

Cela permet de confirmer que la communication entre **l’interface et le serveur fonctionne correctement**.


## `task_crud.test.js`

Dans ce fichier, **j’ai testé le cycle complet de gestion d’une tâche**.

Le test vérifie les opérations principales appelées **CRUD** :

- **Create** → créer une tâche
- **Read** → vérifier qu’elle s’affiche
- **Delete** → supprimer la tâche

Ce scénario reproduit l’utilisation réelle de l’application par un utilisateur.


# 2️⃣ Défis Techniques que j’ai rencontrés

Pendant le développement des tests, **j’ai rencontré plusieurs problèmes techniques**.  
J’ai dû analyser ces problèmes et trouver des solutions pour rendre les tests fiables.


## Problème 1 — Incompatibilité avec Chrome

Lorsque j’ai commencé les tests, **le navigateur Chrome ne fonctionnait pas correctement avec la version du driver utilisée**.

Cela provoquait des erreurs lors du lancement du navigateur.

### Solution

J’ai résolu ce problème en **passant à Selenium 4**, qui gère automatiquement les drivers des navigateurs.

Cela permet d’éviter les conflits entre les versions de Chrome et du driver.

## Problème 2 — Chargement asynchrone des pages

Un autre problème était que **les éléments de la page n’étaient pas toujours chargés au moment où le test essayait d’interagir avec eux**.

Cela provoquait des erreurs comme :


Element not found

### Solution

Pour résoudre ce problème, **j’ai utilisé des Explicit Waits**.

Cela permet de dire au test :

> attendre que l’élément soit présent ou cliquable avant de continuer.


## Problème 3 — Interface dynamique

Dans certaines pages, **les identifiants HTML changeaient automatiquement**.

Cela rendait les sélecteurs instables.

### Solution

Pour éviter ce problème, **j’ai utilisé des sélecteurs XPath basés sur le texte visible**.



### 3️⃣ Comment exécuter les tests

Pour lancer les tests sur la machine locale, il faut d’abord vérifier que l’application fonctionne.

Prérequis

Les deux serveurs doivent être démarrés :

serveur Frontend

serveur Backend


Dans le terminal, j’exécute la commande suivante :

npx mocha tests/e2e/*.test.js

Cette commande lance tous les tests E2E présents dans le dossier.

Si tout fonctionne correctement, le terminal affiche :

2 passing


🚀 Importance des tests E2E

Le travail réalisé permet de vérifier automatiquement les fonctionnalités critiques en quelques secondes.

Grâce à ces tests, on peut rapidement confirmer que :

un utilisateur peut se connecter

un utilisateur peut créer une tâche

un utilisateur peut gérer ses tâches

Cela réduit fortement les risques d’erreurs lors des mises à jour de l’application et améliore la qualité globale du logiciel.

**Validation de la connexion :**
![Login Pass](./test%20login%20.png)

**Validation du cycle Création/Suppression :**
![CRUD Pass](./create%20delete%20test.png)
