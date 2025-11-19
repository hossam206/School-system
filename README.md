# EREP-V2
# Project Architecture Overview

This project follows a clean, scalable, and maintainable architecture optimized for **Next.js 15/16**, **TypeScript**, **Zustand**, **React Query**, **ShadCN UI**, and modern frontend best practices.

---

## Folder Structure

app/
├── (public)/ # Public pages
├── dashboard/ # Auth-protected dashboard
├── api/ # Server route handlers
├── layout.tsx # App layout
└── globals.css # Global styles

components/
├── ui/ # ShadCN UI components
├── common/ # Navbar, Footer, Cards, etc.
└── features/ # Feature-scoped UI components

stores/
├── user.store.ts # User/auth state (Zustand)
├── theme.store.ts # Light/dark mode state
└── filters.store.ts # Filters & search state

hooks/
├── useAuth.ts # Authentication logic
└── useDebounce.ts # Debounce helper hook

lib/
├── fetcher.ts # Fetch wrapper for React Query
├── axios.ts # (Optional) Axios client
├── utils.ts # Helper utilities
└── constants.ts # API base URLs, env vars

services/
├── auth.service.ts # Authentication API logic
├── user.service.ts # User-related API requests
└── properties.service.ts # Properties API logic

queries/
├── auth.query.ts # Auth React Query hooks
├── user.query.ts # User React Query hooks
└── properties.query.ts # Properties React Query hooks

types/
├── auth.types.ts # Auth-related types
├── user.types.ts # User models
└── property.types.ts # Property-related types

yaml
Copy code

---

##  Architecture Overview

This structure ensures:

- ✔ Clean separation of responsibilities  
- ✔ High code maintainability  
- ✔ Scalable module-based organization  
- ✔ Efficient React Query + Zustand integration  
- ✔ Easier onboarding for new developers  

---

## Technologies Used

- **Next.js 15/16 (App Router)**
- **TypeScript**
- **React Query**
- **Zustand**
- **ShadCN UI**
- **Tailwind CSS**
- **Fetch API / Axios**

---

## Layer Responsibilities

### **app/**
Handles routing, layouts, protected areas, and global styles.

### **components/**
Reusable UI components:
- `ui/` = ShadCN  
- `common/` = shared UI  
- `features/` = module-specific UI  

### **stores/**
Global Zustand stores separated by domain.

### **hooks/**
Reusable logic hooks.

### **lib/**
Utilities, helpers, API clients, constants.

### **services/**
Handles all API requests — a clean abstraction layer.

### **queries/**
React Query hooks calling services & handling caching.

### **types/**
All TypeScript models & interfaces.

---

## Best Practices

- Use **services/** for all API logic  
- Use **queries/** for data fetching with caching  
- Keep **components/** focused on UI only  
- Use **Zustand** only for global UI states (keep it lean)  
- Store constants & API URLs inside **lib/constants.ts**  

---

If you'd like a **more advanced README** (installation, scripts, environment variables, badges, screensh


---Note on Project Flexibility

This architecture is not final. Folder structure, naming conventions, and implementations may evolve as the project grows, UI/UX requirements update, or backend specifications change. All modules are designed to stay flexible and can be refactored or extended anytime based on project needs.
