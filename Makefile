install-android: android
	adb install android/app/build/outputs/apk/app-release.apk

android: assets
	cd android && ./gradlew assembleRelease

assets:
	cp -r web/* android/app/src/main/assets/web/
	cp -r web/* ios/web/

ios-bundle:
	react-native bundle --dev false --assets-dest ./ios --platform ios --entry-file ./index.ios.js --bundle-output ./ios/main.jsbundle
