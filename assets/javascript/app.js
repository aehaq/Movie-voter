function loadAndRenderItems() {
    hoodie.store.findAll().then(render)
}

/* render items initially on page load */
loadAndRenderItems()

hoodie.store.on('change', loadAndRenderItems)
hoodie.store.on('clear', function () {
    render([])
})

// This function takes a movie listed in the database, and prints it's associated info onto the table.
function listMovies(movieSnapshot) {
    var name = movieSnapshot.name;
    var genre = movieSnapshot.genre;
    var sellingPoint = movieSnapshot.sellingPoint;
    var votes = movieSnapshot.votes;
    var id = movieSnapshot._id;

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
    var button = $(`<button class="btn btn-success vote-button" data-key=${id}>`)
    button.text("VOTE!")
    castCell.append(button)
    newRow.append(castCell);

    // We append the new row to the table.   
    $('#movies-here').append(newRow);
};

// This function is used to render the list of movies without making changes to firebase
function render(moviesObject) {
    // We must empty the table out since we will work through the entire database again.
    $('#movies-here').empty();

    // We then iterate through the movies on the list and add each batch of information to the table
    for (key in moviesObject) {
        listMovies(moviesObject[key]);
    }
}

    
    // This function calls the list movie function when a change is made to the database.
    // When the page loads, this function is run once automatically, and filters through every single movie as though it was newly added. 
    hoodie.on("child_added", function(snapshot) {
        listMovies(snapshot.val());
    });

    // This function is run when users want to add movie information to the list.
    // It pushes the movie into the database, triggering the child added function which sprints them on the page.
    $("#submit").on("click", function() {
        event.preventDefault();
        
        // Here we grab the user data from the forms on page and stores them as variables.
        var name = $('#name-input').val();
        var genre = $('#genre-input').val();
        var sellingPoint = $('#sell-input').val();

        // This if statement ensures that none of the forms were left empty.        
        if (name != "" && genre != "" && sellingPoint != "") {
            
            //If none of the forms were empty, the data is pushed to firebase.
            hoodie.store.add({
                name: name,
                genre: genre,
                sellingPoint: sellingPoint,
                votes: 0,
                id: Math.floor(Math.random()*100000)
            });
            
            $('.form-control').val('');
        };
    });

    $(document).on("click", ".vote-button", function() { 
        event.preventDefault();

        var key = $(this).data("key")
        hoodie.store.update(key, (value) => {
            value.votes += 1
        })
    })