# VocabReact - AI Coding Agent Instructions

## Project Overview
**VocabReact** is a React + Vite vocabulary/dictionary web application with React Router for URL-based navigation. The project uses JavaScript (JSX) with minimal ESLint rules for code quality.

### Architecture
- **Tech Stack**: React 19.2+, Vite 7.2+, React Router v6, vanilla CSS
- **Entry Point**: [src/main.jsx](src/main.jsx) → renders [src/App.jsx](src/App.jsx)
- **Routing**: BrowserRouter in App.jsx with route definitions
- **Pages**: [src/pages/](src/pages/) directory contains page components (Home, Practice, Lists, About)
- **Core Components**:
  - [src/components/Menu/Menu.jsx](src/components/Menu/Menu.jsx) - Responsive header with React Router Link navigation
  - [src/components/Content/Content.jsx](src/components/Content/Content.jsx) - Main content wrapper
  - [src/components/VocabularyTable/VocabularyTable.jsx](src/components/VocabularyTable/VocabularyTable.jsx) - Paginated vocabulary data table
  - [src/components/Pagination/Pagination.jsx](src/components/Pagination/Pagination.jsx) - Reusable pagination controls

## API Integration

### Vocabulary API
**Endpoint**: `https://localhost:44363/Vocabulary/Search`
**Parameters**:
- `draw=1` (constant, always 1)
- `start` (page offset: `(pageNum - 1) * pageLength`)
- `length` (results per page, currently 10)

**Response Structure**:
```json
{
  "data": [
    {"id": 17, "spelling": "a", "pronunciation": "æɪ", "definition": "一個", "updatedDate": "2014-05-17"},
    ...
  ],
  "draw": 1,
  "recordsTotal": 9685,
  "recordsFiltered": 9685
}
```

## Component Patterns

### Routing & Navigation
- **App.jsx**: Wraps app with `BrowserRouter` and defines `<Routes>` with path-based routing
- **Menu.jsx**: Uses `useLocation()` hook to get current pathname, renders `<Link>` elements for navigation
- **Active state**: Determined by comparing `location.pathname` to link path, applies `menu__link--active` class
- Pages located in [src/pages/](src/pages/) directory and imported into App.jsx Route definitions

### State Management
- **Menu.jsx**: Local `open` state for mobile navigation toggle
- **VocabularyTable.jsx**: Manages data fetching, loading, error, and current page states
- No global state library; keep state local to components

### CSS Architecture
- **BEM naming convention**: `component__element--modifier` (e.g., `menu__bar`, `menu__link--active`)
- **Component structure**: Each component has dedicated `.css` file co-located with `.jsx`
- **Global styles**: [src/index.css](src/index.css) for resets, [src/App.css](src/App.css) for layout
- **Table styling**: `.vocabulary-table__*` classes follow BEM for table, headers, cells, rows

### Navigation & Accessibility
- Use semantic HTML (`<header>`, `<nav>`, `<main>`, `<button>`)
- Menu navigation uses React Router `<Link>` components (renders as `<a>` tags)
- Include `aria-expanded`, `aria-controls`, `aria-hidden` for accessible interactive elements
- Active page indicated with `.menu__link--active` class determined by `useLocation()` hook

### Data Fetching Pattern
VocabularyTable uses:
1. `useState` for data, loading, error, currentPage, totalRecords
2. `useEffect` to fetch on mount (page 1)
3. `fetchVocabulary(pageNum)` function passed to Pagination `onPageChange` callback
4. Error handling with try-catch, user-facing error message in UI

## Development Workflow

### Commands
```
npm run dev      # Start Vite dev server with HMR (http://localhost:5173)
npm run build    # Production build to dist/
npm run lint     # Run ESLint checks
npm run preview  # Preview production build locally
```

### Build Configuration
- [vite.config.js](vite.config.js) uses `@vitejs/plugin-react` for JSX and Fast Refresh
- HMR enabled for live component updates during development
- ESLint config: [eslint.config.js](eslint.config.js) with React Hooks and React Refresh plugins

## Key Patterns

### When Adding Components
1. Create folder: `src/components/ComponentName/`
2. Add files: `ComponentName.jsx` and `ComponentName.css`
3. Use functional components with hooks
4. Export as default export
5. Co-locate styles with component

### When Adding New Pages/Views
1. Create component in [src/pages/](src/pages/) (e.g., `NewPage.jsx`)
2. Import in [src/App.jsx](src/App.jsx)
3. Add new `<Route>` in App's Routes section with path and element
4. Add navigation item to Menu navItems array with path and label

### When Modifying Navigation
- Update Menu navigation items array in [src/components/Menu/Menu.jsx](src/components/Menu/Menu.jsx)
- Menu uses `<Link>` from React Router pointing to route paths
- Active state determined by `useLocation().pathname` comparison
- Mobile menu closes automatically after navigation via `handleNavigation()` callback

## Common Issues & Solutions

- **HMR not working**: Restart dev server or check Vite port (default 5173)
- **Component not rendering**: Check that routes are properly defined in App.jsx Routes section
- **API 403/SSL errors**: Verify `https://localhost:44363` endpoint is accessible; Vite proxy configured with SSL bypass
- **Pagination not updating**: Ensure `onPageChange` callback properly triggers `fetchVocabulary(pageNum)`
- **Styling conflicts**: Verify BEM class names are unique; use component prefix consistently
- **Navigation not working**: Ensure pages are imported in App.jsx and routes are defined
