# Vorakarn Florist

Static Thai florist website, ready for Cloudflare Pages.

## Pages

- Home: `/`
- สินค้าของเรา: `/flowers/` — พวงหรีด, แจกันและช่อดอกไม้, งานตกแต่งสถานที่
- Gallery: `/gallery/`
- About: `/about/`
- Contact: `/contact/`

## Cloudflare Pages

Connect this repository, select no framework, leave the build command empty, and use the repository root as the output directory. Keep `_redirects` at the root.

## Local preview

Run `python3 -m http.server 8000` from this folder and open `http://localhost:8000`.

## Google Analytics

Production pages use GA4 measurement ID `G-WRJ5EJ80PT` via `assets/analytics.js`. Localhost and Cloudflare preview hosts do not load the Google tag.

Custom events:
- `contact_click`: `contact_method` is only `phone` or `facebook`.
- `inquiry_start`: first focus in an inquiry form per page load.
- `inquiry_submit`: valid browser form submission, before FormSubmit processing. This does not confirm email delivery.

No customer field values are read by the tracking code. Initial page/referrer URLs omit arbitrary queries and fragments; known gallery categories are retained. Advertising personalization and Google signals are disabled in the tag configuration.

After merging and deploying, use Google Analytics Realtime or DebugView to verify collection. Review Enhanced Measurement settings in the GA4 web stream: turn off Form interactions if reporting only the custom inquiry events, and turn off browser-history page views if URLs might contain customer data. Do not configure user-provided data collection for inquiry fields. Google tag/consent and privacy settings are managed separately in the Analytics account.
