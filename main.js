const {app, BrowserWindow} = require('electron')
const path = require('path')

const allowDev = false;

// with hardware acceleration disabled, the screen flickers when the window is moved
// app.disableHardwareAcceleration();

let mainWindow = null;

let devWindow = null;

app.name = 'RKS-GUI'
app.version = '0.0.1'

function createWindow () {

  mainWindow = new BrowserWindow({
    frame: false,
    x: 0,
    y: 0,
    width: 1600,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
//       enableRemoteModule: true,
      nodeIntegration: true,
//       contextIsolation: false,
//       nodeIntegrationInWorker: true,
//       nodeIntegrationInSubFrames: true
    }
  })

  mainWindow.setTitle('RKS-GUI')
  mainWindow.loadFile(path.join(__dirname, 'index.html'))

  // Open the DevTools.
  if (allowDev) {
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
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  })

  if (devWindow) {
    devWindow.on('closed', () => {
      devWindow = null;
    })
  }
}

app.whenReady().then(() => {
  console.log('6X-GUI is ready')
  console.log('App name:', app.name)
  console.log('App version:', app.version)

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  mainWindow.once('ready-to-show', () => {
    // mainWindow.show()
  })

  console.log(app.getPath('userData'));
})

app.on('before-quit', _e => {
  // console.log('6X-GUI is quitting')
})

app.on('browser-window-blur', _e => {
  // console.log('6X-GUI is blurred')
})

app.on('browser-window-focus', _e => {
  // console.log('6X-GUI is focused')
})

// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

