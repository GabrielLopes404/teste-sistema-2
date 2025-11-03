# Design Guidelines: Araujo Finanças - Sistema de Gestão Financeira SaaS

## Design Approach

**Selected Approach:** Design System (Material Design principles) with inspiration from modern financial platforms like Stripe Dashboard, Brex, and Linear for clean data presentation.

**Justification:** Financial management systems require:
- Clear information hierarchy for complex data
- Trustworthy, professional aesthetic
- Consistent patterns for repeated interactions
- Efficient data scanning and action-taking
- Data visualization clarity

**Key Principles:**
1. **Data Clarity First**: Information must be scannable and actionable at a glance
2. **Trust Through Consistency**: Predictable patterns reduce cognitive load
3. **Progressive Disclosure**: Complex features revealed contextually
4. **Responsive Precision**: Exact alignment and spacing convey professionalism

## Typography System

**Font Families:**
- Primary: Inter (via Google Fonts) - for UI, data, and body text
- Monospace: JetBrains Mono - for monetary values, account numbers, dates

**Type Scale:**
- Display: text-4xl (36px) font-bold - Dashboard headers, page titles
- Heading 1: text-3xl (30px) font-semibold - Section titles
- Heading 2: text-2xl (24px) font-semibold - Card headers, modal titles
- Heading 3: text-xl (20px) font-medium - Subsection headers
- Body Large: text-base (16px) font-normal - Primary content, form labels
- Body: text-sm (14px) font-normal - Table content, secondary text
- Caption: text-xs (12px) font-medium - Labels, metadata, status badges
- Monetary Values: text-lg (18px) font-mono font-semibold - All currency displays

## Layout System

**Spacing Primitives:** Use Tailwind units of 2, 4, 6, and 8 for consistent rhythm
- Micro spacing: p-2, gap-2 (8px) - tight groups, badges
- Component spacing: p-4, gap-4 (16px) - cards, form fields
- Section spacing: p-6, gap-6 (24px) - page sections, modals
- Major spacing: p-8, gap-8 (32px) - dashboard layout, page margins

**Grid System:**
- Main container: max-w-7xl mx-auto px-6
- Dashboard grid: 12-column responsive grid
- Card grids: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4

**Application Structure:**
```
┌─────────────────────────────────────────┐
│ Top Navigation Bar (h-16)              │
├──────┬──────────────────────────────────┤
│      │                                  │
│ Side │   Main Content Area              │
│ Nav  │   (Dashboard/Tables/Forms)       │
│ 64px │                                  │
│      │                                  │
└──────┴──────────────────────────────────┘
```

## Component Library

### Navigation Components

**Sidebar Navigation:**
- Fixed left sidebar: w-64, min-h-screen
- Logo area: h-16 with company branding "Araujo Finanças"
- Navigation items: p-3, rounded-lg transitions
- Icon + text pattern: 20px icons, text-sm labels
- Active state: distinct visual treatment
- Section grouping with dividers and labels
- Sections: Dashboard, Lançamentos, Fluxo de Caixa, Conciliação, Relatórios, Contatos, Configurações

**Top Bar:**
- Height: h-16, fixed positioning
- Right side: notification bell, user profile dropdown, multi-company switcher
- Search bar: max-w-md with icon prefix
- Breadcrumb navigation for deep pages

### Dashboard Components

**Metric Cards:**
- Grid layout: 4 cards in row (responsive to 2, then 1)
- Structure: Icon, Label (text-sm), Value (text-2xl font-semibold mono), Change indicator (text-xs with arrow)
- Metrics: Saldo Atual, Receitas do Mês, Despesas do Mês, Contas Pendentes
- Padding: p-6, rounded-xl, border

**Chart Containers:**
- Full-width or 2-column layouts
- Header: title (text-xl) + period selector dropdown
- Chart area: min-h-80 with proper padding
- Chart types: Line (cash flow trends), Bar (monthly comparison), Donut (category breakdown)

**Quick Actions Panel:**
- Prominent buttons for: Nova Conta a Pagar, Nova Conta a Receber, Importar OFX, Gerar Relatório
- Layout: 2x2 grid on desktop, stack on mobile
- Each action: icon, title, subtitle

### Data Display Components

**Transaction Tables:**
- Header row: sticky, font-medium, text-xs uppercase tracking-wide
- Columns: Data, Descrição, Categoria, Valor, Status, Ações
- Row height: h-16 with p-4
- Alternating row treatment for readability
- Status badges: rounded-full px-3 py-1 text-xs font-medium
- Monetary values: right-aligned, monospace font
- Action buttons: icon-only, grouped at row end
- Pagination: bottom with showing "X-Y of Z results"

**Status Badges:**
- Pago, Pendente, Vencido, Agendado
- Size: px-3 py-1, rounded-full
- Font: text-xs font-medium uppercase tracking-wide

**Filter Bar:**
- Positioned above tables: flex layout
- Components: date range picker, category select, status multiselect, search input
- Height: h-12 inputs
- Reset filters button (text-sm link)

### Form Components

**Input Fields:**
- Standard height: h-12
- Border: rounded-lg, border width 1px
- Labels: text-sm font-medium mb-2
- Helper text: text-xs mt-1
- Icons: 20px, positioned left or right
- Currency inputs: monospace font with R$ prefix

**Form Layouts:**
- Two-column grid for related fields (lg:grid-cols-2 gap-6)
- Full-width for text areas and complex selects
- Form sections separated by mb-8
- Action buttons: right-aligned, primary + secondary pattern

**Date/Time Pickers:**
- Calendar overlay: rounded-xl shadow-2xl
- Month/year navigation
- Selected date highlighting
- Quick presets for common ranges (Hoje, Esta Semana, Este Mês, etc.)

### Modal & Overlay Components

**Modals:**
- Centered overlay with backdrop blur
- Content: max-w-2xl for forms, max-w-4xl for data views
- Header: text-2xl font-semibold, close button
- Body: p-6 with overflow-scroll
- Footer: border-top, p-4, action buttons right-aligned

**Slide-over Panels:**
- Right-side drawer for quick views/edits
- Width: w-96 or w-1/3
- Transaction details, contact info, quick filters

### Special Components

**Conciliação Bancária Interface:**
- Split view: imported transactions (left) vs system transactions (right)
- Drag-and-drop matching interface
- Match confidence indicators
- Bulk actions toolbar

**DRE Report Layout:**
- Hierarchical structure with indentation
- Expandable/collapsible sections
- Subtotals and grand totals with visual emphasis
- Print-friendly layout option
- Export buttons (PDF, Excel)

**Fatura Preview:**
- Document-style layout with proper margins
- Company header with logo placement
- Line items table
- Totals section: subtotal, taxes, total
- Payment instructions area

**Multi-empresa Switcher:**
- Dropdown in top bar
- Company logo thumbnails + names
- Current company highlighted
- "Adicionar Empresa" action at bottom

## Interaction Patterns

**Loading States:**
- Skeleton screens for tables and cards
- Shimmer animation for perceived performance
- Inline spinners for button actions

**Empty States:**
- Icon (96px) centered
- Heading + description
- Primary CTA button
- Illustration or graphic when appropriate

**Error States:**
- Inline field validation with text-xs messages
- Toast notifications for system errors (top-right, auto-dismiss)
- Confirmation dialogs for destructive actions

**Hover States:**
- Table rows: subtle background change
- Buttons: slight shadow elevation
- Cards: border emphasis or subtle lift

## Responsive Behavior

**Breakpoints:**
- Mobile: < 768px - Stack all columns, collapsible sidebar to hamburger
- Tablet: 768px-1024px - 2-column layouts, persistent sidebar icon-only option
- Desktop: > 1024px - Full layouts as specified

**Mobile Adaptations:**
- Tables become card lists with key information
- Filters in collapsible drawer
- Bottom navigation for quick actions
- Touch-friendly spacing (min h-12 for tap targets)

## Accessibility Standards

- All interactive elements: min h-12 (48px) for touch targets
- Form labels: properly associated with inputs
- Status communicated beyond only visual treatment (icons + text)
- Keyboard navigation: clear focus indicators (ring-2 ring-offset-2)
- ARIA labels for icon-only buttons
- Sufficient contrast ratios for all text
- Skip navigation link for keyboard users

## Images

**Logo/Branding:**
- Company logo "Araujo Finanças" in sidebar: approx 180x48px area, centered
- Favicon and mobile app icon sizes

**Empty State Illustrations:**
- No transactions: financial document illustration
- No contacts: people/network illustration  
- No reports: chart/graph illustration
- All illustrations: max 240px, centered, minimalist line-art style

**User Avatars:**
- Profile pictures: 32px (nav), 40px (dropdowns), 96px (profile page)
- Initials fallback for missing photos

**Dashboard Visuals:**
- Optional: Small decorative financial icons (coins, graphs, documents) at 24px in metric cards - use sparingly for visual interest without clutter