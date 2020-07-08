const { app, BrowserWindow, BrowserView } = require('electron')
const path = require('path')
const fs = require("fs")


var lightTheme = fs.readFileSync('theme-light.css')
var darkTheme = fs.readFileSync('theme-dark.css')
var titlebarTheme = fs.readFileSync('title.css')
var domain = fs.readFileSync('domain.txt')
var titlebar = fs.readFileSync('title.html')

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    frame: false,
    backgroundColor: '#FFF',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true
    }
  })

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
    contentView.webContents.insertCSS(darkTheme.toString())
  })

  mainWindow.addBrowserView(contentView)

  contentView.setBounds({ x: 0, y: 30, width: 1280, height: 770 })

  contentView.setAutoResize({
    width: true, 
    height: true
  })

  contentView.webContents.loadURL(domain.toString())

  mainWindow.webContents.loadURL("data:text/html," + titlebar.toString())

  mainWindow.webContents.on('did-finish-load', function () {
    mainWindow.setTitle("Spooky Chat")
    mainWindow.webContents.insertCSS(titlebarTheme.toString())
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