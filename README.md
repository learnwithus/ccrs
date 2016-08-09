### CCRS Mobile Application ###

Mobile application for the BC Health Authorities [Course Catalogue and Registration System](https://ccrs.vch.ca/), developed with the [Ionic](http://ionicframework.com/) framework.
Employees with existing CCRS accounts can search and register for classroom sessions, start online courses, and check their profile information, training history, or registered sessions.

##### Ionic Installation (Linux/OS X) #####
Follow the [Ionic Installation Guide](http://ionicframework.com/docs/guide/installation.html)

##### Ionic Installation (Windows) #####
1. Install [Node.js](https://nodejs.org/en/download/) and [Git for Windows](https://git-scm.com/download/win)
2. In the Git Bash terminal, run `sudo npm install -g cordova`

##### Download the Project #####
```
git clone https://github.com/ajhpark/ccrs.git
cd ccrs
ionic state restore
```

##### Configure and Build for Platforms #####
Install the [Andoird SDK](https://developer.android.com/studio/index.html) (Download Android Studio, or just get command line tools) and [JDK](http://www.oracle.com/technetwork/java/javase/downloads/index.html) if it's not installed on your machine.
```
ionic platform add android
ionic build android
ionic run android
```

If you have a Mac with Xcode installed, you can also run:
```
ionic platform add ios
ionic build ios
```
Load the platforms/ios directory on Xcode and run the app

##### Test the Build #####
```
ionic serve
```

