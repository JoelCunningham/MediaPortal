## Media Portal

Desktop app built with Electron, TypeScript, React, and Electron Forge.

## Prerequisites

- Node.js 20 or later
- Visual Studio Build Tools with the "Desktop development with C++" workload on Windows

## Run on Windows

If this is a fresh checkout, install the native build toolchain first:

1. Open an Administrator PowerShell or Command Prompt.
2. Install or modify Visual Studio Build Tools and include the C++ workload.
3. Make sure the MSVC toolset and Windows 10/11 SDK are selected.

Then install dependencies and start the app:

```powershell
npm install
npm start
```

## Package

```powershell
npm run package
```

## Notes

- `npm start` runs `electron-forge start`.
- The project uses `extract-file-icon`, which requires the Visual Studio C++ toolchain to build on Windows.

