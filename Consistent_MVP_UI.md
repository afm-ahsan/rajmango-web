Unify RajMango Admin UI look and feel step by step.

Goal:
Create a professional, consistent MVP UI across all RajMango web pages without changing business logic or API contracts.

Scope:
Standardize:
- List pages
- Page headers
- Buttons
- Modals
- Loading states
- Empty page messages
- Action buttons
- Search/filter area
- Tables
- Forms
- Toast/error messages

Step 1: Audit existing UI
1. Review all admin/customer pages.
2. Identify the best existing page design to use as the base pattern.
3. Do not redesign from scratch; reuse existing theme/components.

Step 2: Create reusable UI standards
Create/standardize shared patterns for:
1. Page title + subtitle
2. Card/container layout
3. Toolbar with search/filter/add button
4. Table layout
5. Empty state
6. Loader
7. Action buttons
8. Modal header/body/footer
9. Form field spacing and validation messages

Step 3: Standardize buttons
Rules:
- Primary action: solid primary button
- Secondary action: light/outline button
- Delete/danger: red/danger button
- View/Edit/Delete action buttons must use same size, icon style, tooltip, and spacing
- Save buttons should show button loader only during submit

Step 4: Standardize modals
Rules:
- Same modal width pattern
- Same header title format
- Same close button behavior
- Same footer button order:
  Cancel/Close left or secondary
  Save/Update primary
- View mode must be read-only
- No duplicate loader inside modal

Step 5: Standardize loaders
Rules:
- Page/list loading: local page/table loader
- Submit loading: button loader
- Do not show global + local loader for same operation
- Use finalize() for all API calls
- Empty state appears only after loading finishes

Step 6: Standardize empty states
Rules:
- Show friendly message
- Optional icon
- Optional action button if user can create
- Never show empty state while loading

Step 7: Apply gradually
Apply the unified pattern in this order:
1. Courier Providers
2. Courier Stations
3. Area Mapping
4. Mango Types
5. Mango Availability
6. Customers
7. Payments
8. Expense Types
9. Expenses
10. Feedback
11. Complaints
12. Policies
13. Users
14. Role Management
15. Reports

Step 8: Keep MVP safe
Rules:
- Do not change API contracts.
- Do not change permission logic.
- Do not rewrite working business logic.
- Do not introduce large new libraries.
- Reuse existing theme classes/components.
- Fix only UI consistency and obvious UX bugs.

Step 9: Final verification
Verify:
- Build passes
- No console errors
- Loader works
- Empty states work
- CRUD modals work
- Action buttons are aligned
- Mobile/tablet layout is acceptable
- Admin and customer pages still work

Additional mandatory requirement: full responsive design.

The unified UI must be fully responsive and usable from:
- Mobile
- Tablet
- iPad
- Laptop
- Desktop

Responsive rules:
1. List pages must not break on small screens.
2. Tables should support horizontal scroll or responsive card layout on mobile.
3. Search/filter/add button toolbar must stack cleanly on mobile.
4. Action buttons must remain usable on touch devices.
5. Modals must fit small screens and scroll internally if needed.
6. Forms must become single-column on mobile and multi-column only on larger screens.
7. Page padding, font size, button size, and spacing must adapt properly.
8. Sidebar/header must work correctly on mobile and tablet.
9. Images/cards/catalog/profile sections must resize cleanly.
10. Test with browser responsive mode for:
   - 375px mobile
   - 768px tablet
   - 1024px iPad/laptop
   - 1366px desktop

Expected result:
RajMango web has one unified, professional UI pattern across list pages, buttons, modals, loaders, empty states, and action buttons.
RajMango should look professional and remain fully usable from any device.