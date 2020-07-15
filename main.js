const { app, BrowserWindow, BrowserView, nativeTheme, screen } = require('electron')
const path = require('path')
const fs = require("fs")
const os = require("os")

// Load in settings.txt and tokenize by new line
var settings = fs.readFileSync('resources/settings.txt').toString().split("\n")

var lightTheme = fs.readFileSync('resources/app.asar/themes/theme-light.css')
var darkTheme = fs.readFileSync('resources/app.asar/themes/theme-dark.css')
var titlebarThemeDark = fs.readFileSync('resources/app.asar/themes/title-dark.css')
var titlebarThemeLight = fs.readFileSync('resources/app.asar/themes/title-light.css')
var darkSyntax = fs.readFileSync('resources/app.asar/themes/syntax-dark.css')
var lightSyntax = fs.readFileSync('resources/app.asar/themes/syntax-light.css')
var titlebarDark = fs.readFileSync('resources/app.asar/themes/title-dark.html')
var titlebarLight = fs.readFileSync('resources/app.asar/themes/title-light.html')

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

    const titleBarHeight = 33

    mainWindow.setTitle("Spooky Chat")
        // Hide menu bar
    mainWindow.removeMenu()

    let contentView = new BrowserView({
        webPreferences: {
            nodeIntegration: true
        }
    })

    contentView.webContents.on('did-finish-load', function() {
        if (nativeTheme.shouldUseDarkColors || settings[1] == "force-dark-theme") {
            contentView.webContents.insertCSS(darkTheme.toString())
            contentView.webContents.insertCSS(darkSyntax.toString())
        } else {
            contentView.webContents.insertCSS(lightTheme.toString())
            contentView.webContents.insertCSS(lightSyntax.toString())
        }
    })

    mainWindow.addBrowserView(contentView)

    if (os.platform() == "win32") {
        contentView.setBounds({ x: 0, y: titleBarHeight, width: 1500, height: 800 - titleBarHeight })
    } else {
        contentView.setBounds({ x: 0, y: 0, width: 1500, height: 800 })
    }


    contentView.setAutoResize({
        width: true,
        height: true
    })

    contentView.webContents.loadURL(settings[0])
    if (os.platform() == "win32") {
        if (nativeTheme.shouldUseDarkColors || settings[1] == "force-dark-theme") {
            mainWindow.webContents.loadURL("data:text/html," + titlebarDark.toString())
        } else {
            mainWindow.webContents.loadURL("data:text/html," + titlebarLight.toString())
        }
    }

    mainWindow.webContents.on('did-finish-load', function() {
        mainWindow.setTitle("Spooky Chat")
        if (os.platform() == "win32") {
            if (nativeTheme.shouldUseDarkColors || settings[1] == "force-dark-theme") {
                mainWindow.webContents.insertCSS(titlebarThemeDark.toString())
            } else {
                mainWindow.webContents.insertCSS(titlebarThemeLight.toString())
            }
        }
    })

    // The following event handlers prevent the contentView from resizing incorrectly and
    // cutting off content at the bottom of the view.

    mainWindow.on('maximize', () => {
        const { width, height } = screen.getPrimaryDisplay().workAreaSize
        contentView.setBounds({ x: 0, y: titleBarHeight, width: width, height: height - titleBarHeight })
    });

    mainWindow.on('unmaximize', () => {
        const width = mainWindow.getSize()[0]
        const height = mainWindow.getSize()[1]
        contentView.setBounds({ x: 0, y: titleBarHeight, width: width, height: height - titleBarHeight })
    });

    // mainWindow.webContents.openDevTools()
}

app.whenReady().then(() => {
    createWindow()
    app.on('activate', function() {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function() {
    if (process.platform !== 'darwin') app.quit()
})