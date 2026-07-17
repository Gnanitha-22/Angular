# Task & Resource Portal

Quick start, testing, and deployment instructions.

Setup
- Install dependencies: `npm install`
- Start mock API (json-server): `npx json-server --watch db.json --port 3000`
- Start dev server: `npm start` (or `ng serve`)

Build
- Development build: `ng build --configuration development`
- Production build: `ng build --configuration production`

Tests
- Unit tests: `ng test` (Karma/Jasmine)
- E2E (Playwright): install Playwright and run `npx playwright test`

Notes
- App uses lazy loaded standalone components and OnPush change detection for performance.
- ApiService includes a simple GET cache to de-duplicate requests.
# TaskResourcePortal

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.21.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
