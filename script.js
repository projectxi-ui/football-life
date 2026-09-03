/* =========================================
   PROJECT XI — FOOTBALL LIFE
   VERSION 1
========================================= */


/* =========================================
   GAME DATA
========================================= */

let player = {
    name: "",
    country: "",
    position: "",
    age: 17,

    season: 1,

    rating: 62,
    fitness: 75,
    happiness: 80,
    money: 2000,
    reputation: 10,

    club: "PROJECT XI Academy",
    clubStatus: "Youth Player",

    goals: 0,
    assists: 0,
    trophies: 0,

    careerEarnings: 0,

    injured: false,
    injuryWeeks: 0,

    retired: false
};


/* =========================================
   DOM ELEMENTS
========================================= */

const startScreen = document.getElementById("startScreen");
const careerScreen = document.getElementById("careerScreen");
const legacyScreen = document.getElementById("legacyScreen");

const playerNameInput = document.getElementById("playerName");
const playerCountryInput = document.getElementById("playerCountry");
const playerPositionInput = document.getElementById("playerPosition");
const playerAgeInput = document.getElementById("playerAge");

const startCareerBtn = document.getElementById("startCareerBtn");
const startError = document.getElementById("startError");

const displayName = document.getElementById("displayName");
const displayDetails = document.getElementById("displayDetails");
const playerAvatar = document.getElementById("playerAvatar");

const seasonDisplay = document.getElementById("seasonDisplay");

const ageStat = document.getElementById("ageStat");
const ratingStat = document.getElementById("ratingStat");
const fitnessStat = document.getElementById("fitnessStat");
const happinessStat = document.getElementById("happinessStat");
const moneyStat = document.getElementById("moneyStat");
const reputationStat = document.getElementById("reputationStat");

const clubName = document.getElementById("clubName");
const clubStatus = document.getElementById("clubStatus");

const eventText = document.getElementById("eventText");
const careerLog = document.getElementById("careerLog");

const trainBtn = document.getElementById("trainBtn");
const matchBtn = document.getElementById("matchBtn");
const lifeBtn = document.getElementById("lifeBtn");
const ageUpBtn = document.getElementById("ageUpBtn");

const saveBtn = document.getElementById("saveBtn");
const menuBtn = document.getElementById("menuBtn");

const createClubBtn = document.getElementById("createClubBtn");

const legacyGoals = document.getElementById("legacyGoals");
const legacyAssists = document.getElementById("legacyAssists");
const legacyTrophies = document.getElementById("legacyTrophies");
const legacyMoney = document.getElementById("legacyMoney");


/* =========================================
   UTILITY FUNCTIONS
========================================= */

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}


function formatMoney(amount) {
    return "€" + Math.round(amount).toLocaleString();
}


function showScreen(screen) {

    startScreen.classList.remove("active");
    careerScreen.classList.remove("active");
    legacyScreen.classList.remove("active");

    screen.classList.add("active");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =========================================
   CAREER LOG
========================================= */

function addLog(message) {

    const entry = document.createElement("div");

    entry.className = "log-entry";

    entry.innerHTML = `
        <span class="log-year">
            AGE ${player.age}
        </span>

        <p>${message}</p>
    `;

    careerLog.prepend(entry);
}


/* =========================================
   UPDATE UI
========================================= */

function updateUI() {

    displayName.textContent = player.name;

    displayDetails.textContent =
        `${player.age} • ${player.position} • ${player.club}`;

    playerAvatar.textContent =
        player.name.substring(0, 2).toUpperCase();

    seasonDisplay.textContent = player.season;

    ageStat.textContent = player.age;
    ratingStat.textContent = player.rating;
    fitnessStat.textContent = player.fitness;
    happinessStat.textContent = player.happiness;

    moneyStat.textContent =
        formatMoney(player.money);

    reputationStat.textContent =
        player.reputation;

    clubName.textContent =
        player.club;

    clubStatus.textContent =
        player.clubStatus;
}


/* =========================================
   CREATE PLAYER
========================================= */

function createPlayer() {

    const name = playerNameInput.value.trim();
    const country = playerCountryInput.value.trim();

    if (name.length < 2) {

        startError.textContent =
            "Please enter a player name.";

        return;
    }

    if (country.length < 2) {

        startError.textContent =
            "Please enter your country.";

        return;
    }

    startError.textContent = "";


    player = {

        name: name,
        country: country,
        position: playerPositionInput.value,
        age: Number(playerAgeInput.value),

        season: 1,

        rating: randomNumber(58, 65),
        fitness: randomNumber(70, 80),
        happiness: randomNumber(75, 85),
        money: 2000,
        reputation: 10,

        club: "PROJECT XI Academy",
        clubStatus: "Youth Player",

        goals: 0,
        assists: 0,
        trophies: 0,

        careerEarnings: 0,

        injured: false,
        injuryWeeks: 0,

        retired: false
    };


    careerLog.innerHTML = "";


    addLog(
        `You joined PROJECT XI Academy as a ${getPositionName(player.position)}. Your football journey begins.`
    );


    eventText.textContent =
        "Your first season begins. Work hard, make smart decisions and build your future.";


    updateUI();

    showScreen(careerScreen);

    saveCareer();
}


/* =========================================
   POSITION NAME
========================================= */

function getPositionName(position) {

    const positions = {

        ST: "Striker",
        LW: "Left Winger",
        RW: "Right Winger",
        CAM: "Attacking Midfielder",
        CM: "Central Midfielder",
        CDM: "Defensive Midfielder",
        CB: "Centre Back",
        LB: "Left Back",
        RB: "Right Back",
        GK: "Goalkeeper"
    };

    return positions[position] || position;
}


/* =========================================
   TRAINING
========================================= */

function train() {

    if (player.injured) {

        eventText.textContent =
            `You are recovering from an injury. ${player.injuryWeeks} week(s) remaining.`;

        return;
    }


    const ratingGain = randomNumber(1, 3);
    const fitnessChange = randomNumber(-5, 2);

    player.rating =
        clamp(player.rating + ratingGain, 1, 99);

    player.fitness =
        clamp(player.fitness + fitnessChange, 0, 100);

    player.happiness =
        clamp(player.happiness + randomNumber(-2, 2), 0, 100);


    addLog(
        `You completed an intense training session. Rating +${ratingGain}.`
    );


    eventText.textContent =
        `Great training session! Your rating increased by ${ratingGain}.`;

    updateUI();

    saveCareer();
}


/* =========================================
   PLAY MATCH
========================================= */

function playMatch() {

    if (player.injured) {

        eventText.textContent =
            `You cannot play while injured. ${player.injuryWeeks} week(s) remaining.`;

        return;
    }


    if (player.fitness < 25) {

        eventText.textContent =
            "You're too tired to play safely. Rest and recover first.";

        return;
    }


    player.fitness =
        clamp(player.fitness - randomNumber(8, 15), 0, 100);


    const performance =
        player.rating +
        randomNumber(-15, 15);


    let goals = 0;
    let assists = 0;


    if (player.position === "GK") {

        if (performance > 75) {
            assists = randomNumber(0, 1);
        }

    } else {

        if (performance > 55) {
            goals = randomNumber(0, 2);
        }

        if (performance > 70) {
            assists = randomNumber(0, 2);
        }
    }


    player.goals += goals;
    player.assists += assists;


    const matchPay =
        randomNumber(200, 700);

    player.money += matchPay;
    player.careerEarnings += matchPay;


    if (goals > 0 || assists > 0) {

        player.reputation =
            clamp(
                player.reputation +
                goals +
                assists,
                0,
                100
            );

        player.happiness =
            clamp(
                player.happiness + 3,
                0,
                100
            );

    } else {

        player.happiness =
            clamp(
                player.happiness - 1,
                0,
                100
            );
    }


    let resultText =
        `You played a match and earned ${formatMoney(matchPay)}. `;


    if (goals > 0) {

        resultText +=
            `You scored ${goals} goal${goals > 1 ? "s" : ""}. `;
    }


    if (assists > 0) {

        resultText +=
            `You made ${assists} assist${assists > 1 ? "s" : ""}.`;
    }


    if (goals === 0 && assists === 0) {

        resultText +=
            "It wasn't your best performance.";
    }


    eventText.textContent = resultText;


    addLog(resultText);

    updateUI();

    saveCareer();
}


/* =========================================
   LIFE ACTION
========================================= */

function lifeAction() {

    const choices = [

        {
            text: "You spent time with your family. Happiness increased.",
            happiness: 8,
            money: 0
        },

        {
            text: "You took a relaxing day away from football. Fitness recovered.",
            happiness: 5,
            fitness: 10
        },

        {
            text: "You attended a local football event and gained some reputation.",
            reputation: 3,
            happiness: 3
        },

        {
            text: "You helped someone in your community. It felt rewarding.",
            happiness: 7,
            reputation: 2
        },

        {
            text: "You focused on your studies and future outside football.",
            happiness: 2,
            reputation: 1
        }
    ];


    const choice =
        choices[randomNumber(0, choices.length - 1)];


    if (choice.happiness) {

        player.happiness =
            clamp(
                player.happiness + choice.happiness,
                0,
                100
            );
    }


    if (choice.fitness) {

        player.fitness =
            clamp(
                player.fitness + choice.fitness,
                0,
                100
            );
    }


    if (choice.reputation) {

        player.reputation =
            clamp(
                player.reputation + choice.reputation,
                0,
                100
            );
    }


    eventText.textContent =
        choice.text;


    addLog(choice.text);

    updateUI();

    saveCareer();
}


/* =========================================
   RANDOM YEAR EVENT
========================================= */

function randomYearEvent() {

    const events = [

        {
            text: "A football scout watched one of your matches.",
            action: () => {
                player.reputation =
                    clamp(player.reputation + 5, 0, 100);
            }
        },

        {
            text: "You had a great training week.",
            action: () => {
                player.rating =
                    clamp(player.rating + 2, 1, 99);
            }
        },

        {
            text: "You received a small sponsorship bonus.",
            action: () => {

                const money =
                    randomNumber(500, 1500);

                player.money += money;
                player.careerEarnings += money;
            }
        },

        {
            text: "You had a difficult week and felt mentally tired.",
            action: () => {

                player.happiness =
                    clamp(player.happiness - 7, 0, 100);
            }
        },

        {
            text: "Your teammates praised your performances.",
            action: () => {

                player.happiness =
                    clamp(player.happiness + 5, 0, 100);

                player.reputation =
                    clamp(player.reputation + 2, 0, 100);
            }
        },

        {
            text: "You were selected for an important youth tournament.",
            action: () => {

                player.reputation =
                    clamp(player.reputation + 6, 0, 100);

                player.happiness =
                    clamp(player.happiness + 5, 0, 100);
            }
        },

        {
            text: "You picked up a minor football injury during training.",
            action: () => {

                player.injured = true;
                player.injuryWeeks = randomNumber(1, 4);

                player.fitness =
                    clamp(player.fitness - 15, 0, 100);
            }
        }
    ];


    const event =
        events[randomNumber(0, events.length - 1)];


    event.action();

    addLog(event.text);

    return event.text;
}


/* =========================================
   RECOVERY
========================================= */

function recoverFromInjury() {

    if (!player.injured) {
        return;
    }


    player.injuryWeeks--;


    if (player.injuryWeeks <= 0) {

        player.injured = false;
        player.injuryWeeks = 0;

        player.fitness =
            clamp(player.fitness + 20, 0, 100);

        addLog(
            "You have recovered and returned to football."
        );

    } else {

        addLog(
            `You continued your recovery. ${player.injuryWeeks} week(s) remaining.`
        );
    }
}


/* =========================================
   CAREER PROGRESSION
========================================= */

function checkCareerProgression() {

    if (
        player.club === "PROJECT XI Academy" &&
        player.age >= 18 &&
        player.rating >= 65
    ) {

        player.club =
            "PROJECT XI FC";

        player.clubStatus =
            "Professional Player";

        player.money += 5000;
        player.careerEarnings += 5000;

        player.reputation =
            clamp(player.reputation + 10, 0, 100);


        addLog(
            "BREAKING NEWS: You signed your first professional contract with PROJECT XI FC!"
        );

        eventText.textContent =
            "YOU'RE A PROFESSIONAL FOOTBALLER! Your career has entered a new era.";
    }


    if (
        player.age >= 21 &&
        player.rating >= 75 &&
        player.club === "PROJECT XI FC"
    ) {

        player.club =
            "PROJECT XI United";

        player.clubStatus =
            "First Team Star";

        player.money += 15000;
        player.careerEarnings += 15000;

        player.reputation =
            clamp(player.reputation + 15, 0, 100);


        addLog(
            "Your performances earned you a move to PROJECT XI United."
        );
    }


    if (
        player.age >= 28 &&
        player.rating >= 85 &&
        player.reputation >= 60
    ) {

        player.clubStatus =
            "World-Class Player";

        addLog(
            "You have reached world-class status."
        );
    }
}


/* =========================================
   AGE UP
========================================= */

function ageUp() {

    if (player.retired) {
        return;
    }


    player.age++;
    player.season++;


    /* YEARLY MONEY */

    if (player.clubStatus === "Youth Player") {

        const income =
            randomNumber(500, 1500);

        player.money += income;
        player.careerEarnings += income;

    } else if (
        player.clubStatus === "Professional Player"
    ) {

        const income =
            randomNumber(10000, 25000);

        player.money += income;
        player.careerEarnings += income;

    } else {

        const income =
            randomNumber(25000, 75000);

        player.money += income;
        player.careerEarnings += income;
    }


    /* NATURAL DEVELOPMENT */

    if (player.age < 23) {

        player.rating =
            clamp(
                player.rating + randomNumber(1, 3),
                1,
                99
            );

    } else if (player.age >= 30) {

        player.rating =
            clamp(
                player.rating - randomNumber(0, 2),
                1,
                99
            );
    }


    player.fitness =
        clamp(
            player.fitness + randomNumber(-5, 5),
            0,
            100
        );


    /* RANDOM EVENT */

    const event =
        randomYearEvent();


    /* RECOVERY */

    recoverFromInjury();


    /* CAREER PROGRESSION */

    checkCareerProgression();


    /* AGE MESSAGE */

    eventText.textContent =
        `You are now ${player.age}. ${event}`;


    /* RETIREMENT */

    if (player.age >= 40) {

        retirePlayer();

        return;
    }


    updateUI();

    saveCareer();
}


/* =========================================
   RETIREMENT
========================================= */

function retirePlayer() {

    player.retired = true;

    addLog(
        `At age ${player.age}, you officially retired from professional football.`
    );


    legacyGoals.textContent =
        player.goals;

    legacyAssists.textContent =
        player.assists;

    legacyTrophies.textContent =
        player.trophies;

    legacyMoney.textContent =
        formatMoney(player.careerEarnings);


    showScreen(legacyScreen);

    saveCareer();
}


/* =========================================
   CREATE CLUB
========================================= */

function createClub() {

    if (!player.retired) {

        alert(
            "You must retire from football before creating your own club."
        );

        return;
    }


    if (player.money < 100000) {

        alert(
            "You need at least €100,000 to create your first football club."
        );

        return;
    }


    const clubNameInput =
        prompt(
            "Enter your new club's name:"
        );


    if (!clubNameInput) {
        return;
    }


    const newClub =
        clubNameInput.trim();


    if (newClub.length < 3) {

        alert(
            "Club name must contain at least 3 characters."
        );

        return;
    }


    player.money -= 100000;

    player.club =
        newClub;

    player.clubStatus =
        "Owner";


    addLog(
        `You invested €100,000 and founded ${newClub}. Your football ownership era begins.`
    );


    alert(
        `🏟️ ${newClub} has officially been founded!`
    );


    saveCareer();
}


/* =========================================
   SAVE CAREER
========================================= */

function saveCareer() {

    try {

        localStorage.setItem(
            "projectXI_football_life",
            JSON.stringify(player)
        );

    } catch (error) {

        console.log(
            "Could not save career.",
            error
        );
    }
}


/* =========================================
   LOAD CAREER
========================================= */

function loadCareer() {

    try {

        const saved =
            localStorage.getItem(
                "projectXI_football_life"
            );


        if (!saved) {
            return false;
        }


        const loaded =
            JSON.parse(saved);


        player = {
            ...player,
            ...loaded
        };


        return true;

    } catch (error) {

        console.log(
            "Could not load career.",
            error
        );

        return false;
    }
}


/* =========================================
   RETURN TO MAIN MENU
========================================= */

function returnToMenu() {

    const confirmLeave =
        confirm(
            "Return to the main menu? Your saved career will remain available."
        );


    if (!confirmLeave) {
        return;
    }


    showScreen(startScreen);
}


/* =========================================
   BUTTON EVENTS
========================================= */

startCareerBtn.addEventListener(
    "click",
    createPlayer
);


trainBtn.addEventListener(
    "click",
    train
);


matchBtn.addEventListener(
    "click",
    playMatch
);


lifeBtn.addEventListener(
    "click",
    lifeAction
);


ageUpBtn.addEventListener(
    "click",
    ageUp
);


saveBtn.addEventListener(
    "click",
    () => {

        saveCareer();

        eventText.textContent =
            "Career saved successfully.";

    }
);


menuBtn.addEventListener(
    "click",
    returnToMenu
);


createClubBtn.addEventListener(
    "click",
    createClub
);


/* =========================================
   LOAD SAVED CAREER ON STARTUP
========================================= */

const careerLoaded =
    loadCareer();


if (careerLoaded) {

    updateUI();

    addLog(
        "Saved career loaded successfully."
    );
}


/* =========================================
   INITIAL STATE
========================================= */

showScreen(startScreen);

console.log(
    "PROJECT XI — FOOTBALL LIFE loaded successfully."
);
