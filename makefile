# Настройки сборки
# apk settings (building)
# keytool.exe -importcert -file upload_cert.der -keystore <keystorefile>
apk:=app-release-unsigned.apk
aligned-apk:=app-release-unsigned-aligned.apk
signed-apk:=app-release-signed.apk
signed-aligned-apk:=app-release-signed-aligned.apk

# cordova
cordova-build-path:=src-cordova/platforms/android/app/build/outputs/apk/release

# keystore settings (signing)
# хранить их тут потенциально небезопасно, но это позволяет подписывать приложение в одну команду
keystore:=appkey.keystore
keystore-alias:=appkey
keystore-pass:=y2/Get4BA~S8B+M
entity:="CN=Klym Shabalin, OU=ZN Dev, O=ZN, L=Unknown, S=UA, C=UA"

# firebase
preview-channel:=test
site:=beeco-b0ed5

# Команды

# Основная команда, собирает приложение и подписывает его
release: build sign zip-align

# make generate-key создает ключ для подписи приложения
generate-key:
	echo "Removing old key"
	rm $(keystore)
	keytool -genkey -v \
					-keystore $(keystore) \
					-alias $(keystore-alias) \
					-keyalg RSA \
					-keysize 2048 \
					-storetype PKCS12 \
					-storepass $(keystore-pass) \
					-validity 9200 \
					-dname $(entity)

build-android:
	npm run cordova-build-android

build-browser:
	npm run cordova-build-browser

# Сборка приложения
.phony: build
build: build-android

# Копирование ключа в папку с собранным приложением
copy-keystore:
	cp $(keystore) $(cordova-build-path)/$(keystore)

# Подпись приложения ключом
sign: copy-keystore
	cp $(cordova-build-path)/$(apk) $(cordova-build-path)/$(signed-apk)
	jarsigner -verbose \
						-sigalg SHA1withRSA \
						-digestalg SHA1 \
						-keystore $(keystore) $(cordova-build-path)/$(signed-apk) $(keystore-alias) \
						-storepass $(keystore-pass)

zip-align:
	zipalign -f 4 $(cordova-build-path)/$(apk) $(cordova-build-path)/$(aligned-apk)
	zipalign -f 4 $(cordova-build-path)/$(signed-apk) $(cordova-build-path)/$(signed-aligned-apk)

firebase-preview: build-browser
	firebase hosting:channel:deploy test

# https://firebase.google.com/docs/hosting/test-preview-deploy#clone-preview-to-live
firebase-deploy: build-browser
	firebase hosting:clone $(site):$(preview-channel) $(site):live
