
// web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyAr7Y1nN_Nkbd4vRjt1OuYIvTFDF2JGvEc",
    authDomain: "pinar-test-6cab9.firebaseapp.com",
    databaseURL: "https://pinar-test-6cab9.firebaseio.com",
    projectId: "pinar-test-6cab9",
    storageBucket: "pinar-test-6cab9.appspot.com",
    messagingSenderId: "679947490492",
    appId: "1:679947490492:web:583272a09ffbe6663fecb9",
    measurementId: "G-L6TTW6YD0V"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const database = firebase.database();
console.log(database)


// The user should be able to fill out a form and when they submit that form, the input is sent to firebase.
// All of the trains within firebase will be loaded to the UI through a table.
// The trains displayed will show all of the train information Including the next train from the current time.
// USe moment to display times

$("#form_group_submit").click(function (pinar) {
    pinar.preventDefault();
    // trainName, destination firstTrain, frequency
    let name = $("#trainName").val().trim();
    let destination = $("#destination").val().trim();
    let train = $("#firstTrain").val().trim();
    let frequency = $("#frequency").val().trim();


    // Creates local "temporary" object for holding train data
    let train1 = {
        name: name,
        destination: destination,
        train: train,
        frequency: frequency
    };

    // Uploads train data to the database
    database.ref().push(train1);

    // Logs everything to console
    console.log(train1.name);
    console.log(train1.destination);
    console.log(train1.train);
    console.log(train1.frequency);

    alert("Train successfully added");

    // Clears all of the text-boxes 
    $("#trainName").val("");
    $("#destination").val("");
    $("#firstTrain").val("");
    $("#frequency").val("");


});


// Create Firebase event for adding train info to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function (childSnapshot) {
    console.log(childSnapshot.val());

    // Store everything into a variable.
    let trainName = childSnapshot.val().name;
    let trainDestination = childSnapshot.val().destination;
    let firstTrainTime = childSnapshot.val().train;
    let trainFrequency = childSnapshot.val().frequency;


    // train Info
    console.log(trainName);
    console.log(trainDestination);
    console.log(firstTrainTime);
    console.log(trainFrequency);


    // Current Time
    let currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));

    // First Time (pushed back 1 year to make sure it comes before current time)
    let firstTimeConverted = moment(firstTrainTime, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    //calculate difference between times
    // To calculate the next train arrival
    let difference = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + difference);


    //time apart(remainder)
    let frequency = $("#frequency").val().trim();
    let trainRemain = difference % trainFrequency;
    console.log(trainRemain);

    //minutes until arrival

    let minAway = trainFrequency - trainRemain;
    console.log("MINUTES TILL TRAIN: " + minAway);

    // Next Train
    let nextTrain = moment().add(minAway, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("HH:mm"));



    // Create the new row
    let newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(trainDestination),
        $("<td>").text(trainFrequency),
        $("<td>").text(nextTrain),
        $("<td>").text(minAway)
    );

    // Append the new row to the table

    $("#trainTable> tbody").append(newRow);

}, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
});
















