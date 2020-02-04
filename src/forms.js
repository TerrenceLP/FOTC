export const addListing = (c,d,t,u,v) => {
    db.collection("circuit-listing").add({
        category: c,
        description: d,
        title: t,
        user: u,
        validUntil: v
    })
    .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
    })
    .catch((error) => {
        console.error("Error adding document: ", error);
    })
}

export const updateListing = (c,d,t,u,v) => {
    db.collection("circuit-listing").set({
        category: c,
        description: d,
        title: t,
        user: u,
        validUntil: v
    },
    {
        merge: true 
    })
    .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
    })
    .catch((error) => {
        console.error("Error adding document: ", error);
    })
}

export const addUserInfo = (c,e,img,i,l,n,p,uid) => {
    db.collection("users").add({
        created: c,
        email: e,
        image: img,
        interest: i,
        location: l,
        name: n,
        phone: p,
        uid: uid
    })
    .then((docRef) => {
        console.log("Document Added with ID: ", docRef.id)
    })
    .catch((error) => {
        console.error("Error adding document: ", error)
    })
}

export const updateUserInfo = (c,e,img,i,l,n,p,uid) => {
    db.collection("users").set({
        created: c,
        email: e,
        image: img,
        interest: i,
        location: l,
        name: n,
        phone: p,
        uid: uid
    }, 
    { 
        merge: true 
    })
    .then((docRef) => {
        console.log("Document Updated with ID: ", docRef.id)
    })
    .catch((error) => {
        console.error("Error adding document: ", error)
    })
}

import { firebase } from "./google"
import "firebase/firestore"
import faker from "faker"
faker.locale = "en_US"
const db = firebase.firestore()

const addFakeUserInfo = () => {
    let interest = [faker.random.word(),faker.random.word(),faker.random.word(),faker.random.word(),faker.random.word()] 

    db.collection("users").add({
        created: Date.now(),
        email: faker.internet.email(),
        image: faker.internet.avatar(),
        interest: interest,
        location: new firebase.firestore.GeoPoint(+faker.address.latitude(),+faker.address.longitude()),
        name: faker.name.findName(),
        phone: faker.phone.phoneNumber(),
        uid: faker.random.uuid()
    })
    .then((docRef) => {
        console.log("Document Added with ID: ", docRef.id)
    })
    .catch((error) => {
        console.error("Error adding document: ", error)
    })
}
// [...Array(7)].forEach((_, i) => addFakeUserInfo(i + 1))