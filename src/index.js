/*jshint esversion: 6 */
import $ from "jquery"
window.jQuery = $
window.$ = $

import Popper from "popper.js"
window.Popper = Popper

import 'bootstrap'
import './style.scss'
import 'tempusdominus-bootstrap-4'
import { googleMapsClient, fire, googleSignIn, googleSignOut } from "./google"
import { addListing, updateListing, addUserInfo, updateUserInfo} from "./forms"

const signInButton = document.getElementById('signInButton')
signInButton.addEventListener('click', googleSignIn, false)

const signOutButton = document.getElementById('signOutButton')
signOutButton.addEventListener('click', googleSignOut, false)

fire.auth().onAuthStateChanged((user) => {
  if (user) {
    // User is signed in.
    console.log(user)
    const displayName = user.displayName
    const email = user.email
    const photoURL = user.photoURL
    const uid = user.uid
    const emailVerified = user.emailVerified

    if(emailVerified === true){
    document.getElementById('user-welcome').innerHTML += '<i title="Double Verified User" class="fas fa-1x fa-check-double text-success"></i> '
    }
    // ...
    document.getElementById('user-welcome').innerHTML += displayName
    document.getElementById('user-email').innerHTML = email
    document.getElementById('user-photo').src = photoURL
    document.getElementById('navbar-brand').innerHTML = `<img src="${photoURL}" class="rounded-circle" />`
    document.getElementById('uid').setAttribute('value', uid)
    document.getElementById('signOutNavItem').setAttribute('style', 'display:inline;')
    document.getElementById('signInNavItem').setAttribute('style', 'display:none;')
    manageListings(uid)
    manageProfile(uid)
  } else {
    // User is signed out.
    document.getElementById('signOutNavItem').setAttribute('style', 'display:none;')
    document.getElementById('signInNavItem').setAttribute('style', 'display:inline;')
  }
})

// Geocode an address.
googleMapsClient.geocode({
  address: '3412 Misty Lynn Ct Fuquay-Varina, NC 27526'
}, (err, response) => {
  if (!err) {
    console.log(response.json.results)
    let pos = {
      lat: response.json.results[0].geometry.location.lat,
      lng: response.json.results[0].geometry.location.lng
    }
    let map = new google.maps.Map(document.getElementById("map"), {center: pos, zoom: 12})
    showFOTC(map)

  } else {
    console.log(err)
  }
})

const showFOTC = (map) => {
  fire.firestore().collection("users")
      .get()
      .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
              // doc.data() is never undefined for query doc snapshots
              let position = new google.maps.LatLng(doc.data().location.latitude, doc.data().location.longitude)
              let marker = new google.maps.Marker({
                  position: position,
                  map: map,
                  title: doc.data().name,
                  animation: google.maps.Animation.DROP
              })
              marker.setMap(map)

              let infowindow = new google.maps.InfoWindow({
                content: `${doc.data().name} and ${doc.data().email}`
              })

              marker.addListener('click', () => {
                infowindow.open(map, marker)
              })
          })
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error)
    })
}

document.getElementById("searchAddress").addEventListener("submit", function(event){
                event.preventDefault()
                let address = document.getElementById("address").value
                // Make a geocode request
                googleMapsClient.geocode({
                  address: address
                }, (err, response) => {
                  if (!err) {
                    console.log(response.json.results)
                    let pos = {
                      lat: response.json.results[0].geometry.location.lat,
                      lng: response.json.results[0].geometry.location.lng
                    }

                    let map = new google.maps.Map(document.getElementById("map"), {center: pos, zoom: 12})
                    let marker = new google.maps.Marker({
                      position: pos, 
                      map: map,
                      title: 'Hello World!',
                      animation: google.maps.Animation.DROP
                    })
                    let infowindow = new google.maps.InfoWindow({
                      content: 'content String'
                    })
                    marker.setMap(map)
                    marker.addListener('click', () => {
                      infowindow.open(map, marker)
                    })
                  } else {
                    console.log(err)
                  }
                })
              })

const manageProfile = (uid) => {
  fire.firestore().collection("users").where("uid", "==", uid)
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.data().uid)
            console.log(doc.data().name)
        })
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error)
    })
}

const manageListings = (uid) => {
  fire.firestore().collection("circuit-listing").where("user", "==", uid)
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            // console.log(doc.id, " => ", doc.data());
            let title = doc.data().title
            let desc = doc.data().description
            let valid = doc.data().validUntil
            document.getElementById('circuitList').innerHTML += `<li class="list-group-item"><h3>${title}</h3> ${desc} <br> ${valid}
                                                                  <hr>
                                                                  <div class="btn-group" role="group" aria-label="edit buttons">
                                                                    <button type="button" class="btn btn-secondary">Edit</button>
                                                                    <button type="button" class="btn btn-link">ReList</button>
                                                                    <button type="button" class="btn btn-danger"><i class="fas fa-trash-alt"></i></button>
                                                                  </div>
                                                                </li>`
      });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error)
    })
}

document.getElementById("updateUserInfo").addEventListener("submit", function(event){
  event.preventDefault()
  let u = Date.now()
  let n = document.getElementById("userName").value
  let p = document.getElementById("userPhone").value
  let e = document.getElementById("userEmail").value
  let img = document.getElementById("img").value

  let i = []
  let yi = [...document.getElementsByClassName("your-interests")]
  
  yi.forEach(getInterests)

  function getInterests(item, index) {
    if(item.checked) {
      i.push(item.value)
    }
  }

  let pos = document.getElementById("userLocation").value.split(',')
  let l = new fire.firestore.GeoPoint(+pos[0],+pos[1])

  let uid = document.getElementById("uid").value
  console.log([u,e,img,i,l,n,p,uid])
  // updateUserInfo(u,e,img,i,l,n,p,uid)
})

document.getElementById("saveListing").addEventListener("submit", function(event){
  event.preventDefault()
  let t = document.getElementById("title").value
  let c = document.getElementById("category").value
  let d = document.getElementById("description").value
  let v = document.getElementById("datetimepicker1").value
  let u = document.getElementById("uid").value
  addListing(c,d,t,u,v)
})

document.getElementById("geoButton").addEventListener("click", function(event) {
  event.preventDefault()
  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      let pos = [position.coords.latitude,position.coords.longitude]
      document.getElementById("userLocation").value = pos
      console.log(pos)
      })
    }
})

$(function () {
  $('#datetimepicker1').datetimepicker()
})