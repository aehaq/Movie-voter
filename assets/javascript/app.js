$(document).ready(function() {
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


// This function takes a train listed in the database, and prints it's associated info onto the table.
function listMovies(movieSnapshot) {
    var name = movieSnapshot.name;
    var genre = movieSnapshot.genre;
    var sellingPoint = movieSnapshot.sellingPoint;
    var votes = movieSnapshot.votes;
    
    console.log(movieSnapshot)
    // We create a new row to append the information associated wth the current .
    var newRow = $('<tr>')

    // We place the necessary information into individual cells, and append each to the new row.
    var nameCell = $('<td scope="row">')
    nameCell.text(name);
    newRow.append(nameCell);
    
    var genreCell = $('<td scope="row">')
    genreCell.text(genre);
    newRow.append(genreCell);
    
    var sellCell = $('<td scope="row">')
    sellCell.text(sellingPoint);
    newRow.append(sellCell);

    var votesCell = $('<td scope="row">')
    votesCell.text(votes);
    newRow.append(votesCell);
    
    var castCell = $('<td scope="row">')
    var button = $(`<button class="btn btn-success" data-key=${movieSnapshot.key}>`)
    button.text("VOTE!")
    castCell.append(button)
    newRow.append(castCell);

    // We append the new row to the table.   
    $('#movies-here').append(newRow);
};

// This function is used to render the list of trains without making changes to firebase
function render() {

    // This rerenders the information in the database and takes a snapshot of the whole thing as an object.
    database.ref().once("value", function(snapshot){

        // We must empty the table out since we will work through the entire database again.
        $('#movies-here').empty();

        // Here we narrow our scope to an object containing all of the trains.
        var moviesObject = snapshot.val();

        // We then iterate through the trains on the list and add each batch of information to the table
        for (key in moviesObject) {
            listMovies(moviesObject[key]);
        }
    });
}

    
    // This function calls the list train function when a change is made to the database.
    // When the page loads, this function is run once automatically, and filters through every single train as though it was newly added. 
    database.ref().on("child_added", function(snapshot) {
        listMovies(snapshot.val());
    });

    // This function is run when users want to add train information to the list.
    // It pushes the train into the database, triggering the child added function which sprints them on the page.
    $("#submit").on("click", function() {
        event.preventDefault();
        
        // Here we grab the user data from the forms on page and stores them as variables.
        var name = $('#name-input').val();
        var genre = $('#genre-input').val();
        var sellingPoint = $('#sell-input').val();

        // This if statement ensures that none of the forms were left empty.        
        if (name != "" && genre != "" && sellingPoint != "") {
            
            //If none of the forms were empty, the data is pushed to firebase.
            database.ref().push({
                name: name,
                genre: genre,
                sellingPoint: sellingPoint,
                votes: 0,
                id: Math.floor(Math.random()*100000)
            });
            
            $('.form-control').val('');
        };
    });

    // In order to keep the train schedule up to date, we run the render function every 10 seconds.
    // Because the calculations happen every time the table is rendered, the minutes left and next arrival will change whenever necessary
    setInterval(render, 10000);
});