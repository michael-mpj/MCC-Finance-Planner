const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

const isDev = !app.isPackaged; // Check if running in dev or production

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 600,
    show: false, // Hide until ready-to-show for smoother load
    webPreferences: {
      preload: path.join(__dirname, "preload.js"), // optional
      nodeIntegration: false,
      contextIsolation: true, // Recommended for security
    },
    icon: path.join(__dirname, "../public/favicon.ico"),
    titleBarStyle: 'hiddenInset',
  });

  // Load URL depending on dev/prod
  if (isDev) {
    mainWindow.loadURL("http://localhost:5173"); // Vite dev server
    mainWindow.webContents.openDevTools(); // Open dev tools in dev mode
  } else {
    mainWindow.loadFile(path.join(__dirname, "../dist/index.html")); // Production build
  }

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

// App lifecycle
app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// Example: Secure IPC channel for renderer <-> main
ipcMain.handle("ping", async () => {
  return "pong";
});
