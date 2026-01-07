# NexusCRM Monorepo

NexusCRM est une plateforme modulaire (microservices) pour CRM, e‑commerce et gestion des utilisateurs, avec un Frontend React (Vite) et un API Gateway pour unifier l’accès aux services.

## Sommaire
- Aperçu & architecture
- Arborescence
- Pile technologique
- Microservices & ports
- Variables d’environnement
- Installation
- Démarrage des services
- API Gateway (routes)
- Frontend
- Santé & tests rapides
- Conseils de dev

## Aperçu & Architecture
- **API Gateway**: Proxy Express centralisant l’accès aux microservices `user`, `crm`, `product`.
- **User Service**: Authentification JWT, gestion des utilisateurs/shops.
- **CRM Service**: Contacts, segments, historiques.
- **Product Service**: Produits, catégories, avis.
- **E‑Commerce Service**: Commandes, paiements, livraisons, stock, fournisseurs (actuellement non exposé via Gateway).
- **Frontend (React/Vite)**: Interface client.

## Arborescence
```
Frontend/
services/
  api-gateway/
  crm-service/
  e-commerce-service/
  product-service/
  user-service/
  support-service/
  ai-chatbot-service/
.env (dans services/)
.env.example (dans services/)
```

## Pile Technologique
- **Backend**: Node.js, Express, Mongoose, JWT, Nodemailer, http-proxy-middleware
- **Frontend**: React 19, Vite 7, ESLint
- **Infra**: MongoDB

## Microservices & Ports
- **Gateway**: `GATEWAY_PORT=3001`
- **CRM**: `CRM_PORT=5001`
- **User**: `USER_PORT=5002`
- **Product**: `PRODUCT_PORT=5003`
- **E‑Commerce**: `E_COMMERCE_PORT=5004`

MongoDB: `MONGO_URI=mongodb://127.0.0.1:27017/NEXUSCRM`

## Variables d’Environnement
Utilisez `services/.env` basé sur `services/.env.example`.

Exemple (simplifié):
```
LOGIN_MAX_ATTEMPTS=5
LOGIN_WARN_ATTEMPTS=3
LOGIN_LOCK_MINUTES=15

GATEWAY_PORT=3001
CRM_PORT=5001
USER_PORT=5002
PRODUCT_PORT=5003
E_COMMERCE_PORT=5004

MONGO_URI=mongodb://127.0.0.1:27017/NEXUSCRM

JWT_SECRET=change_me
JWT_EXPIRES_IN=7d

MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USER=<user>
MAIL_PASS=<pass>

USER_SERVICE_URL=http://localhost:5002
CRM_SERVICE_URL=http://localhost:5001
PRODUCT_SERVICE_URL=http://localhost:5003
E_COMMERCE_SERVICE_URL=http://localhost:5004
```

## Installation
Exécutez ces commandes dans chaque dossier de service et le Frontend.

```powershell
# Backend services
cd services/api-gateway; npm install; cd ..
cd crm-service; npm install; cd ..
cd product-service; npm install; cd ..
cd e-commerce-service; npm install; cd ..
cd user-service; npm install; cd ..

# Frontend
cd ../Frontend; npm install
```

## Démarrage des Services
Démarrez chaque service dans des terminaux séparés.

```powershell
# API Gateway
cd services/api-gateway; npm run dev

# CRM Service
cd services/crm-service; npm run dev

# User Service
cd services/user-service; npm run dev

# Product Service
cd services/product-service; npm run dev

# E‑Commerce Service
cd services/e-commerce-service; npm run dev
```

## API Gateway (Routes)
Base URL Gateway: `http://localhost:3001`

- **Users (via user-service)**
  - `/api/users/auth/*` → proxie vers `user-service` (`/api/auth/*`)
  - `/api/users/shops/*` → proxie vers `user-service` (`/api/shops/*`)
- **CRM (via crm-service)**
  - `/api/crm/contacts/*` → proxie vers `crm-service` (`/contacts/*`)
  - `/api/crm/segments/*` → proxie vers `crm-service` (`/segments/*`)
  - `/api/crm/history/*` → proxie vers `crm-service` (`/history/*`)
- **Products (via product-service)**
  - `/api/products/*` → proxie vers `product-service` (`/api/products/*`)
  - `/api/products/categories/*` → proxie vers `product-service` (`/api/categories/*`)
  - `/api/products/reviews/*` → proxie vers `product-service` (`/api/reviews/*`)

Note: Le **e‑commerce service** expose directement sur son port (`/api/orders`, `/api/payments`, `/api/deliveries`, `/api/stock`, `/api/suppliers`) et n’est pas encore relié au Gateway.

## Frontend
Scripts (dans `Frontend/package.json`):

```bash
npm run dev      # démarre Vite
npm run build    # build de production
npm run preview  # preview du build
```

Recommandation: configurez une variable `VITE_API_BASE` pour pointer sur le Gateway (`http://localhost:3001`).

## Santé & Tests Rapides
Endpoints de santé (GET):
- `http://localhost:3001/health` (gateway)
- `http://localhost:5001/health` (crm)
- `http://localhost:5002/health` (user)
- `http://localhost:5003/health` (product)
- `http://localhost:5004/health` (e‑commerce)

Exemples PowerShell (Invoke-WebRequest):
```powershell
Invoke-WebRequest http://localhost:3001/health | Select-Object -ExpandProperty Content
Invoke-WebRequest http://localhost:5002/health | Select-Object -ExpandProperty Content
```

## Conseils de Dev
- **Env**: ne versionnez pas `services/.env`; utilisez `services/.env.example`.
- **Logs**: .gitignore couvre `node_modules`, `dist`, logs.
- **Sécurité**: changez `JWT_SECRET` en production; stockez secrets via vault.
- **Frontend Lint**: `cd Frontend; npm run lint`.
- **MongoDB**: assurez-vous que `MONGO_URI` est accessible.

---

Besoin d’ajouter des scripts de démarrage combinés, une documentation d’API détaillée ou d’exposer le e‑commerce via le Gateway ? Je peux le faire.
