# Mobile campaign navigation and Track page

## What will change
- Add a fixed, mobile-only bottom navigation with Home, Track, Updates, and Join tabs; keep the current landing page as Home.
- Create a distinct, thread-inspired Track page focused on public accountability. Clearly distinguish campaign priorities from verified past achievements.
- Add Updates and Join pages that make existing notification/install and supporter-sharing/voter-registration actions easy to reach without repeating the landing-page copy.
- Add route-specific metadata and keep the private alert-sending page outside the supporter navigation.

## Technical details
- Implement the navigation in the shared TanStack root shell and add matching route files for all tabs.
- Use the existing campaign design tokens and controls; preserve desktop layout and reserve mobile space so the bar does not cover page content.
- Add/update route coverage and verify the mobile navigation and tab destinations in the running preview.