const { app, BrowserWindow, BrowserView, nativeTheme } = require('electron')
const path = require('path')
const fs = require("fs")
const os = require("os")

var lightTheme = fs.readFileSync('./resources/app.asar/themes/theme-light.css')
var darkTheme = fs.readFileSync('./resources/app.asar/themes/theme-dark.css')
var titlebarThemeDark = fs.readFileSync('./resources/app.asar/themes/title-dark.css')
var titlebarThemeLight = fs.readFileSync('./resources/app.asar/themes/title-light.css')
var domain = fs.readFileSync('./resources/app.asar/settings.txt')
var titlebarDark = fs.readFileSync('./resources/app.asar/themes/title-dark.html')
var titlebarLight = fs.readFileSync('./resources/app.asar/themes/title-light.html')

function constructWindow() {
  if (os.platform() != "win32") {
    return new BrowserWindow({
      width: 1500,
      height: 800,
      backgroundColor: '#FFF',
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: true
      },
      icon: __dirname + '/appIcon.png'
    })
  } else {
    return new BrowserWindow({
      width: 1500,
      height: 800,
      frame: false,
      backgroundColor: '#FFF',
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: true
      },
      icon: __dirname + '/appIcon.png'
    })
  }
}


function createWindow() {
  const mainWindow = constructWindow()

  mainWindow.setTitle("Spooky Chat")
  // Hide menu bar
  mainWindow.removeMenu()

  let contentView = new BrowserView({
    webPreferences: {
      nodeIntegration: true
    }
  })

  contentView.webContents.on('did-finish-load', function() {
    contentView.webContents.setZoomFactor(1.2)
    if (nativeTheme.shouldUseDarkColors) {
      contentView.webContents.insertCSS(darkTheme.toString())
    } else {
      contentView.webContents.insertCSS(lightTheme.toString())
    }
  })

  mainWindow.addBrowserView(contentView)

  if (os.platform() == "win32") {
    contentView.setBounds({ x: 0, y: 30, width: 1500, height: 770 })
  } else {
    contentView.setBounds({ x: 0, y: 0, width: 1500, height: 800 })
  }
  

  contentView.setAutoResize({
    width: true, 
    height: true
  })

  contentView.webContents.loadURL(domain.toString())
  if (os.platform() == "win32") {
    if (nativeTheme.shouldUseDarkColors) {
      mainWindow.webContents.loadURL("data:text/html," + titlebarDark.toString())
    } else {
      mainWindow.webContents.loadURL("data:text/html," + titlebarLight.toString())
    }
  }

  mainWindow.webContents.on('did-finish-load', function () {
    mainWindow.setTitle("Spooky Chat")
    if (os.platform() == "win32") {
      if (nativeTheme.shouldUseDarkColors) {
        mainWindow.webContents.insertCSS(titlebarThemeDark.toString())
      } else {
        mainWindow.webContents.insertCSS(titlebarThemeLight.toString())
      }
    }
  })

  // mainWindow.webContents.openDevTools()
}

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