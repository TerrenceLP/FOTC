import * as firebase from "firebase/app"
// Add the Firebase services that you want to use
import "firebase/auth"
import 'firebase/firebase-functions'


const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  databaseURL: process.env.databaseURL,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
  measurementId: process.env.measurementId
}
// Initialize Firebase
firebase.initializeApp(firebaseConfig)
export {firebase}

const functions = firebase.functions()
let googleKey
let addMessage = functions.httpsCallable('app')

addMessage({text: 'messageText'})
.then((result) => {
  // Read result of the Cloud Function.
  console.log(result)
  googleKey = result.data[1].googleKey['key']
  return googleKey
})

export const googleSignIn = () => {
    const provider = new firebase.auth.GoogleAuthProvider()
    firebase.auth().signInWithPopup(provider)
    .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const token = result.credential.accessToken
        // The signed-in user info.
        const user = result.user

        document.getElementById('uid').setAttribute('value', uid)
        document.getElementById('signInNavItem').setAttribute('style', 'display:none;')
        document.getElementById('signOutNavItem').setAttribute('style', 'display:inline;')

        console.log(user.displayName)
        console.log(user.photoURL)
        console.log(user.phoneNumber)
        console.log(user.uid)
        console.log(user.emailVerified)
        console.log(user.providerData[0].providerId)
        console.log(token)

    })
    .catch((error) => {
        let errorCode = error.code
        let errorMessage = error.message
        // The email of the user's account used.
        let email = error.email
        // The firebase.auth.AuthCredential type that was used.
        let credential = error.credential
        console.log(email + errorCode)
        console.log(credential + errorMessage)
    })
}

export const googleSignOut = () => {
    firebase.auth().signOut()
    .then(() => {
      // Sign-out successful.
    console.log('Sign-out successful')
    document.getElementById('user-welcome').innerHTML = ''
    document.getElementById('user-email').innerHTML = ''
    document.getElementById('user-photo').innerHTML = ''
    document.getElementById('navbar-brand').innerHTML = '<i class="fas fa-user-circle fa-3x"></i>'
    })
    .catch((error) => {
        let errorCode = error.code
        let errorMessage = error.message
        console.log(errorCode)
        console.log(errorMessage)
    })
}