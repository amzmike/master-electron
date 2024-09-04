// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
const path = require('path')

app.disableHardwareAcceleration();

let mainWindow = null;
let devWindow = null;

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    x: 0,
    y: 0,
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
//       enableRemoteModule: true,
//       nodeIntegration: true,
//       contextIsolation: false,
//       nodeIntegrationInWorker: true,
//       nodeIntegrationInSubFrames: true
    }
  })

//   require("@electron/remote/main").enable(mainWindow.webContents)

  mainWindow.setTitle('RKS-GUI')
  mainWindow.loadURL(path.join('file://', __dirname, 'index.html'))

  // and load the index.html of the app.
  // mainWindow.loadFile('index.html')

  // Open the DevTools.
  devWindow = new BrowserWindow()
  mainWindow.webContents.setDevToolsWebContents(devWindow.webContents)
  mainWindow.webContents.openDevTools({mode: 'detach'})
  mainWindow.webContents.once('did-finish-load', () => {
    let windowBounds = mainWindow.getBounds();
    devWindow.setPosition(windowBounds.x + windowBounds.width, windowBounds.y)
  });

  // Set the devtools position when the paretn window is moved
  mainWindow.on('move', () => {
    let windowBounds = mainWindow.getBounds()
    devWindow.setPosition(windowBounds.x + windowBounds.width, windowBounds.y)
  })

  mainWindow.on('closed', function () {
    mainWindow = null;
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})



// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
