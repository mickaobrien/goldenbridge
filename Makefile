install-android: android
	adb install android/app/build/outputs/apk/app-release.apk

android: assets
	cd android && ./gradlew assembleRelease

assets:
	cp -r web/* android/app/src/main/assets/web/
