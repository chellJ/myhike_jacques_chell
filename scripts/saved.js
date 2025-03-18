function doAll() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            insertNameFromFirestore(user);
            getBookmarks(user);
        } else {
            console.log("Not logged in");
        }
    });
}
doAll();

function insertNameFromFirestore(user){
    db.collection("users").doc(user.uid).get()
    .then(userDoc => {
        userName = userDoc.data().name;
        console.log(userName);
        document.getElementById("name-goes-here").innerHTML = userName;
    });
}

function getBookmarks(user) {
    db.collection("users").doc(user.uid).get()
    .then(userDoc => {
        //get bookmarks array
        var bookmarks = userDoc.data().bookmarks;
        console.log(bookmarks);

        //get card template
        let newCardTemplate = document.getElementById("savedCardTemplate");

        //create card for each bookmarked hike
        bookmarks.forEach(thisHikeID =>{
            console.log(thisHikeID);
            db.collection("hikes").doc(thisHikeID).get()
            .then(doc => {
                var title = doc.data().name; //get hike name
                var hikeCode = doc.data().code; //get hikecode
                var hikeLength = doc.data().length; //get hike length
                var docID = doc.id; //get hike ID

                let newcard = newCardTemplate.content.cloneNode(true);

                newcard.querySelector('.card-title').innerHTML = title;
                newcard.querySelector('.card-length').innerHTML =
                        "Length: " + doc.data().length + " km <br>" +
                        "Duration: " + doc.data().hike_time + "min <br>" +
                        "Last updated: " + doc.data().last_updated.toDate().toLocaleDateString();
                newcard.querySelector('.card-image').src = `./images/${hikeCode}.jpg`; //Example: NV01.jpg
                newcard.querySelector('a').href = "eachHike.html?docID=" + docID;

                hikeCardGroup.appendChild(newcard);
            });
        });
    });
}