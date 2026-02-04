# Roadmap System Documentation

This folder contains a product roadmap tracking system with a markdown data store and interactive HTML visualization featuring **dual-schedule comparison** (Original vs Actual capacity-constrained).

## Files Overview

| File | Purpose |
|------|---------|
| `roadmap.md` | **Primary data store** — Human-readable markdown with timeline data, phases, and JSON export |
| `index.html` | **Interactive dashboard** — Self-contained HTML file with schedule toggle, hosted on GitHub Pages |
| `roadmap-viz.jsx` | **React component** — For embedding in React applications |
| `roadmap_rough_drawn_1.png` | Original hand-drawn roadmap sketch |

---

## Key Concepts

### Dev Units

A **dev unit** is the standard measure of developer effort:

```
1 dev unit = 1.5 developers
```

This allows fractional allocation (e.g., 0.5 units = 0.75 developers for part-time/support work).

**Common allocations:**
- `0.5 units` = 0.75 devs — Tail-end support, maintenance mode
- `1 unit` = 1.5 devs — Standard single-track work
- `1.5 units` = 2.25 devs — Medium complexity
- `2 units` = 3 devs — Full team focus
- `3 units` = 4.5 devs — High-intensity sprint (e.g., MVP launch support)

### Capacity Constraint

The team operates with an **average velocity of 6 developers**. This translates to approximately **4 dev units** of parallel capacity at any given time.

The visualization includes:
- **Red dashed capacity line** at 6 devs on the resource chart
- **Schedule toggle** to compare unconstrained vs capacity-constrained plans

### Phases

Features can have multiple **phases** with different resource allocations:

- **Ramp-up**: Start with more developers, then reduce
- **Ramp-down**: Finish with tail-end support at reduced capacity
- **Steady state**: Consistent allocation throughout

Example:
```
Bulk Licensing DRAMLA:
  Phase 1: 1 dev unit (Q2-Mid → Q3-Start) — Initial work
  Phase 2: 2 dev units (Q3, 1 month) — Main development
  Phase 3: 1 dev unit (2 weeks) — Wrap-up
```

### Categories

Features are grouped into **5 color-coded categories** with distinct hues:

| Category | Color | Hex | Description |
|----------|-------|-----|-------------|
| Core Platform | Blue | `#3B82F6` | Major infrastructure (NuMeta, Royalty Splitting, Mashups) |
| Maintenance | Amber | `#F59E0B` | Feedback, iteration, ongoing support |
| Features | Green | `#22C55E` | User-facing features (e-Signature, Multi-Profile, Label Accounts) |
| Licensing | Cyan | `#06B6D4` | Licensing workflows (Approvals, Bulk Licensing, Apply to License) |
| Platform | Slate | `#64748B` | Cross-platform optimization (Mobile) |

---

## Schedule Toggle (Original vs Actual)

The visualization supports **two schedule views**:

### Original Schedule
- Unconstrained parallel execution
- Peak capacity: ~12.5 developers
- All features scheduled as originally envisioned
- Useful for understanding ideal timeline

### Actual Schedule (6 dev capacity)
- Capacity-constrained to 6 developers
- Work serialized where necessary
- Some features pushed to later quarters
- Mashups extends into Q1 2027
- Reflects realistic execution plan

**To toggle:** Click the "Original" or "Actual (6 dev capacity)" buttons at the top of the visualization.

### Data Structure

The HTML contains two feature arrays:
```javascript
const originalFeatures = [...];  // Unconstrained schedule
const actualFeatures = [...];    // Capacity-constrained schedule
```

When adding or modifying features, update **both arrays** to keep schedules in sync.

---

## How to Edit the Timeline

### Option 1: Edit the HTML directly (quick changes)

Open `index.html` and find the `originalFeatures` and `actualFeatures` arrays:

```javascript
const originalFeatures = [
  {
    id: 1,
    name: "NuMeta Build Out",
    category: "core",
    phases: [
      { start: "2026-02-23", end: "2026-04-08", devUnits: 2, label: "Main Build" },
      { start: "2026-04-08", end: "2026-04-22", devUnits: 0.5, label: "Tail Support" }
    ]
  },
  // ... more features
];

const actualFeatures = [
  // Same features but with adjusted dates for capacity constraints
];
```

**To modify a feature:**
1. Find it by `name` or `id` in **both** arrays
2. Change `start`/`end` dates (format: `YYYY-MM-DD`)
3. Adjust `devUnits` as needed
4. Update or add `label` for phase descriptions

**To add a new feature:**
```javascript
{
  id: 16,  // Use next available ID
  name: "New Feature Name",
  category: "core",  // Must match a key in categoryColors
  phases: [
    { start: "2026-06-01", end: "2026-08-01", devUnits: 1.5, label: "Development" }
  ]
}
```

### Option 2: Edit roadmap.md (canonical source)

The markdown file contains:
1. **Feature Registry table** — Human-readable overview
2. **Detailed Timeline with Phases** — Week-by-week breakdown
3. **Mermaid Gantt** — For tools that support Mermaid
4. **JSON Data Export** — Machine-readable format

After updating `roadmap.md`, regenerate the HTML or manually sync the data.

---

## Visualization Features

### Interactive Elements

- **Schedule toggle**: Switch between Original and Actual views
- **Category pills**: Click to filter view to single category
- **Gantt bars**: Hover for tooltip with full details
- **Resource chart**: Hover for weekly breakdown by category
- **Horizontal scroll**: Timeline auto-extends and scrolls when features extend into future years

### Visual Encoding

- **Bar height** in Gantt = dev units (taller = more resources)
- **Bar color** = category
- **Slate vertical line** = MVP launch (Feb 9, 2026)
- **Red dashed line** = 6-dev capacity constraint
- **Stacked area chart** = cumulative team utilization by category

### Dynamic Timeline

The timeline **automatically extends** when features span beyond 2026:
- Detects maximum end date across all features
- Rounds up to end of quarter
- Generates additional month/quarter headers
- Shows year indicator on headers (e.g., "Jan '27", "Q1 '27")
- Enables horizontal scrolling for extended timelines

### Metrics Displayed

- **Dev-Weeks**: Total developer effort (devUnits × weeks × 1.25)
- **Peak Capacity**: Maximum concurrent developers needed
- **Avg Devs/Week**: Per-quarter average utilization
- **Timeline Range**: Shown in top-right (e.g., "2026" or "2026 – 2027")

---

## Technical Notes

### Date Handling

**Important:** Always use ISO date format `YYYY-MM-DD` for feature dates.

The code parses dates as **local time** (not UTC) to avoid timezone issues:
```javascript
const parseDate = (str) => new Date(str + 'T00:00:00');
const baseStartDate = new Date(2026, 0, 1);  // Jan 1, 2026 local time
```

**Why this matters:** `new Date('2026-01-01')` parses as UTC midnight, which becomes Dec 31, 2025 in US timezones. The code handles this by appending `T00:00:00` or using numeric constructors.

### Chart.js Stack Groups

The resource chart uses explicit stack groups to separate the capacity line:
```javascript
// Category datasets
{ ..., stack: 'categories' }

// Capacity line (not stacked with categories)
{ ..., stack: 'capacity' }
```

This ensures the capacity line renders at exactly y=6 rather than being added to the stacked total.

### Category Colors Structure

Each category requires 5 color values:
```javascript
categoryName: {
  bg: '#DBEAFE',           // Light background for pills/bars
  border: '#3B82F6',       // Border color
  text: '#1E40AF',         // Text color
  chartBg: 'rgba(59, 130, 246, 0.35)',  // Chart fill (with transparency)
  chartBorder: '#3B82F6'   // Chart line color
}
```

---

## Important Dates

| Date | Event |
|------|-------|
| Jan 6, 2026 | Q1 work begins (Invite System, Curation) |
| Feb 9, 2026 | **MVP Launch** |
| Feb 23, 2026 | NuMeta build begins |
| Mar 15, 2026 | Feedback & Iteration scales down to 1 dev |
| Jul 1, 2026 | Q3 begins, Feedback enters maintenance mode (0.5 dev) |
| Mar 1, 2027 | Mashups completion (Actual schedule) |

---

## Schema Reference

### Feature Object
```typescript
interface Feature {
  id: number;
  name: string;
  category: 'core' | 'maintenance' | 'licensing' | 'platform' | 'features';
  phases: Phase[];
}

interface Phase {
  start: string;      // ISO date: "YYYY-MM-DD"
  end: string;        // ISO date: "YYYY-MM-DD"
  devUnits: number;   // 0.5, 1, 1.5, 2, 3, etc.
  label?: string;     // Optional: "Main Build", "Tail Support", etc.
}
```

### Adding New Categories

In the HTML, add to `categoryColors`:
```javascript
newcategory: {
  bg: '#E0F2FE',
  border: '#0284C7',
  text: '#075985',
  chartBg: 'rgba(2, 132, 199, 0.35)',
  chartBorder: '#0284C7'
}
```

And to `categoryLabels`:
```javascript
newcategory: 'New Category'
```

**Tip:** Choose colors from distinct hue families to avoid confusion. Current palette uses Blue, Amber, Green, Cyan, and Slate.

---

## Tips for Roadmap Planning

1. **Watch the capacity line**: If the resource chart exceeds 6 devs, you're overcommitted for the Actual schedule
2. **Compare schedules**: Toggle between Original and Actual to see capacity impact
3. **Use phases**: Model ramp-up/ramp-down rather than flat allocation
4. **Track ongoing work**: Maintenance continues indefinitely at 0.5 units
5. **Filter by category**: Use category buttons to see workload per area
6. **Check quarterly balance**: Summary cards show if work is evenly distributed
7. **Mind the timeline extension**: If Actual schedule extends into 2027, plan accordingly

---

## Regenerating the Visualization

If you update `roadmap.md`, ask Claude to regenerate the HTML:

> "Please update index.html to match the current roadmap.md data"

Or manually sync by copying the JSON from `roadmap.md` into both `originalFeatures` and `actualFeatures` arrays (adjusting dates for the Actual schedule).

---

## Future Enhancements

Potential improvements to consider:
- [ ] Export to PNG/PDF for stakeholder presentations
- [ ] Drag-and-drop timeline editing
- [ ] Dependency arrows between features
- [ ] "What-if" scenario comparisons beyond Original/Actual
- [ ] Integration with project management tools (Jira, Linear)
- [ ] Milestone markers beyond MVP launch
- [ ] Resource allocation by individual developer
