# AGENTS.md

## Project: DocView

**DocView** is a local-first, GitHub-style markdown viewer built with Electron.  
It provides a desktop application to browse and read markdown documentation from a local folder structure.  
This project is **read-only** by design — no editing, no cloud, no network.

---

## INTENTION

DocView is a **static, offline documentation reader** with a strong focus on clarity, visual consistency, and simplicity.  
It is meant to be used like a "Markdown viewer for your local docs", with zero distractions and full fidelity to GitHub-style rendering.

---

## END RESULT — WHAT MUST BE TRUE

The final application must:

- Open as an Electron window with a **split layout**: sidebar (navigation) and viewer (content)
- Use a **responsive layout** — no fixed pixel widths
- On the **left side**, show a recursive **folder tree** of the selected root directory:
  - Only shows folders and `.md` files
  - Collapsible folders with icons
  - File names (without `.md`) are selectable
  - Highlight the currently opened file
- On the **right side**, render the contents of the selected `.md` file:
  - Using `github-markdown-css` for styling
  - Support all GitHub-flavored markdown features (headings, code blocks, tables, etc.)
  - No editing capabilities, just rendering
  - Content is scrollable, with full width usage and readable layout
- Runs fully offline — no remote resources, no scripts, no fonts
- All HTML must be **strictly sanitized** to prevent XSS
- The app must look and feel like a lightweight, desktop-native documentation browser
- On initial launch (before a folder is selected), show a **blank state screen** with a button like:
  
  > "Select folder to begin viewing your Markdown documentation"

---

## VISUAL STRUCTURE

### Layout

- Two-column flex layout: `display: flex; flex-direction: row; height: 100vh;`
- **Sidebar**:
  - Responsive min-width (`min-w-[200px]`), max-width constraint (e.g. `max-w-[300px]`)
  - Uses proportional width: `flex-basis: 20%`, `flex-shrink: 0`, `flex-grow: 0`
- **Viewer**:
  - `flex-grow: 1`
  - Scrollable independently
- Layout remains stable on window resize

### Sidebar (Navigation)

- Dark background (`#1e1e1e`)
- Text color: `#d4d4d4`
- Active file:
  - Slightly lighter background (`#2c2c2c`)
  - Left border (e.g. `3px solid #3b82f6`)
- Folder entries:
  - Clickable
  - Small icon rotates on open/close
- Files:
  - `.md` files only, no extension shown
  - Hover effect for interactivity
- No file system operations (create/delete/rename)

### Content (Markdown Viewer)

- Background: `#1e1e1e`
- Text color: `#e4e4e4`
- Uses `github-markdown-css` inside a `markdown-body` container
- Padding: relative (`padding: 2rem`)
- Responsive text size and layout spacing
- Code blocks: syntax highlighted via `highlight.js`
- HTML output strictly sanitized

---

## STARTUP BEHAVIOR

- When the app starts and **no folder is selected**:
  - The sidebar remains empty
  - The viewer shows a centered welcome screen with:
    - Short description of the app
    - A button labeled: **"Open Folder"**
    - Optional: Drop area for drag & drop
- Once a folder is selected:
  - The file tree loads in the sidebar
  - The first available file (`index.md`, `readme.md`, `doc.md`) is rendered automatically

---

## MODULES TO COORDINATE

1. **Electron Host**  
   - Opens the window  
   - Prompts user to select a folder if none is provided  
   - Exposes filesystem read-access to renderer

2. **Directory Walker**  
   - Builds a recursive tree of visible folders and `.md` files  
   - Filters out hidden files and non-markdown content  
   - Identifies the primary entry file (index/readme/doc)

3. **Navigation Sidebar**  
   - Renders the folder tree  
   - Handles expansion, collapse, file selection  
   - Highlights active file

4. **Markdown Renderer**  
   - Converts `.md` to sanitized HTML  
   - Applies `github-markdown-css` styles  
   - Includes syntax highlighting via `highlight.js`

5. **Layout Shell**  
   - Coordinates the responsive two-column view  
   - Applies theme, scroll separation, and flex behavior  
   - Shows initial welcome screen if no folder is loaded

---

## WORKFLOW EXPECTATIONS FOR AGENTS

When entering the repository, an agent should:

- Understand the project is a **read-only**, offline-first documentation viewer
- Avoid implementing any editing tools, cloud logic, or complex state persistence
- Use clean modular structure: filesystem → directory structure → sidebar → renderer
- Favor semantic, tailwind-compatible styling over hardcoded CSS
- Make rendering robust, sanitized, and layout-safe
- Ensure that the app gracefully handles startup state and empty directories

---

## LICENSE

DocView is released under the Unlicense.  
It is a public domain tool — free to use, share, and modify without attribution.
