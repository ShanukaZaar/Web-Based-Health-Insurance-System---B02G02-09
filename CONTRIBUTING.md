# Contribution & Git Workflow Guidelines

Welcome to the **Web-Based Health Insurance Management System** project (SE2030 - Software Engineering, SLIIT). Please follow these git branching standards, Pull Request (PR) policies, and commit message conventions to maintain code quality and clean collaboration.

---

## 1. Branching Strategy

We follow a GitFlow-inspired branching model:

- `main`: **Protected branch.** Always stable, deployable production-ready code. Direct pushes are disabled.
- `develop`: **Integration branch.** Main development branch where completed module features are merged and tested together.
- `feature/<module-name>`: Feature branches created from `develop` for specific module implementations (must be lowercase and hyphenated).

### Feature Branch Examples:
- `feature/policy-management`
- `feature/claim-management`
- `feature/payment-management`
- `feature/hospital-management`
- `feature/customer-support`
- `feature/admin-reporting`

---

## 2. Pull Request (PR) Workflow

1. **Branch Off**: Always create your feature branch from an up-to-date `develop` branch:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/claim-management
   ```

2. **Develop & Commit**: Make logical, atomic commits adhering to the commit message convention below.

3. **Open PR**: Create a Pull Request targeting the `develop` branch (never directly to `main`).

4. **Code Review**: Each PR **requires at least one teammate review & approval** before merging into `develop`.

5. **Merge**: Once approved and all automated checks pass, squash-and-merge or merge your branch into `develop`.

---

## 3. Commit Message Convention

Follow the standard format: `<module>: <short description in lowercase>`

### Examples:
- `claim: add claim entity skeleton and repository`
- `policy: implement policy creation controller endpoint`
- `payment: configure Stripe payment gateway service wrapper`
- `hospital: setup hospital lookup DTO and repository`
- `support: add support ticket response component`
- `admin: update user role management service logic`
- `docs: update architecture diagram in README`

---

## 4. Local Development Checklist

Before pushing your branch or opening a PR:
- [ ] Backend compiles without errors (`mvn clean compile`)
- [ ] Backend runs successfully and health endpoint responds (`GET /api/health`)
- [ ] Frontend builds without errors (`npm run build`)
- [ ] No database credentials, API keys, or `.env` files are committed.
