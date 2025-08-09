# SSR Infinite Scroll Action Plan

---

## AI Prompt: Full Description

**You are working on a Next.js e-commerce homepage that must combine the speed, SEO, and reliability of SSR/SSG with the smooth, modern user experience of infinite scroll.**

- Your goal is to ensure that the first page of products is always server-rendered (SSR/SSG) for SEO and fast initial load, while additional products are loaded on demand as the user scrolls, using client-side fetching.
- The URL should always reflect the current page, updating as the user scrolls, so that sharing and refreshing always shows the correct product set.
- All product rendering after the first page must be done using React (not HTML injection) to avoid hydration and styling issues.
- This plan is your step-by-step checklist and reference for implementing, testing, and debugging SSR infinite scroll in Next.js App Router.
- If you encounter bugs or unexpected behavior, consult the Reference & Debugging Notes section below for quick solutions and explanations.
- Use this file as your single source of truth for best practices, implementation steps, and troubleshooting during development and QA.

---

# SSR Infinite Scroll Action Plan

## Goal
Combine SSR/SSG speed and SEO for every product page with the smooth, non-reloading feel of infinite scroll.

---

## Action Steps

1. **SSR/SSG for All Product Pages**
   - [x] Ensure `/products?page=N` (or homepage equivalent) supports SSR/SSG and returns correct products for any page.
   - [x] Each page is accessible and SEO-friendly (first page SSR, subsequent pages client fetch).

2. **Partial HTML/API Endpoint for Product Grid**
   - [x] Create an API route (`/api/products-grid?page=N`) that returns JSON with products for the requested page.
   - [x] This endpoint uses the same SSR/SSG logic as the main page.

3. **Client-Side Infinite Scroll Logic**
   - [x] On scroll near the bottom, fetch the next page's products from the API endpoint.
   - [x] Append new products to the grid using React rendering (not HTML injection).

4. **URL Updates (App Router)**
   - [x] Use `router.replace` to update the URL with the new page number as the user scrolls (no full reload, shallow routing not needed in App Router).
   - [x] Ensure the page does not reload, but the URL always matches the current view.

5. **SSR/SSG on Refresh or Direct Link**
   - [x] On refresh or direct navigation, SSR/SSG renders the correct page and product grid instantly (for the requested `?page=N`).
   - [ ] User sees the same products and (optionally) scroll position as before.

6. **Scroll Restoration (Optional, for UX)**
   - [ ] Optionally, restore scroll position on refresh or back/forward navigation for a seamless experience.

7. **Testing & SEO**
   - [ ] Test for speed, smoothness, and correct data on all pages.
   - [ ] Confirm SEO bots can crawl all product pages (first page SSR, others client fetch).
   - [x] Confirm URLs are shareable and always reflect the current view.

---

## Reference & Debugging Notes
- **If you see `?page=2` after first scroll:** This is expected; the first page is SSR, the next is client-fetched, and the URL updates to the latest page loaded.
- **If products do not appear after scrolling:** Check `/api/products-grid` returns valid JSON and the client appends products using React, not HTML injection.
- **If you see hydration or styling issues:** Ensure all product rendering is done via React, not `dangerouslySetInnerHTML`.
- **If URL does not update:** Make sure `router.replace(?page=${page})` is used after each successful fetch.
- **If you want scroll restoration:** Implement it using the browser history API or a scroll restoration library.
- **For SEO:** Only the first page is SSR/SSG and SEO-friendly; subsequent pages are client-fetched (standard for infinite scroll).

---

**Use this checklist and reference section while testing. If you encounter a bug, check the relevant note above before debugging further.** 