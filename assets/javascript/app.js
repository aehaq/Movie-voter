// Initialize Firebase
var config = {
    apiKey: "AIzaSyAMrOHyzkp35RwzUzl-s5hgjMkoZJwiyhw",
    authDomain: "database-434b0.firebaseapp.com",
    databaseURL: "https://database-434b0.firebaseio.com",
    projectId: "database-434b0",
    storageBucket: "database-434b0.appspot.com",
    messagingSenderId: "1018954509950"
};
firebase.initializeApp(config);

var database = firebase.database();

// This function converts arrival to be moment.js compatible, and ensures it uses today's date.
function firstArrival(initialVal) {
    var firstArrival = moment(initialVal, "hh:mm a")
    return firstArrival
};

// This function calculates when the nextArrival will be based off of the first arrival and the frequency of the train.
function nextArrival(firstArrival, interval) {
    
    // Gives the next arrival an initial value equal to the first arrival
    var nextArrival = firstArrival;
    
    // For every time that the train's next arrival has already occured, we move the next arrival up by the train's scheduled frequency.
    // This stops when the next arrival actually occurs after the current time.
    while (moment().diff(nextArrival, 'minute') > 0) {
        nextArrival = nextArrival.add(interval, 'minute') 
    }
    return nextArrival;
};

// Calculates time until next train's arrival, by comparing the arrival time to the current time.
function timeUntil(nextArrival) {
    var timeUntil = moment().diff(nextArrival, 'minute') * -1
    return timeUntil;
};

// This function takes a train listed in the database, and prints it's associated info onto the table.
function listTrains(trainSnapshot) {
    var name = trainSnapshot.name;
    var dest = trainSnapshot.destination;
    var original = trainSnapshot.originalTrain;
    var int = trainSnapshot.interval;
    
    //  Rather than store our calculations onto firebase, we run the necessary functions after retrieving the original information from the database.
    var firstTrain = firstArrival(original)
    var nextTrain = nextArrival(firstTrain, int);
    var timeLeft = timeUntil(nextTrain);
    
    // We create a new row to append the information associated wth the current .
    var newRow = $('<tr>')

    // We place the necessary information into individual cells, and append each to the new row.
    var nameCell = $('<td scope="row">')
    nameCell.text(name);
    newRow.append(nameCell);
    
    var destCell = $('<td scope="row">')
    destCell.text(dest);
    newRow.append(destCell);
    
    var freqCell = $('<td scope="row">')
    freqCell.text(int);
    newRow.append(freqCell);
    
    var nextCell = $('<td scope="row">')
    nextCell.text(nextTrain.format("HH:mm"));
    newRow.append(nextCell);
    
    var awayCell = $('<td scope="row">')
    awayCell.text(timeLeft + " min");
    newRow.append(awayCell);

    // We append the new row to the table.   
    $('#trains-here').append(newRow);
};

// This function is used to render the list of trains without making changes to firebase
function render() {

    // This rerenders the information in the database and takes a snapshot of the whole thing as an object.
    database.ref().once("value", function(snapshot){

        // We must empty the table out since we will work through the entire database again.
        $('#trains-here').empty();

        // Here we narrow our scope to an object containing all of the trains.
        var trainsObject = snapshot.val();

        // We then iterate through the trains on the list and add each batch of information to the table
        for (key in trainsObject) {
            listTrains(trainsObject[key]);
        }
    });
}

$(document).ready(function() {
    
    // This function calls the list train function when a change is made to the database.
    // When the page loads, this function is run once automatically, and filters through every single train as though it was newly added. 
    database.ref().on("child_added", function(snapshot) {
        listTrains(snapshot.val());
    });

    // This function is run when users want to add train information to the list.
    // It pushes the train into the database, triggering the child added function which sprints them on the page.
    $("#submit").on("click", function() {
        event.preventDefault();
        
        // Here we grab the user data from the forms on page and stores them as variables.
        var name = $('#name-input').val();
        var dest = $('#dest-input').val();
        var initTrain = $('#initial-input').val();
        var frequency = $('#freq-input').val();

        // This if statement ensures that none of the forms were left empty.        
        if (name != "" && dest != "" && initTrain != "" && frequency != "") {
            
            //If none of the forms were empty, the data is pushed to firebase.
            database.ref().push({
                name: name,
                destination: dest,
                originalTrain: initTrain,
                interval: frequency
            });
            
            $('.form-control').val('');
        };
    });

    // In order to keep the train schedule up to date, we run the render function every 10 seconds.
    // Because the calculations happen every time the table is rendered, the minutes left and next arrival will change whenever necessary
    setInterval(render, 10000);
});