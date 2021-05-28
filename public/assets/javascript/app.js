
let user = { username: 'foo', password: 'secret' }

hoodie.account.signUp(user).catch((e) => {
    //do nothing. thisjust gaurantees the user exists 
})

hoodie.account.get('session').then(function (session) {
    if (!session) {
        // user is signed out
        hoodie.account.signIn(user)
    }
})

function loadAndRenderItems() {
    hoodie.store.findAll().then(render)
}

generateLoginBox()
/* render items initially on page load */
loadAndRenderItems()

hoodie.store.on('change', loadAndRenderItems)
hoodie.store.on('clear', function () {
    render([])
})


function getUniqueUsername() {
    return localStorage.getItem('diy-username');
}

function setUniqueUsername(username) {
    localStorage.setItem('diy-username', username);
}


function generateLoginBox() {
    const loginPrompt = document.getElementById("login")
    const loginButton = document.getElementById("login-submit")
    const usn = getUniqueUsername()

    if (usn) {
        console.log("logged in as " + usn)
        const p = document.createElement("p")
        p.innerText = "Hello " + usn + "!"
        loginPrompt.innerHTML = '';
        loginPrompt.appendChild(p);
        
        // loginButton.innerText = "Log Out"
        loginButton.style.display = "none"
    } else {
        console.log("not logged in")
        const inp = document.createElement("input") 
        inp.type = "text"
        inp.placeholder = "Enter a username"
        loginPrompt.innerHTML = '';
        loginPrompt.appendChild(inp);

        loginButton.innerText = "Log In"
        loginButton.style.display = "initial"
        loginButton.onclick = () => {
            console.log("setting username to " + inp.value)
            setUniqueUsername(inp.value)
            // regen page on login
            generateLoginBox()
            loadAndRenderItems()
        }
    }
}

// This function takes a movie listed in the database, and prints it's associated info onto the table.
function listMovies(movieSnapshot) {
    var name = movieSnapshot.name;
    var genre = movieSnapshot.genre;
    var sellingPoint = movieSnapshot.sellingPoint;
    var votes = movieSnapshot.votes;
    var id = movieSnapshot._id;
    var disablevote = votes.includes(getUniqueUsername())

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
    votesCell.text(votes.length);
    newRow.append(votesCell);
    
    var castCell = $('<td scope="row">')
    var button = $(`<button class="btn btn-success vote-button" data-key=${id} ${disablevote? "disabled": ""}>`)
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
$("#submit").on("click", function(event) {
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
            votes: [],
            id: Math.floor(Math.random()*100000)
        });
        
        $('.form-control').val('');
    };
});

$(document).on("click", ".vote-button", function(event) { 
    event.preventDefault();

    var key = $(this).data("key")
    const usn = getUniqueUsername()
    hoodie.store.find(key).then((item)=> {
        if (!item.votes.includes(usn)) {
            item.votes.push(usn)
            hoodie.store.update(item)
        } else {
            console.log("you already voted for this")
        }
    })
})