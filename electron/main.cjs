const { app, BrowserWindow, dialog, ipcMain } = require("electron");
const path = require("node:path");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1180,
    height: 760,
    minWidth: 900,
    minHeight: 620,
    title: "侣途相册",
    backgroundColor: "#fbfaf7",
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  mainWindow.setMenuBarVisibility(false);
  mainWindow.loadFile(path.join(__dirname, "..", "index.html"));
}

ipcMain.handle("pick-images", async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    title: "从相册批量导入",
    properties: ["openFile", "multiSelections"],
    filters: [
      { name: "Images", extensions: ["jpg", "jpeg", "png", "gif", "webp", "heic", "heif"] },
    ],
  });
  return result.canceled ? [] : result.filePaths;
});

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
