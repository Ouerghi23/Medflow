# 🏥 MedFlow - Diagrammes UML Complets

## 📋 Vue d'ensemble

Ce package contient tous les diagrammes UML nécessaires pour le projet **MedFlow**, un système SaaS de gestion de cliniques médicales.


## 🛠️ Stack Technique du Projet

### Frontend
- ⚛️ **Next.js 14** - Framework React
- 🎨 **Tailwind CSS** - Styling
- 🧩 **shadcn/ui** - Composants UI

### Backend
- 🔧 **Next.js API Routes** - API Serverless
- 🗄️ **Prisma ORM** - Abstraction BDD
- ✅ **Zod** - Validation de données

### Base de Données
- 🐘 **PostgreSQL** - Base de données relationnelle
- 🔄 **Migrations Prisma** - Gestion du schéma

### Services Externes
- 💳 **Stripe** - Paiements en ligne
- 📧 **Resend/SendGrid** - Emails
- 📁 **AWS S3 / Vercel Blob** - Stockage fichiers
- 📄 **PDFKit** - Génération PDF

### Sécurité
- 🔐 **Auth.js** - Authentification
- 🔑 **JWT** - Tokens sécurisés
- 🛡️ **Bcrypt** - Hash mots de passe
- 🚦 **RBAC** - Contrôle d'accès

### Déploiement
- ☁️ **Vercel** - Hébergement frontend + API
- 🚀 **Railway/Render** - Base de données PostgreSQL
- 📊 **Sentry** - Monitoring et erreurs

## 🎯 Rôles Utilisateurs

Le système MedFlow gère 4 types d'utilisateurs :

### 👨‍💼 Admin/Propriétaire
- Création et configuration de la clinique
- Gestion des services et tarifs
- Gestion du personnel (médecins, réceptionnistes)
- Accès aux analytics et statistiques

### 👨‍⚕️ Médecin
- Gestion de l'agenda personnel
- Consultation des dossiers patients
- Création d'ordonnances avec génération PDF
- Enregistrement des diagnostics et traitements

### 👩‍💼 Réceptionniste
- Enregistrement des nouveaux patients
- Prise et modification de rendez-vous
- Gestion de la facturation
- Enregistrement des paiements

### 🧑‍🦰 Patient (Portail)
- Réservation de rendez-vous en ligne
- Consultation de l'historique médical
- Téléchargement des ordonnances
- Paiement en ligne sécurisé

## 🏗️ Architecture Multi-Tenant

Le système utilise une architecture **multi-tenant** avec :
- 🔑 **tenantId** : Isolation des données par clinique
- 🔒 **Row-Level Security** : Sécurité au niveau des lignes
- 🎨 **Configuration personnalisée** : Logo, couleurs, services par clinique

## 📊 Modules Principaux

### 1️⃣ Authentification & RBAC
- Création de comptes multi-rôles
- Connexion sécurisée (JWT)
- Permissions basées sur les rôles
- Récupération de mot de passe

### 2️⃣ Gestion Patients
- CRUD complet des patients
- Profil détaillé (allergies, antécédents)
- Historique médical complet
- Documents associés

### 3️⃣ Agenda & Rendez-vous
- Calendrier médecin avec disponibilités
- Prise de rendez-vous (réception + portail)
- Gestion des créneaux horaires
- Notifications automatiques (email/SMS)

### 4️⃣ Consultations & Ordonnances
- Dossier médical électronique
- Saisie diagnostic et traitement
- Génération ordonnances PDF
- Prescriptions médicamenteuses
- Stockage sécurisé des documents

### 5️⃣ Facturation & Paiement
- Génération automatique de factures
- Tarifs par service
- Paiement en ligne (Stripe)
- Paiement sur place (espèces/carte)
- Génération de reçus PDF
- Suivi des paiements

### 6️⃣ Portail Patient
- Espace personnel sécurisé
- Réservation en ligne
- Consultation historique
- Téléchargement documents
- Paiement factures en ligne

### 7️⃣ Administration
- Paramétrage clinique
- Gestion des services
- Gestion du personnel
- Configuration tarifs
- Analytics et rapports

## 🔐 Sécurité

### Mesures de Sécurité Implémentées
- ✅ Hash des mots de passe (Bcrypt)
- ✅ Tokens JWT pour les sessions
- ✅ HTTPS obligatoire (TLS 1.3)
- ✅ Validation côté serveur (Zod)
- ✅ Protection CSRF
- ✅ Rate limiting (DDoS)
- ✅ Isolation multi-tenant
- ✅ Audit logging de toutes les actions
- ✅ Signed URLs pour les fichiers (24h)
- ✅ Conformité RGPD

## 📅 Planning Agile (5 Sprints)

### Sprint 1 (Semaines 1-2)
- ✅ Authentification & RBAC
- ✅ Onboarding clinique
- ✅ Dashboard basique

### Sprint 2 (Semaines 3-4)
- ✅ CRUD Patients
- ✅ Gestion Services
- ✅ Système de rendez-vous

### Sprint 3 (Semaines 5-6)
- ✅ Module consultations
- ✅ Génération ordonnances PDF
- ✅ Dossier médical

### Sprint 4 (Semaines 7-8)
- ✅ Module facturation
- ✅ Intégration Stripe
- ✅ Portail patient

### Sprint 5 (Semaines 9-10)
- ✅ Analytics & rapports
- ✅ Calendrier avancé
- ✅ Notifications email/SMS
- ✅ Tests et optimisations

## 🎓 Critères d'Évaluation

### Conception (25%)
- Qualité des diagrammes UML ✅
- Cohérence du modèle de données ✅
- Maquettes d'interface ⏳

### Code & Architecture (25%)
- Qualité du code (clean code)
- Architecture en couches
- Tests unitaires et d'intégration
- Documentation technique

### Fonctionnalités (30%)
- MVP complet et fonctionnel
- Tous les modules implémentés
- Gestion des erreurs
- UX fluide

### UX/UI (10%)
- Design moderne et professionnel
- Responsive design
- Accessibilité
- Ergonomie

### Documentation & Démo (10%)
- README complet
- Documentation API
- Vidéo de démonstration (2-3 min)
- Présentation finale

## 🔄 Workflow Git Recommandé

```bash
# Branches principales
main          # Production
develop       # Développement
feature/*     # Fonctionnalités
hotfix/*      # Corrections urgentes

# Exemple workflow
git checkout develop
git checkout -b feature/patient-crud
# ... développement ...
git commit -m "feat: add patient CRUD operations"
git push origin feature/patient-crud
# Pull Request vers develop
```

## 📖 Conventions de Code

### Commits (Conventional Commits)
```
feat: nouvelle fonctionnalité
fix: correction de bug
docs: documentation
style: formatage
refactor: refactoring
test: tests
chore: maintenance
```

### Nommage
```typescript
// Composants React : PascalCase
export const PatientForm = () => {}

// Fonctions : camelCase
const fetchPatientData = async () => {}

// Types/Interfaces : PascalCase
interface PatientData {}

// Constantes : UPPER_SNAKE_CASE
const API_BASE_URL = "..."
```

## 🚀 Démarrage Rapide

### 1. Cloner le Repository
```bash
git clone https://github.com/votre-equipe/medflow.git
cd medflow
```

### 2. Installer les Dépendances
```bash
npm install
```

### 3. Configuration Environnement
```bash
cp .env.example .env
# Éditer .env avec vos valeurs
```

### 4. Base de Données
```bash
npx prisma migrate dev
npx prisma db seed
```

### 5. Lancer le Projet
```bash
npm run dev
# Ouvrir http://localhost:3000
```

## 📧 Support & Contact

Pour toute question sur les diagrammes ou le projet :

- 📖 Documentation : `DOCUMENTATION_DIAGRAMMES.md`
- 🎨 Visualisation : `diagrams.html`
- 💬 Issues GitHub : Pour rapporter des problèmes
- 📧 Email équipe : medflow@example.com

## 📝 Licence

Ce projet est destiné à un usage éducatif dans le cadre du programme académique.

## 🙏 Remerciements

Merci d'utiliser ces diagrammes pour le développement de votre projet MedFlow !

---

**Version** : 1.0  
**Date** : Décembre 2025  
**Statut** : ✅ Complet et validé
