const functions = require('firebase-functions')

// Google Maps GeoCoder Call
const googleMapsKey = functions.config().googlemapsapi.key
const googleMapsClient = require('@google/maps').createClient({
        key: googleMapsKey,
        Promise: Promise
    })

exports.setLocation = functions.https.onCall((data, context) => {
    // Checking that the user is authenticated.
    if (!context.auth) {
        throw new functions.https.HttpsError('failed-precondition', 'The function must be called ' + 'while authenticated.')
    }
    // Authentication Passed / user information is automatically added to the request.
    const uid = context.auth.uid
    const name = context.auth.token.name || null
    const location = data.location || '1600 Amphitheatre Parkway, Mountain View, CA'

    return googleMapsClient.geocode({
            address: location
        })
        .asPromise()
        .then((response) => {
            return {
                res: response.json.results,
                uid: uid,
                name: name,
                data: data
            }
        })
        .catch((err) => {
            throw new functions.https.HttpsError('unknown', err.message, error);
        })
})