# Johnstone Loyatum campaign platform upgrade

## Delivery approach
- Execute the six requested phases in order, checking the affected pages and database behavior after each phase. The existing campaign identity, four supporter tabs, push notifications, and verified-content standard remain in place.
- Keep public records empty until the campaign supplies verified content; remove illustrative Track posts and avoid fabricated events or announcements.

## Phases
1. **Secure data foundation:** add profiles, separate Super Admin/Editor roles, site settings, articles, activities, agenda items, wards, media, private enquiries, and audit logs. Add explicit grants, role helpers, and RLS policies; keep public access limited to published content and deny public access to enquiries and audit records.
2. **Track and Updates:** replace Track samples with chronological, searchable, filterable activities; build an Updates archive and article-detail pages with accurate empty states and publication metadata.
3. **Join:** add a privacy-conscious enquiry form with client/server validation, consent, spam safeguards, confirmation, and private storage. Do not collect national ID or voter numbers.
4. **Admin:** replace the sample team desk with sign-in-only administration, separate roles, sign-out, and persisted content tools for articles, activities, media, agenda, enquiries, and settings. No public registration; the campaign owner must provision the first administrator.
5. **Public integration:** connect campaign pages and site-wide settings to published database content while preserving the current supporter navigation and distinguishing proposals from verified achievements.
6. **PWA and release checks:** add a safe offline fallback without caching private pages, refine page metadata and low-bandwidth behavior, then verify mobile/desktop routes, public visibility, form behavior, and protected administration.

## Technical details
- Use Lovable Cloud migrations for additive schema changes, explicit table grants, RLS, and server-side authorization. Keep profile fields separate from roles; use the existing generated browser client and authenticated server functions.
- Create route files alongside any new navigation targets, add page-specific metadata, and retain the existing design tokens. Use genuine campaign media only; do not promote the existing demo feed imagery as documentary content.
- Treat the initial administrator account and real campaign contact details/content as owner-supplied setup items, not invented values.