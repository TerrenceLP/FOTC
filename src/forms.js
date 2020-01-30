export const addListing = (c,d,t,u,v) => {
    db.collection("circuit-listing").add({
        category: c,
        description: d,
        title: t,
        user: u,
        validUntil: v
    })
    .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
    })
    .catch(function(error) {
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
    .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
    })
    .catch(function(error) {
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
    .then(function(docRef) {
        console.log("Document Added with ID: ", docRef.id)
    })
    .catch(function(error) {
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
    .then(function(docRef) {
        console.log("Document Updated with ID: ", docRef.id)
    })
    .catch(function(error) {
        console.error("Error adding document: ", error)
    })
}