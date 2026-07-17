# Architecture Overview

This document describes the high-level architecture for the Task & Resource Portal.

 - Frontend: Angular 18 standalone components, OnPush change detection, lazy-loaded routes.
 - State: `AppStateService` central store built with RxJS `BehaviorSubject` and derived selectors.
 - API: `ApiService` central HTTP client with simple GET caching and interceptors for auth, logging, loading and error handling.
 - Auth: `AuthService` (mock JWT in this repo) with `SecureStorageService` and guards (`authGuard`, `roleGuard`).
 - UI: Material components, responsive layout, dashboard charts (ApexCharts), Kanban board for tasks.
 - Tests: Jasmine/Karma unit tests and Playwright for end-to-end.
