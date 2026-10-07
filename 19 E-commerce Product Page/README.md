# 19 - E-commerce Product Page

## Description
A complete single-product storefront page (wireless headphones) with image gallery, color/style variants, live pricing, quantity picker, slide-out cart, and customer reviews — all persisted in `localStorage`. Product imagery is generated as inline SVG so there are **no external assets to break**.

## Features
- 4-view gallery with clickable thumbnails that recolor per selected swatch
- Color swatches + style chips (radiogroup semantics, ARIA checked states)
- Price updates per style with strikethrough compare-at price
- Quantity stepper clamped 1–10
- Add to Cart / Buy Now → slide-in cart drawer with remove buttons & totals
- Checkout flow with confirmation toast; cart survives reload
- Review form with interactive star picker; average rating recalculated live
- Sticky navbar with live cart-count badge; responsive 2-col → 1-col layout

## Technologies Used
HTML5, CSS3 (Grid, Flexbox, transitions), Vanilla JavaScript, localStorage, inline SVG

## How to Run
```bash
cd "19 E-commerce Product Page"
python3 -m http.server 8000   # or open index.html directly
```

## Main Functionality
Choose color & style → set quantity → add to cart → open the drawer to review/remove items → checkout clears the cart with a success toast. Write a review with a star rating and it prepends to the list and updates the product's average score.
