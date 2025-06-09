# AGENTS.md

## Project: DocView

**DocView** is a local-first, GitHub-style markdown viewer built with Electron.  
It provides a graphical user interface to browse and render markdown documents from a directory tree – using familiar GitHub semantics and style.  
No network services or remote components are involved. All logic runs locally.

---

## INTENTION

DocView is not an editor, not a CMS, and not a static site generator.  
It is a local, navigable markdown reader – clean, safe, fast, and GitHub-like.  
Designed to be used for local documentation browsing, internal knowledge bases, or markdown-based software manuals.

---

## MODULES

The system is composed of the following conceptual modules:

### 🖥️ Application Bootstrap (Electron Host)
- Initializes the window and loads the frontend
- Grants the renderer access to a user-specified root folder
- May expose limited file system access (read-only)

### 📂 Directory Walker
- Recursively traverses a folder and constructs a hierarchical structure of directories and `.md` files
- Ignores hidden files and non-markdown content
- Identifies entry files (`index.md`, `readme.md`, `doc.md`) within folders

### 🧭 Navigation Layer
- Renders a folder tree in the sidebar
- Allows selection and switching between documents
- Highlights active document
- Optionally supports folder collapsing

### 🧾 Markdown Parser
- Converts `.md` files to HTML
- Uses GitHub-flavored markdown conventions
- Supports code highlighting, tables, blockquotes, inline HTML
- Sanitizes all output to prevent XSS

### 🎨 Presentation Layer
- Loads GitHub-like stylesheet (`github-markdown-css`)
- Wraps rendered content in `markdown-body` container
- Adjusts layout for split view: navigation vs content
- Supports responsive resizing and scrollable content

---

## TECHNOLOGIES

- **Electron** for native desktop application
- **Node.js** for filesystem access
- **Vitest** for tests
- **Marked** or **markdown-it** for markdown parsing
- **highlight.js** for syntax highlighting
- **github-markdown-css** for visual fidelity
- **TailwindCSS** for layout and spacing
- No web servers, no Express, no database

---

## INTERACTION MODEL

- On launch, the app opens a window displaying a directory tree and markdown view.
- Selecting a folder auto-opens its main document (index/readme/doc).
- Selecting a file immediately renders its content.
- Navigation and rendering are instant – no page reloads.

---

## SANITY RULES

- Output HTML must be strictly sanitized.
- No remote loading of scripts, styles, or assets.
- All rendering must happen inside Electron, with no browser fallback.
- The application runs fully offline.

---

## OUT OF SCOPE

- No editing or writing of markdown files
- No cloud sync or web integration
- No support for non-markdown content
- No plugin system or runtime extension

---

## LICENSE

DocView is released under the Unlicense.  
It is intended for free and open personal or organizational use. No attribution required.
