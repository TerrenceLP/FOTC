import $ from "jquery"
window.jQuery = $
window.$ = $

import Popper from "popper.js"
window.Popper = Popper

import 'bootstrap'
import './style.scss'
import 'tempusdominus-bootstrap-4'

import { Loader } from '@googlemaps/loader'
import { firebase, functions, googleSignIn, googleSignOut, startFunctionsRequest, startFunctionsCookieRequest, setLocation } from "./google"
import { addListing, updateListing, addUserInfo, updateUserInfo} from "./forms"

const loader = new Loader({
  apiKey: "AIzaSyBRWWY_Z51eucvZNQ9Pu9vI2XnZAYJeE_k", // Public Key Restricted 
  version: "weekly",
  libraries: ["places"]
})

setLocation({text: 'holy moly roly'})
.then((result) => {
  console.log(result)
  // Read result of the Cloud Function.
  loader.loadCallback(e => {
    if (e) {
      console.log(e)
    } else {
      let geocoder = new google.maps.Geocoder()
      geocoder.geocode({
        'address': result.data.res[0].formatted_address
      },
      (results, status) => {
        if (status == 'OK') {
          let pos = results[0].geometry.location
          let map = new google.maps.Map(document.getElementById("map"), {
            center: pos, 
            zoom: 8, 
            styles: mapStyles
          })
          showFOTC(map)
        } else {
          alert('Geocode was not successful for the following reason: ' + status);
        }
      })
    }
  })
})

document.getElementById("geoButton").addEventListener("click", (event) => {
  event.preventDefault()
  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      let pos = [position.coords.latitude,position.coords.longitude]
      document.getElementById("userLocation").value = pos

      let findMeSearch = new google.maps.Geocoder()
        findMeSearch.geocode({
          'location': {
            lat: pos[0] , 
            lng: pos[1]
          } 
        },(results, status) => {
          if (status == 'OK') {
            let pos = results[0].geometry.location
            let map = new google.maps.Map(document.getElementById("map"), {center: pos, zoom: 12, styles: mapStyles})
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
            alert('Geocode was not successful for the following reason: ' + status);
          }
        })
      })
    }
})

const signInButton = document.getElementById('signInButton')
signInButton.addEventListener('click', googleSignIn, false)

const signOutButton = document.getElementById('signOutButton')
signOutButton.addEventListener('click', googleSignOut, false)

firebase.auth().onAuthStateChanged((user) => {
  if (user) {

    // startFunctionsRequest()
    // startFunctionsCookieRequest()
    // User is signed in.
    const displayName = user.displayName
    const email = user.email
    const photoURL = user.photoURL
    const uid = user.uid
    const emailVerified = user.emailVerified
    console.log(user.refreshToken)

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

const showFOTC = (map) => {
  firebase.firestore().collection("users")
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            let position = new google.maps.LatLng(doc.data().location.latitude, doc.data().location.longitude)
            let marker = new google.maps.Marker({
                position: position,
                map: map,
                title: doc.data().name,
                animation: google.maps.Animation.DROP
            })
            marker.setMap(map)
            // console.log(doc.data().image)
            let infowindow = new google.maps.InfoWindow({
              content: `${doc.data().name} and ${doc.data().email} and <img src="${doc.data().image}" />`
            })
            marker.addListener('click', () => {
              infowindow.open(map, marker)
            })
        })
    })
    .catch((error) => {
        console.log("Error getting documents: ", error)
    })
}

document.getElementById("searchAddress").addEventListener("submit", (event) => {
  event.preventDefault()
  let address = document.getElementById("address").value
  setLocation({location: address})
  .then((result) => {
    console.log(result)
    let pos = result.data.res[0].geometry.location
    let map = new google.maps.Map(document.getElementById("map"), {center: pos, zoom: 10, styles: mapStyles})
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
  })
  .catch((error) => {
    console.log("Error getting documents: ", error)
  })
})

const manageProfile = (uid) => {
  firebase.firestore().collection("users").where("uid", "==", uid)
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.data().uid)
            console.log(doc.data().name)
        })
    })
    .catch((error) => {
        console.log("Error getting documents: ", error)
    })
}

const manageListings = (uid) => {
  firebase.firestore().collection("circuit-listing").where("user", "==", uid)
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
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
    .catch((error) => {
        console.log("Error getting documents: ", error)
    })
}

document.getElementById("updateUserInfo").addEventListener("submit", (event) => {
  event.preventDefault()
  let u = Date.now()
  let n = document.getElementById("userName").value
  let p = document.getElementById("userPhone").value
  let e = document.getElementById("userEmail").value
  let img = document.getElementById("img").value

  let i = []
  let yi = [...document.getElementsByClassName("your-interests")]
  
  yi.forEach(getInterests)

  getInterests = (item, index) => {
    if(item.checked) {
      i.push(item.value)
    }
  }

  let pos = document.getElementById("userLocation").value.split(',')
  let l = new firebase.firestore.GeoPoint(+pos[0],+pos[1])

  let uid = document.getElementById("uid").value
  console.log([u,e,img,i,l,n,p,uid])
  // updateUserInfo(u,e,img,i,l,n,p,uid)
})

document.getElementById("saveListing").addEventListener("submit", (event) => {
  event.preventDefault()
  let t = document.getElementById("title").value
  let c = document.getElementById("category").value
  let d = document.getElementById("description").value
  let v = document.getElementById("datetimepicker1").value
  let u = document.getElementById("uid").value
  addListing(c,d,t,u,v)
})

$(function () {
  $('#datetimepicker1').datetimepicker()
})

let mapStyles = [{
  "elementType": "geometry",
  "stylers": [
    {
      "color": "#1d2c4d"
    }
  ]
},
{
  "elementType": "labels.text.fill",
  "stylers": [
    {
      "color": "#8ec3b9"
    }
  ]
},
{
  "elementType": "labels.text.stroke",
  "stylers": [
    {
      "color": "#1a3646"
    }
  ]
},
{
  "featureType": "administrative.country",
  "elementType": "geometry.stroke",
  "stylers": [
    {
      "color": "#4b6878"
    }
  ]
},
{
  "featureType": "administrative.land_parcel",
  "elementType": "labels.text.fill",
  "stylers": [
    {
      "color": "#64779e"
    }
  ]
},
{
  "featureType": "administrative.province",
  "elementType": "geometry.stroke",
  "stylers": [
    {
      "color": "#4b6878"
    }
  ]
},
{
  "featureType": "landscape.man_made",
  "elementType": "geometry.stroke",
  "stylers": [
    {
      "color": "#334e87"
    }
  ]
},
{
  "featureType": "landscape.natural",
  "elementType": "geometry",
  "stylers": [
    {
      "color": "#023e58"
    }
  ]
},
{
  "featureType": "poi",
  "elementType": "geometry",
  "stylers": [
    {
      "color": "#283d6a"
    }
  ]
},
{
  "featureType": "poi",
  "elementType": "labels.text.fill",
  "stylers": [
    {
      "color": "#6f9ba5"
    }
  ]
},
{
  "featureType": "poi",
  "elementType": "labels.text.stroke",
  "stylers": [
    {
      "color": "#1d2c4d"
    }
  ]
},
{
  "featureType": "poi.park",
  "elementType": "geometry.fill",
  "stylers": [
    {
      "color": "#023e58"
    }
  ]
},
{
  "featureType": "poi.park",
  "elementType": "labels.text.fill",
  "stylers": [
    {
      "color": "#3C7680"
    }
  ]
},
{
  "featureType": "road",
  "elementType": "geometry",
  "stylers": [
    {
      "color": "#304a7d"
    }
  ]
},
{
  "featureType": "road",
  "elementType": "labels.text.fill",
  "stylers": [
    {
      "color": "#98a5be"
    }
  ]
},
{
  "featureType": "road",
  "elementType": "labels.text.stroke",
  "stylers": [
    {
      "color": "#1d2c4d"
    }
  ]
},
{
  "featureType": "road.highway",
  "elementType": "geometry",
  "stylers": [
    {
      "color": "#2c6675"
    }
  ]
},
{
  "featureType": "road.highway",
  "elementType": "geometry.stroke",
  "stylers": [
    {
      "color": "#255763"
    }
  ]
},
{
  "featureType": "road.highway",
  "elementType": "labels.text.fill",
  "stylers": [
    {
      "color": "#b0d5ce"
    }
  ]
},
{
  "featureType": "road.highway",
  "elementType": "labels.text.stroke",
  "stylers": [
    {
      "color": "#023e58"
    }
  ]
},
{
  "featureType": "transit",
  "elementType": "labels.text.fill",
  "stylers": [
    {
      "color": "#98a5be"
    }
  ]
},
{
  "featureType": "transit",
  "elementType": "labels.text.stroke",
  "stylers": [
    {
      "color": "#1d2c4d"
    }
  ]
},
{
  "featureType": "transit.line",
  "elementType": "geometry.fill",
  "stylers": [
    {
      "color": "#283d6a"
    }
  ]
},
{
  "featureType": "transit.station",
  "elementType": "geometry",
  "stylers": [
    {
      "color": "#3a4762"
    }
  ]
},
{
  "featureType": "water",
  "elementType": "geometry",
  "stylers": [
    {
      "color": "#0e1626"
    }
  ]
},
{
  "featureType": "water",
  "elementType": "labels.text.fill",
  "stylers": [
    {
      "color": "#4e6d70"
    }
  ]
}]