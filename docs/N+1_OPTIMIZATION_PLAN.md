# N+1 Optimization Plan

## 1. Confirmed N+1 Problem

### SEO Status Check (Critical)
- **File:** `app/dashboard/management-seo/product/actions/get-all-products-seo.ts`
- **Problem:** For each product, fetch SEO for each locale (N x L queries)
- **Fix:** Fetch all SEO data in one query, then map in memory.

**Refactor Example:**
```ts
const products = await db.product.findMany({ ... });
const allSeoData = await db.globalSEO.findMany({
  where: {
    entityType: EntityType.PRODUCT,
    entityId: { in: products.map(p => p.id) },
    locale: { in: LOCALES }
  }
});
// Map SEO status in memory
```

## 2. Other Areas Checked (No N+1 Found)

- **Category Page Data:**
  - `productAssignments` is fetched as a relation, not in a loop. No N+1.
- **Product Fetching (Homepage, API):**
  - Uses `findMany` with `include` or `select` for relations. No N+1.
- **Purchase History, Orders, Offers, Inventory:**
  - All use `include` for nested data, not per-item queries. No N+1.
- **Sales Report, Product Performance:**
  - Data is fetched in bulk, then processed in memory. No N+1.

## 3. Deep Review: Seed/Admin Scripts

### **Seed Script: prisma/fashionSeedData.ts**
- **Potential N+1 Patterns:**
  - `seedAddresses`: Loops over users, creates addresses one by one (acceptable for seeding, not runtime).
  - `seedFashionSuppliers`, `seedFashionProducts`, `seedFashionOffers`, `seedOrders`, `seedReviews`, `seedCarts`: All use per-item creation in loops. This is common in seed scripts, but can be slow for large datasets.
  - `updateProductReviewCounts`: Loops over products, counts reviews per product (N+1 pattern). Could be optimized with aggregation if needed for large data.
- **Impact:**
  - No runtime impact. Only affects seed speed. Acceptable for most dev/test use, but can be optimized for very large datasets.

### **Admin Scripts: scripts/checkOrderAddressIntegrity.ts, scripts/migrate-addresses.ts**
- No N+1 patterns found. Scripts use single/bulk queries or call helpers that do not loop DB calls per item.

### **Recommendation:**
- For seed scripts, N+1 is not critical unless you seed very large datasets. If needed, batch creation or aggregation can be added for speed.
- For admin scripts, no action needed.

## 4. Safe Rollout Checklist

- [x] Refactor SEO status check to use a single query for all SEO data
- [ ] (Optional) Optimize seed script review count update with aggregation
- [ ] Add tests to compare old and new results for identical output
- [ ] Deploy to staging with fake data
- [ ] Monitor for errors or data mismatches
- [ ] Roll out to production after confirming no regressions

## 5. Testing Plan

- [ ] Test with 1, 10, 100+ products
- [ ] Test with missing SEO data for some locales
- [ ] Test with all locales present
- [ ] Compare before/after results for exact match

## 6. Rollback Plan

- [ ] Keep old function as backup
- [ ] Use feature flag to toggle between old and new
- [ ] Rollback immediately if any issues are found

---

**Summary:**
- Only the SEO status check is a true N+1 problem in your runtime codebase.
- Seed scripts use per-item creation, which is normal and not critical, but can be optimized for speed if needed.
- Admin scripts are already efficient.
- The planned refactor is safe, tested, and easy to roll back if needed. 