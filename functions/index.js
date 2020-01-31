const functions = require('firebase-functions')
const express = require('express')
const app = express()

const firebaseConfig = {
    apiKey: functions.config().api,
    authDomain: functions.config().authdomain,
    databaseURL: functions.config().databaseurl,
    projectId: functions.config().projectid,
    storageBucket: functions.config().storagebucket,
    messagingSenderId: functions.config().messagingsenderid,
    appId: functions.config().appid,
    measurementId: functions.config().measurementid
}

const googleKey = { googleKey: functions.config().googlemapsapi }

exports.app = functions.https.onCall((data, context) => {
    return [firebaseConfig,googleKey]
})