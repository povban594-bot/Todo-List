# Todo List (Simple Browser App)

A minimal client-side Todo List app implemented with plain HTML, CSS and JavaScript. Tasks are stored in the browser's localStorage so they persist across reloads on the same machine and origin.

This repository is intended as a small starter project for learning DOM manipulation and localStorage.

## Features
- Add a new task (press Enter or click the + button)
- Mark tasks completed with a checkbox
- Delete individual tasks
- Delete all tasks (with confirmation)
- Search tasks (live filter)

## File structure

src/
  index.html        -- app HTML
  css/
    styl.css        -- app styles
  js/
    app.js          -- application logic

## How it stores data
The app stores tasks as an array under the localStorage key `tasks`. Each task object has the form:

```json
{ "text": "Task text", "completed": false }
```

Clearing tasks via the "Delete All" button removes the `tasks` key from localStorage.

## Run locally

Since this is a static site you can open `src/index.html` in a browser directly, however some browsers (or browser extensions) may restrict local file access. Recommended options:

1) Quick static server using Node.js

```powershell
# from repository root
# install a simple static server if you don't have one (one-time)
npm install -g http-server
# start server and open in browser
cd src; http-server -o
```

2) Use VS Code Live Server extension (recommended for quick dev)

3) Open `src/index.html` directly in the browser

## Known issues / notes
- The app uses plain localStorage and is single-origin — tasks won't sync across devices or browsers.
- There are some opportunistic improvements possible:
  - Add edit-in-place for tasks
  - Add task timestamps and sorting
  - Improve accessibility (ARIA roles, focus management)
  - Add unit tests and a build toolchain if you grow the project

## Contribution
This is a simple learning project. Feel free to open issues or PRs with fixes or improvements.

---
Generated README for the Todo List project.
