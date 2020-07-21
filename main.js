const { app, BrowserWindow, BrowserView, nativeTheme, screen, shell } = require('electron')
const path = require('path')
const fs = require("fs")
const os = require("os")

// Configuration files:
var settings;
var commonTheme;
var commonLayout;
var lightTheme;
var darkTheme;
var titlebarThemeDark;
var titlebarThemeLight;
var darkSyntax;
var lightSyntax;
var titlebarDark;
var titlebarLight;

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

function loadProdConfigurationFiles() {
    settings = fs.readFileSync('resources/settings.txt').toString().split("\n")
    commonTheme = fs.readFileSync('resources/app.asar/themes/theme-common.css')
    commonLayout = fs.readFileSync('resources/app.asar/themes/theme-common-layout.css')
    lightTheme = fs.readFileSync('resources/app.asar/themes/theme-light.css')
    darkTheme = fs.readFileSync('resources/app.asar/themes/theme-dark.css')
    titlebarThemeDark = fs.readFileSync('resources/app.asar/themes/title-dark.css')
    titlebarThemeLight = fs.readFileSync('resources/app.asar/themes/title-light.css')
    darkSyntax = fs.readFileSync('resources/app.asar/themes/syntax-dark.css')
    lightSyntax = fs.readFileSync('resources/app.asar/themes/syntax-light.css')
    titlebarDark = fs.readFileSync('resources/app.asar/themes/title-dark.html')
    titlebarLight = fs.readFileSync('resources/app.asar/themes/title-light.html')
}

function loadDevConfigurationFiles() {
    settings = fs.readFileSync('settings.txt').toString().split("\n")
    commonTheme = fs.readFileSync('themes/theme-common.css')
    commonLayout = fs.readFileSync('themes/theme-common-layout.css')
    lightTheme = fs.readFileSync('themes/theme-light.css')
    darkTheme = fs.readFileSync('themes/theme-dark.css')
    titlebarThemeDark = fs.readFileSync('themes/title-dark.css')
    titlebarThemeLight = fs.readFileSync('themes/title-light.css')
    darkSyntax = fs.readFileSync('themes/syntax-dark.css')
    lightSyntax = fs.readFileSync('themes/syntax-light.css')
    titlebarDark = fs.readFileSync('themes/title-dark.html')
    titlebarLight = fs.readFileSync('themes/title-light.html')
}

function createWindow() {

    try {
        loadProdConfigurationFiles();
    } catch (e) {
        console.log("Failed to find default configuration")
        try {
            loadDevConfigurationFiles()
            console.log("Found dev config")
        } catch (e) {
            console.log(e)
            console.log("Failed to initialise configuration, exiting")
            process.exit()
        }
    }

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

    contentView.webContents.on('did-finish-load', function () {
        if (nativeTheme.shouldUseDarkColors || settings[1] == "force-dark-theme") {
            contentView.webContents.insertCSS(darkTheme.toString())
            contentView.webContents.insertCSS(darkSyntax.toString())
        } else {
            contentView.webContents.insertCSS(lightTheme.toString())
            contentView.webContents.insertCSS(lightSyntax.toString())
        }
        contentView.webContents.insertCSS(commonTheme.toString())
        contentView.webContents.insertCSS(commonLayout.toString())
    })

    contentView.webContents.on('new-window', (event, url, frameName, disposition, options) => {
        // Open URL in default browser when user clicks on a hyperlink
        event.preventDefault()
        // Don't open url for attatchments, will fail.
        if (!url.includes("rocketchat.daronmont.com.au/file-upload/")) {
            shell.openExternal(url)
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

    mainWindow.webContents.on('did-finish-load', function () {
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