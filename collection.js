// Grabbing elements
const charDisplayCollectionList = document.getElementById("charDisplayCollection-list");


// Loading the page and avoiding the global issue of putting it inside function
let savedChars;
if (localStorage.getItem("savedChars") === null) {
    savedChars = [];
}else{
    savedChars = JSON.parse(localStorage.getItem("savedChars"));
    renderChars(savedChars);
}


// Event Listeners
charDisplayCollectionList.addEventListener("click", deleteChar);


// Functions

function renderChars(savedChars) {    
    // NEED SORT CHARS ALPHABETICALLY SO IT PRINTS IN ORDER
    sortByNames(savedChars);
    
    // reset the display list to nothing so it renders array exactly
    charDisplayCollectionList.innerHTML = "";
    savedChars = JSON.parse(localStorage.getItem("savedChars"));
    for (i=0; i<savedChars.length; i++) {
        currChar = savedChars[i]; // easier access to object properties
        currChar.id = i;
        const charDiv = document.createElement('div');
        charDiv.classList.add("char-div");
        charDiv.id = i;
        
        const charLi = document.createElement('li');
        charLi.innerText = `Name: ${currChar.name}
        HP: ${currChar.maxHp}`
        charDiv.appendChild(charLi);
        
        const deleteButton = document.createElement("button");
        deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
        deleteButton.classList.add("delete-btn");
        charDiv.appendChild(deleteButton);

        charDisplayCollectionList.appendChild(charDiv);
        console.log(savedChars[i]);
    }
    // so the id's will sync
    localStorage.setItem("savedChars", JSON.stringify(savedChars));
}

function deleteChar(e) { 
    if (e.target.classList[0] === 'delete-btn') {
        savedChars = JSON.parse(localStorage.getItem("savedChars"));
        console.log("BELOW ARE THE CHARS");
        console.log(savedChars);
        const charHtml = e.target.parentElement;
        
        for(i=0; i<savedChars.length; i++) {
            if (savedChars[i].id == charHtml.id) {
                savedChars.splice(i,1);
            }
        }
        localStorage.setItem("savedChars", JSON.stringify(savedChars));

        renderChars();
    }
}

// Receive a character array and sort it
function sortByNames(arr) {
    console.log("sprt".localeCompare("sprt")) //returns -1 for <, 0 for =, 1 for >
}