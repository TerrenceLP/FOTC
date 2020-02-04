import * as firebase from "firebase/app"
// Add the Firebase services that you want to use
import "firebase/auth"
import 'firebase/firebase-functions'

const firebaseConfig = {
    apiKey: "AIzaSyD6erUXL8-949PK9-M8nhgJrKZJwMEwE1A",
    authDomain: "fotc-8d770.firebaseapp.com",
    databaseURL: "https://fotc-8d770.firebaseio.com",
    projectId: "fotc-8d770",
    storageBucket: "fotc-8d770.appspot.com",
    messagingSenderId: "1001262891474",
    appId: "1:1001262891474:web:e911dd9ebdef622c5b480b",
    measurementId: "G-9HJGZER0ZT"
}
// Initialize Firebase
firebase.initializeApp(firebaseConfig)
export {firebase}
export const functions = firebase.functions()

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
        console.log('signInToken')
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

export const setLocation = firebase.functions().httpsCallable('setLocation')