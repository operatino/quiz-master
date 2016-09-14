rm app.zip
rm -rf tmp

mkdir tmp
cp -R app-template/com.appathon.app.QuizMaster tmp/com.appathon.app.QuizMaster
mkdir tmp/com.appathon.app.QuizMaster/Contents/App

cp -R css tmp/com.appathon.app.QuizMaster/Contents/App/css
cp -R img tmp/com.appathon.app.QuizMaster/Contents/App/img
cp -R js tmp/com.appathon.app.QuizMaster/Contents/App/js
cp -R lib tmp/com.appathon.app.QuizMaster/Contents/App/lib
cp -R media tmp/com.appathon.app.QuizMaster/Contents/App/media
find . -name \*.html -maxdepth 1 -exec cp {} tmp/com.appathon.app.QuizMaster/Contents/App \;

mkdir tmp/prod-modules
cp package.json tmp/prod-modules/package.json
cd tmp/prod-modules
NODE_ENV=production npm install
cd ../..
cp -R tmp/prod-modules/node_modules tmp/com.appathon.app.QuizMaster/Contents/App/node_modules

cd tmp
zip -r ../app.zip com.appathon.app.QuizMaster

cd ..
rm -rf tmp

echo "Done, check ./app.zip";