// Get Elements
    // Column 1
const charNameInput = document.getElementById("charName-input");
const initInput = document.getElementById("init-input");
const maxHpInput = document.getElementById("maxHp-input");
const currHpInput = document.getElementById("currHp-input");
const saveToCollectionCheck = document.getElementById("saveToCollection-check");
const createCharBtn = document.getElementById("createChar-btn");
const startCombatBtn = document.getElementById("startCombat-btn");
const loadCharFromCollectionSel = document.getElementById("loadCharFromCollection-sel");
const loadCharFromCollectionBtn = document.getElementById("loadCharFromCollection-btn");
const charList = document.getElementById("charDisplay-list");

    // Column 2
const battleLogTurnInfoDiv = document.getElementById("battleLogTurnInfo-div");
const conditionsUl = document.getElementById("condBox-ul");
const battleLogDiv = document.getElementById("battleLog-div");
const nextTurnBtn = document.getElementById("nextTurn-btn");

    // Column 3

const rollResultEl = document.getElementById("rollResult-el");
const dmgQuantInp = document.getElementById("dmgQuant-inp");
const dmgSidesSel = document.getElementById("dmgSides-sel");
const dmgModifInp = document.getElementById("dmgModif-inp");
const dmgResultEl = document.getElementById("dmgResult-el");
const rollDmgBtn = document.getElementById("rollDmg-btn");
const useRolledDmgBtn = document.getElementById("useRolledDmg-btn");
const dmDmgInp = document.getElementById("dmDmg-inp");
const dmDmgCharSel = document.getElementById("dmDmgChar-sel");
const applyDmgBtn = document.getElementById("applyDmg-btn");
const dmConditionSel = document.getElementById("dmCondition-sel");
const dmConditionCharSel = document.getElementById("dmConditionChar-sel");
const applyConditionBtn = document.getElementById("applyCondition-btn");

// Local storage and characters array
let savedChars;
if (JSON.parse(localStorage.getItem("savedChars"))){
    savedChars = JSON.parse(localStorage.getItem("savedChars"));
}else{
    savedChars = [];
}
console.log("Below are savedChars from local storage");
console.log(savedChars);
let activeChars = [];
let activeIndex = 0; //Every time next turn is clicked it will ++

// Load the add char from savedchars
for(let i=0; i<savedChars.length; i++) {
    charOption = document.createElement("option");
    charOption.value = i;
    charOption.innerText = savedChars[i].name;
    loadCharFromCollectionSel.appendChild(charOption);
};


// Event Listeners

    // DOCUMENT
// document.addEventListener('DOMContentLoaded', getChars);

    //COLUMN 1
// Add New character to list - NEED TO WORK ON LOCAL STORAGE ACTIVE CHARS
createCharBtn.addEventListener("click", function(event) {
    event.preventDefault();
    newChar = {
        name: "",
        init: -1,
        maxHp: -1,
        currHp: -1,
        alive: true,
        conditions: [],
        id: -1
    }
    // Check if name, max hp, initiative inputs are valid
    if (charNameInput.value && maxHpInput.value > 0 && initInput.value) {
        newChar.name = charNameInput.value;
        newChar.maxHp = parseInt(maxHpInput.value);
        newChar.init = parseInt(initInput.value);
        // In case we get invalid input that current hp is greater than maximum HP
        if (currHpInput.value > maxHpInput.value) {
            charList.innerHTML += `
                <li>
                    cant set current hp to be greater than max hp
                </li>
            `;

        // In case no current HP is entered- it will be set to equal max HP
        }else if (currHpInput.value == "") {
            newChar.currHp = newChar.maxHp;
            resetNewCharForm();

        // In case all input is valid set everything respectively
        }else{
            newChar.currHp = parseInt(currHpInput.value);
            resetNewCharForm();
        }

        if (saveToCollectionCheck.checked) {
            newChar.id = savedChars.length;
            savedChars = insertIntoArrayByKey(savedChars, newChar, "name");
            console.log(savedChars);
            localStorage.setItem("savedChars",JSON.stringify(savedChars));
            saveToCollectionCheck.checked = false;
        }

        activeChars = insertIntoArrayByKey(activeChars, newChar, "init");
        console.log("below are activeChars");
        console.log(activeChars);
        localStorage.setItem("activeChars",JSON.stringify(activeChars));
        renderActiveChars();
    }
});

loadCharFromCollectionBtn.addEventListener("click", function() {
    // copy the relevant stats to the form
    console.log("entered the add from collection btn");
    console.log(loadCharFromCollectionSel.value);
    const loadChar = savedChars[loadCharFromCollectionSel.value];
    // Set the name and maxHp to be those of chars[i]
    charNameInput.value = loadChar.name;
    maxHpInput.value = loadChar.maxHp;
});

startCombatBtn.addEventListener("click", function(e){
    e.preventDefault();
    // STYLE THE TURN BUTTONS FROM HIDDEN
    nextTurnBtn.style="display: block";
    // Start first turn
    turn();
});


    // COLUMN 2

nextTurnBtn.addEventListener("click", turn);

// To delete a condition by pressing trash button
conditionsUl.addEventListener("click", function(e){
    if (e.target.classList[0] === 'deleteCondition-btn') {
        console.log("need to delete this");
        console.log(e.target.parentElement.textContent);

        // Remove cond from character
        let charConds = activeChars[activeIndex-1].conditions;
        console.log(charConds);
        let index = charConds.indexOf(e.target.parentElement.textContent);
        charConds.splice(index, 1);

        // Remove cond visually
        e.target.parentElement.remove();
    }
});

battleLogTurnInfoDiv.addEventListener("click", function(e){
    if (e.target.classList[0] === 'kill-btn') {
        if(activeIndex === 0) {
            activeIndex = activeChars.length - 1;
        }else{
            activeIndex--;
        }
        activeChars.splice(activeIndex, 1);
        console.log(activeChars);
        console.log(activeChars[activeIndex]);

    }
});
    

    // COLUMN 3

// Copy the dmg roll result to the dm actions dmg input
useRolledDmgBtn.addEventListener("click", function (){
    console.log("use rolled dmg");
    if (dmgResultEl.innerText === "dmg result") {
        dmDmgInp.value = 0;
    }else{
        dmDmgInp.value = dmgResultEl.innerText;
    }
});


// Roll multiple dice to calculate damage with modifier
rollDmgBtn.addEventListener("click", function(){
    //get elements
    const quant = parseInt(dmgQuantInp.value);
    const sides = parseInt(dmgSidesSel.value);
    const modif = parseInt(dmgModifInp.value);
    // for loop summing up QUANT number of SIDES sided dice (random number between 1 through SIDES) and
    let sum = modif;
    for (i=1; i<=quant; i++) {
        const rand = Math.floor(Math.random() * sides + 1);
        sum+=rand;
        console.log(rand);
    }
    //setting the text to be the result
    dmgResultEl.innerHTML = `<b>${sum}</b>`;
});

applyDmgBtn.addEventListener("click", applyDamage);


// Applying a condition to the character - adding it to condition array
applyConditionBtn.addEventListener("click", function(){
    const cond = dmConditionSel.value;
    const charConds = activeChars[dmConditionCharSel.value].conditions;
    let index = charConds.indexOf(cond);
    if (index < 0) {
        charConds.push(cond);
    }else{
        charConds.splice(index, 1);
    }
    console.log(activeChars[dmConditionCharSel.value]);
    localStorage.setItem("activeChars", JSON.stringify(activeChars));
});


// Functions

// Updating the forms with options of chars (called with activeChars)
function renderActiveChars() {
    // Updating forms
    dmDmgCharSel.innerHTML = "";
    dmConditionCharSel.innerHTML = "";
    charList.innerHTML = "";
    for(let i=0; i<activeChars.length; i++) {
        console.log(activeChars[i].name);
        let charOption = document.createElement("option");
        charOption.value = i;
        charOption.innerText = activeChars[i].name;
        dmDmgCharSel.appendChild(charOption);
        
        // ADD TO THE CONDITIONS SELECT ALSO
        let charOption2 = document.createElement("option");
        charOption2.value = i;
        charOption2.innerText = activeChars[i].name;
        dmConditionCharSel.appendChild(charOption2);
        
        // Updating round order
        // Print character on screen
        let charLi = document.createElement("li");
        if (activeIndex === i) {
            charLi.classList.add("highlighted-li");
        };
        charLi.innerText = `${activeChars[i].name}, initiative: ${activeChars[i].init}, HP: ${activeChars[i].currHp}/${activeChars[i].maxHp}`
        charList.appendChild(charLi);
    }
};

// Resetting the adding character form
function resetNewCharForm() {
    charNameInput.value = "";
    maxHpInput.value = "";
    currHpInput.value = "";
    initInput.value = "";
}

// Receives an array, object, and a key and will insert the object into the array by name or initiative
function insertIntoArrayByKey(arr, obj, key) {
    let index = 0;
    let found = false;
    if(key === "name") {
        console.log("insert into array by name");
        for (let i=0; i<arr.length; i++) {
            if (obj.name.localeCompare(arr[i].name) === -1) {
                index = i;
                i = arr.length;
                found = true;
            }
        }
    }else if(key === "init") {
        console.log("insert into array by init");
        if (!arr) {
            arr[0] = obj;
        }else{
            for (let i=0; i<arr.length; i++) {
                if (obj.init > arr[i].init) {
                    index = i;
                    i = arr.length;
                    found = true;
            }

        }
    }
    // if it tries a key that is not init or name - shouldnt happen
    }else {
        console.log("ERROR - key need to be either 'init' or 'name'. Object not inserted");
        return arr;
    }
    
    if (!found) {
        index = arr.length;
    }
    arr.splice(index,0,obj);
    return arr;
}

    // Column 2

// Receives index of a character and dmg to be dealt, will substract the dmg from curr hp of target
// FINISH FINISH FINISH

function turn() {
    if (activeIndex >= activeChars.length) {
        activeIndex = 0;
    }
    battleLogDiv.innerHTML = ""; // Clear the battle log
    battleLogTurnInfoDiv.innerHTML = "";
    conditionsUl.innerHTML = "";
    renderActiveChars();

    if(activeChars.length === 0) { //If no characters active
        console.log("entered");
        const errorMsg = document.createElement('div');
        errorMsg.innerText = "ERROR - NO CHARACTERS IN COMBAT";
        battleLogDiv.appendChild(errorMsg);

    }else{ // Here the turn really begins
        let currChar = activeChars[activeIndex];
        const info = document.createElement('div');
        info.classList.add("logInfo-el");
        if (currChar.alive){
            // Create Log message whose turn it is
            info.innerText = `Initiative: ${currChar.init}
            This is ${currChar.name}'s Turn (${activeChars[(activeIndex+1)%activeChars.length].name} is up next)
            HP: ${currChar.currHp} / ${currChar.maxHp}, Conditions:
            `;

            // Create Log message detailing conditions
            for(let i=0; i<currChar.conditions.length; i++) {
                const condBoxLi = document.createElement('li');
                condBoxLi.classList.add("condBox-li");
                condBoxLi.innerText = currChar.conditions[i];
                const condBoxTrash = document.createElement('button');
                condBoxTrash.innerHTML = '<i class="fas fa-trash"></i>';
                condBoxTrash.classList.add("deleteCondition-btn");
                condBoxLi.appendChild(condBoxTrash);
                conditionsUl.appendChild(condBoxLi);
            }
        }else{
            // Log death Screen
            info.innerText = `Initiative: ${currChar.init}
            ${currChar.name} is dead - Make a death saving throw`;
            const killBtn = document.createElement('button');
            killBtn.classList.add("kill-btn");
            killBtn.innerText = `Kill ${currChar.name}`;
            info.appendChild(killBtn);
        }
        battleLogTurnInfoDiv.appendChild(info);
    }
    console.log(activeChars.length);
    if (activeIndex <= activeChars.length ) {
        activeIndex++;
    }
}

    // Column 3

// Rolling d20, with adv or dis ----- NEED TO CHANGE TO EVENT LISTENER INSTEAD OF ONCLICK
function rollDice(sides, mod, adv) {
    let roll1 = Math.floor(Math.random() * sides + 1);
    let roll2 = Math.floor(Math.random() * sides + 1);
    switch(adv) {
        case 0:
            rollResultEl.textContent = Math.min(roll1, roll2);
            rollResultEl.textContent += " (" + roll1 + ", " + roll2 + ")";
            break;
        case 2:
            rollResultEl.textContent = Math.max(roll1, roll2);
            rollResultEl.textContent += " (" + roll1 + ", " + roll2 + ")";
            break;
        default:
            rollResultEl.textContent = roll1;
    }
}

// Reducing damage from current HP and logging into battle log if something happens
function applyDamage(){
    // Cases: insta death; concentration and other saves upon damage
    // NEED: TO UNDERSTAND HOW TO START A NEW LINE OF TEXT (MAYBE APPENDING MORE DIVS)

    const dmg = dmDmgInp.value;
    const currChar = activeChars[dmDmgCharSel.value];
    const logMsg = document.createElement('div');
    logMsg.classList.add("logMsg-el");
    
    // Case: bleeding
    if (currChar.currHp > currChar.maxHp/2 && currChar.currHp - dmg < currChar.maxHp/2){
        const bleedMsg = document.createElement('div');
        bleedMsg.classList.add("logMsgExtra-el");
        bleedMsg.innerText = `${currChar.name} is bleeding`;
        logMsg.appendChild(bleedMsg);
    }

    // Case: damaging a downed char
    if (dmg > 0 && !currChar.alive) {
        const ouchMsg = document.createElement('div');
        ouchMsg.classList.add("logMsgExtra-el");
        ouchMsg.innerText = `OUCH! ${currChar.name} got a negative death save`;
        logMsg.appendChild(ouchMsg);
    }
    
    currChar.currHp -= dmg;
    if (currChar.currHp > 0) {
        currChar.alive = true;
    }
    else{
        currChar.alive = false;
    }

    // Default text
    const defaultMsg = document.createElement('div');
    defaultMsg.classList.add("logMsgExtra-el");
    defaultMsg.innerText = `Dealt ${dmg} points of damage to ${currChar.name}
    ${currChar.name}'s HP: ${currChar.currHp} / ${currChar.maxHp}`;
    logMsg.appendChild(defaultMsg);

    // Concentration saves
    if (currChar.conditions.includes("Concentration") && dmg > 0){
        const conMsg = document.createElement('div');
        conMsg.classList.add("logMsgExtra-el");
        conMsg.innerText = currChar.name + " needs to make a concentration saving throw.";
        logMsg.appendChild(conMsg);
    }
    // Other saves that might happen upon damage
    if (dmg > 0 && (currChar.conditions.includes("Charmed") || currChar.conditions.includes("Frightened") || currChar.conditions.includes("Paralyzed") || currChar.conditions.includes("Stunned"))){
        const othersMsg = document.createElement('div');
        othersMsg.classList.add("logMsgExtra-el");
        othersMsg.innerText = currChar.name + " has conditions which might trigger a saving throw by being damaged.";
        logMsg.appendChild(othersMsg);
    }

    // Case: healing too much
    if (currChar.currHp > currChar.maxHp){
        currChar.currHp = currChar.maxHp;
    };
    // Case: normal death
    if (currChar.currHp <= 0){
        const unconMsg = document.createElement('div');
        unconMsg.innerText = `${currChar.name} is Unconcious`;
        logMsg.appendChild(unconMsg);
        currChar.currHp = 0;
        currChar.alive = false;
        console.log(currChar.alive);
    };
    
    battleLogDiv.appendChild(logMsg);

    renderActiveChars();

}










// Displaying condition
function displayCondition(num) {
    let conditionTextEl = document.getElementById("conditionText-el");
    switch (num) {
        case (1):
            conditionTextEl.textContent = `A blinded creature can’t see and automatically fails any ability check that requires sight.

            Attack rolls against the creature have advantage, and the creature’s Attack rolls have disadvantage.`;
            break;
        case (2):
            conditionTextEl.textContent = `A charmed creature can’t Attack the charmer or target the charmer with harmful Abilities or magical Effects.

            The charmer has advantage on any ability check to interact socially with the creature.`;
            break;
        case (3):
            conditionTextEl.textContent = "Whenever you take damage while you are concentrating on a spell, you must make a Constitution saving throw to maintain your Concentration. The DC equals 10 or half the damage you take, whichever number is higher. If you take damage from multiple sources, such as an arrow and a dragon’s breath, you make a separate saving throw for each source of damage.";
            break;
        case (4):
            conditionTextEl.textContent = "A deafened creature can’t hear and automatically fails any ability check that requires hearing.";
            break;    
        case (5):
            conditionTextEl.textContent = `A frightened creature has disadvantage on Ability Checks and Attack rolls while the source of its fear is within Line of Sight.
            
            The creature can’t willingly move closer to the source of its fear.`;
            break;    
        case (6):
            conditionTextEl.textContent = `A grappled creature’s speed becomes 0, and it can’t benefit from any bonus to its speed.

            The condition ends if the Grappler is incapacitated (see the condition).
    
            The condition also ends if an Effect removes the grappled creature from the reach of the Grappler or Grappling Effect, such as when a creature is hurled away by the Thunderwave spell.`;
            break;    
        case (7):
            conditionTextEl.textContent = "An incapacitated creature can’t take Actions or Reactions.";
            break;    
        case (8):
            conditionTextEl.textContent = `An invisible creature is impossible to see without the aid of magic or a Special sense. For the Purpose of Hiding, the creature is heavily obscured. The creature’s Location can be detected by any noise it makes or any tracks it leaves.
            
            Attack rolls against the creature have disadvantage, and the creature’s Attack rolls have advantage.`;
            break;    
        case (9):
            conditionTextEl.textContent = `A paralyzed creature is incapacitated (see the condition) and can’t move or speak.

            The creature automatically fails Strength and Dexterity Saving Throws.

            Attack rolls against the creature have advantage.

            Any Attack that hits the creature is a critical hit if the attacker is within 5 feet of the creature.`;
            break;    
        case (10):
            conditionTextEl.textContent = `A petrified creature is transformed, along with any nonmagical object it is wearing or carrying, into a solid inanimate substance (usually stone). Its weight increases by a factor of ten, and it ceases aging.

            The creature is incapacitated (see the condition), can’t move or speak, and is unaware of its surroundings.

            Attack rolls against the creature have advantage.

            The creature automatically fails Strength and Dexterity Saving Throws.

            The creature has Resistance to all damage.

            The creature is immune to poison and disease, although a poison or disease already in its system is suspended, not neutralized.`;
            break;    
        case (11):
            conditionTextEl.textContent = "A poisoned creature has disadvantage on Attack rolls and Ability Checks.";
            break;    
        case (12):
            conditionTextEl.textContent = `A prone creature’s only Movement option is to crawl, unless it stands up and thereby ends the condition.

            The creature has disadvantage on Attack rolls.

            An Attack roll against the creature has advantage if the attacker is within 5 feet of the creature. Otherwise, the Attack roll has disadvantage.`;
            break;    
        case (13):
            conditionTextEl.textContent = `A restrained creature’s speed becomes 0, and it can’t benefit from any bonus to its speed.

            Attack rolls against the creature have advantage, and the creature’s Attack rolls have disadvantage.

            The creature has disadvantage on Dexterity Saving Throws.`;
            break;    
        case (14):
            conditionTextEl.textContent = `A stunned creature is incapacitated (see the condition), can’t move, and can speak only falteringly.

            The creature automatically fails Strength and Dexterity Saving Throws.

            Attack rolls against the creature have advantage.`;
            break;    
        case (15):
            conditionTextEl.textContent = `An unconscious creature is incapacitated (see the condition), can’t move or speak, and is unaware of its surroundings

            The creature drops whatever it’s holding and falls prone.

            The creature automatically fails Strength and Dexterity Saving Throws.

            Attack rolls against the creature have advantage.

            Any Attack that hits the creature is a critical hit if the attacker is within 5 feet of the creature.`;
            break;
    }
}