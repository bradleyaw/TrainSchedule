// Initialize Firebase
var config = {
    apiKey: "AIzaSyDseAntBMaj-B1bOlhO3sHKvRHLajqRyq8",
    authDomain: "train-schedule-6ad5b.firebaseapp.com",
    databaseURL: "https://train-schedule-6ad5b.firebaseio.com",
    projectId: "train-schedule-6ad5b",
    storageBucket: "",
    messagingSenderId: "764042334297"
};
firebase.initializeApp(config);

var database = firebase.database();

// On submit of form
$("#submitID").on("click", function (event) {
    event.preventDefault();

    // setting variables to capture the three input fields
    var tName = $("#trainName").val().trim();
    var tDest = $("#destination").val().trim();
    var tTime = $("#time").val().trim();
    var tFreq = $("#frequency").val().trim();

    // Push input to Firebase
    database.ref().push({
        trainName: tName,
        trainDestination: tDest,
        trainTime: tTime,
        trainFrequency: tFreq,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });

    // Clear form after submit
    $("#trainName").val("");
    $("#destination").val("");
    $("#time").val("");
    $("#frequency").val("");

});
// On databse update or page load
database.ref().on("child_added", function (snapshot) {

    // set variables for each data point
    var dataName = snapshot.val().trainName;
    var dataDest = snapshot.val().trainDestination;
    var dataTime = snapshot.val().trainTime;
    var dataFreq = snapshot.val().trainFrequency;

    // Converts database/submitted time to readable format by moment.js and places in past
    var convTime = moment(dataTime, "HH:mm").subtract(1, "years");

    // Records difference in minutes between now and previous variable.
    var timeDiff = moment().diff(moment(convTime), "minutes");

    // Gets mod(remainder) that determines when the train last came in minutes
    var timeRem = timeDiff % dataFreq;

    // Gives us how many minutes until the next train.
    var timeNext = dataFreq - timeRem

    // Difference in time between our first train time and current time in minutes. Only applies if first train of day has not ran.
    var freqFirst = moment(moment(dataTime, "HH:mm")).diff(moment(), "minutes");

    // This is the current time + minutes until next train. Aka, arrival time.
    var timeArriv = moment().add(timeNext, "minutes");

    // The two variables are the final arrival times i nthe format we want to display. 
    // The first is based on the train that has started running today. The other is based on the idea that first train has yet to run.
    var convArriv = moment(timeArriv).format("hh:mm A");
    var convArrivElse = moment(dataTime, "HH:mm").format("hh:mm A");

    // Turn dataTime and currTime into integers so the values can be leveraged for if statement below.
    var dataTimeInt = parseInt(moment(moment(dataTime, "HH:mm")).format("x"));
    var currTimeInt = parseInt(moment().format("x"));

    // If the first train of the day has ran, display the following...
    if (dataTimeInt < currTimeInt) {
        $("tbody").append(
            "<tr>" +
                "<td scope='col'>"      + dataName +
                "</td><td scope='col'>" + dataDest +
                "</td><td scope='col'>" + dataFreq +
                "</td><td scope='col'>" + convArriv +
                "</td><td scope='col'>" + timeNext +
            "</tr>"
        );
    }
    // Else, display the following...
    else {
        $("tbody").append(
            "<tr>" +
                "<td scope='col'>"      + dataName +
                "</td><td scope='col'>" + dataDest +
                "</td><td scope='col'>" + dataFreq +
                "</td><td scope='col'>" + convArrivElse +
                "</td><td scope='col'>" + freqFirst +
            "</tr>"
        );
    }


});