![It's Spooky](https://github.com/soda3x/SpookyChat/raw/master/misc/spookychat_banner.png "It's Spooky")

An electron client for Rocket Chat

![SpoooooooooOOOOoooOOOooooooOOOOooky!](https://github.com/soda3x/SpookyChat/raw/master/misc/showcase.png "SpoooooooooOOOOoooOOOooooooOOOOooky!")

## Features

* Dynamic theme switching based on system theme
* Dark mode and light mode
* Windows, macOS and Debian versions available
* Clean, modern design language
* Improved message threading and replies
* Independent syntax-highlighting themes
* General Rocket Chat quality of life improvements

## Planned Features

* Update server for OTA updating
* Custom colour scheme support
* Custom desktop notification preferences
* Custom notification sounds
* Ability to view multiple threads at once

## Development

Before running, set Rocket Chat server domain in `./settings.txt`

Example `settings.txt`

```text
https://rocketchat.mydomain.com
```

To run, use `npm start`

Use `npm run clean` to clean build directory (this only works on Unix based OSes)

### Building for Windows

To produce a 64-bit Win32 binary, use `npm run build_win32`
This script will generate a binary in `./build`

A windows installer will be possible to build in the near future

### Building for macOS

Currently `.app` (Darwin) binaries can be generated using `npm run build_macos`
macOS App Store binaries will be possible to build in the near future

### Build for Linux

To build for amd64 Linux, use `npm run build_linux`

An ARM64 binary will be possible to build in the near future
