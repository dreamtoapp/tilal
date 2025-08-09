# cart-controller

Short, clear purpose for each file:

- `cartStore.ts`: Zustand store for all cart state and sync logic (local + server).
- `CartButtonWithBadge.tsx`: Cart icon button with live badge/count, opens cart dropdown.
- `CartDropdown.tsx`: Cart dropdown/popup showing items, totals, and actions.
- `AddToCartButton.tsx`: Button to add a product to the cart (optimistic UI, server sync).
- `CartQuantityControls.tsx`: Controls to increase/decrease item quantity in the cart. 