const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { execFile } = require("child_process");
const fs = require("fs");
const log = require("electron-log");

let pythonProcess; // Pythonプロセスをグローバルに保持

log.transports.file.level = "info";
log.transports.file.file = "logs/" + "log.log";

console.log = function (message) {
  log.info(`${new Date().toISOString()} - LOG: ${message}\n`);
};

console.error = function (message) {
  log.info(`${new Date().toISOString()} - ERROR: ${message}\n`);
};

console.log("ログシステムが初期化されました。");

// Let electron reloads by itself
if (
  process.env.ELECTRON_DEBUG === "true" ||
  process.env.ELECTRON_DEBUG === "vscode"
) {
  require("electron-reload")(__dirname, {});
}

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    autoHideMenuBar: true,
    center: true,
    // useContentSize: true,
    frame: false,
    width: 1920,
    height: 1080,
    minWidth: 1280,
    minHeight: 720,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  // Hot reload
  if (process.env.ELECTRON_HOT === "true") {
    mainWindow.loadURL("http://localhost:3000");
  } else {
    // and load the index.html of the app.
    mainWindow.loadFile(path.join(__dirname, "build/index.html"));
  }
  // Pythonのスタンドアロンexeを実行
  const executablePath = path.join(__dirname, "src/api/dist/main");
  console.log("Python実行");

  pythonProcess = execFile(executablePath, (error, stdout, stderr) => {
    if (error) {
      console.error(`エラー: ${error.message}`);
      console.error(`エラー: ${error}`);
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
    }
    if (stdout) {
      console.log(`stdout: ${stdout}`);
    }
  });

  if (process.env.ELECTRON_DEBUG === "true") {
    // Open the DevTools.
    mainWindow.webContents.openDevTools();
  }

  pythonProcess.on("exit", (code, signal) => {
    console.log(
      `Pythonプロセスが終了しました。code: ${code}, signal: ${signal}`
    );
  });

  // keep ratio when scaling
  mainWindow.setAspectRatio(16 / 9);

  // ウィンドウが閉じられたときにPythonプロセスを終了
  mainWindow.on("closed", () => {
    if (pythonProcess) {
      pythonProcess.kill("SIGTERM"); // 強制終了
      pythonProcess = undefined; // 変数をクリア
    }
    console.log("window closed");
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  console.log("window all closed");
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (pythonProcess) {
    pythonProcess.kill("SIGTERM"); // プロセスを強制終了
  }
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it"s common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
