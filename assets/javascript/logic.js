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

database.ref().on("child_added", function (snapshot) {
    var dataName = snapshot.val().trainName;
    var dataDest = snapshot.val().trainDestination;
    var dataTime = snapshot.val().trainTime;
    var dataFreq = snapshot.val().trainFrequency;

    var convTime = moment(dataTime, "HH:mm").subtract(1, "years");

    var timeDiff = moment().diff(moment(convTime), "minutes");

    var timeRem = timeDiff % dataFreq;

    var timeNext = dataFreq - timeRem
    var freqFirst = moment(moment(dataTime, "HH:mm")).diff(moment(), "minutes");

    var timeArriv = moment().add(timeNext, "minutes");
    var convArriv = moment(timeArriv).format("hh:mm")

    var dataTimeInt = parseInt(moment(moment(dataTime, "HH:mm")).format("x"));
    var currTimeInt = parseInt(moment().format("x"));

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
    else {
        $("tbody").append(
            "<tr>" +
                "<td scope='col'>"      + dataName +
                "</td><td scope='col'>" + dataDest +
                "</td><td scope='col'>" + dataFreq +
                "</td><td scope='col'>" + dataTime +
                "</td><td scope='col'>" + freqFirst +
            "</tr>"
        );
    }


});