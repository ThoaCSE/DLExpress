# Replacement Table

| Target file | Reference source | Replacement or alignment | Notes |
| --- | --- | --- | --- |
| `frontend/buyer-app/src/index.css` | `Userview_shopingcart and shop payment/userview/index.css` | Replace the generic `Segoe UI` baseline with a shared Poppins baseline | Applied in the outer target app |
| `frontend/admin-app/src/index.css` | `Shop_Partner_View_JSX-main/shopsview/src/index.css` | Align body font, reset, and common card/button styling | Applied in the outer target app |
| `frontend/seller-app/src/index.css` | `Shop_Partner_View_JSX-main/shopsview/src/index.css` | Align body font, reset, and common card/button styling | Applied in the outer target app |
| `frontend/buyer-app/src/App.jsx` | `Userview_shopingcart and shop payment/userview/App.jsx` | Compare route layout and shell structure | Router wrapper now lives in `main.jsx` |
| `frontend/admin-app/src/App.jsx` | `Shop_Partner_View_JSX-main/shopsview/src/App.jsx` | Compare layout shell and routing style | Router wrapper now lives in `main.jsx` |
| `frontend/seller-app/src/App.jsx` | `Shop_Partner_View_JSX-main/shopsview/src/App.jsx` | Compare layout shell and routing style | Router wrapper now lives in `main.jsx` |
| `frontend/*/src/main.jsx` | Both reference frontends | Keep the same React root pattern and import ordering | BrowserRouter now owns the root wrapper |
| `backend/pom.xml` | `Shop_Partner_View_JSX-main/groceries/pom.xml` | Compare dependency naming and versions | Do not copy verbatim because the backend domains differ |
| `backend/src/main/resources/application.properties` | `Shop_Partner_View_JSX-main/groceries/src/main/resources/application.properties` | Compare config keys and naming style | Keep `foodie`-specific values in the target backend |

## Naming Standard

- Components: PascalCase, for example `LoginPage`, `StorePage`, `FoodDetails`.
- Hooks and helpers: camelCase, for example `getAuth`, `cartService`, `orderService`.
- Frontend CSS: one shared font baseline per app, using Poppins as the default family.
- Avoid inconsistent names like `contants.js`; prefer `constants.js` when you rename files later.
