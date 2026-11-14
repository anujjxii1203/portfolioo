# Portfolio CMS: Layout & Visibility Architecture

This portfolio includes a local-only Content Management System and visual layout engine accessible at `/admin`.

---

## 1. Content Model (`/content/layout.json`)
The site structure is declaratively modeled in `/content/layout.json`:
- **Pages**: `home`, `web-dev`, `graphic-work`
- **Sections**: Each section has an `id`, `label`, `order`, `visible` (`true`/`false`), and `deleted` (`true`/`false`).
- **Text Items**: Every heading, paragraph, quote, and button has an `id`, `label`, `content`, and visibility flag. When hidden or deleted, it does not render and leaves no empty spacing gaps.
- **Images**: Each image slot maintains an `id`, `label`, `src`, and responsive `position` object:
  ```json
  "position": {
    "desktop": { "x": 50, "y": 50, "scale": 1, "rotate": 0, "zIndex": 1 },
    "mobile": { "x": 50, "y": 50, "scale": 1, "rotate": 0, "zIndex": 1 }
  }
  ```

---

## 2. Hide, Delete & Restore Operations
- **Hide (Eye icon)**: Soft-hides an element or entire section from the public site immediately. In the Admin tree, it displays in an amber/muted state with an eye-off icon.
- **Remove (Trash icon)**: Soft-deletes an item. The item remains listed in the tree in a collapsed/greyed-out state with a green **Restore** button.
- **10-Second Undo Toast**: Whenever any hide or delete action is performed, an **Undo** banner appears for 10 seconds allowing instant reversion with one click.
- **Timestamped Backups**: Every save to `layout.json` (as well as `site.json`, `web-projects.json`, and `graphic-works.json`) creates an immutable rolling timestamped backup in `/content/.backups/`. Up to 20 historical backups are retained.

---

## 3. Visual Image Positioning
- Under the **Layout & Visibility** tab, select any image slot (e.g., `About Portrait Photo`).
- Use the **Desktop / Tablet / Mobile** device switcher to preview and customize positions per viewport.
- Adjust **Horizontal (X%)**, **Vertical (Y%)**, and **Scale** with sliders or one-click presets (**Center**, **Left**, **Right**, **Top**, **Bottom**).
- Positions use **relative percentages** (0–100%) within the parent container so scaling is responsive across laptop, tablet, and mobile screens.
- Click **Reset to Default Layout** at any time to remove custom transforms and restore the original editorial layout.

---

## 4. Safety & Security
- **Local-Only**: Admin APIs (`/api/admin/*`) and `/admin` automatically return `404 Not Found` in production environments.
- **Authentication**: Protected by session cookies and `ADMIN_PASSWORD` (configured in `.env.local`).
- **Validation**: Strict schema validation via **Zod** (`SiteLayoutSchema`) enforces valid ranges (0–100% coordinates, scale limits).

