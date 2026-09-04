/* =========================================================
   PROJECT XI: FOOTBALL LIFE
   FULL CAREER MODE ENGINE — V21
   ========================================================= */

"use strict";


/* =========================================================
   CONSTANTS
   ========================================================= */

const SAVE_KEY = "PROJECT_XI_FOOTBALL_LIFE_V21";

const DAYS = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
];

const DAY_SHORT = [
    "MON",
    "TUE",
    "WED",
    "THU",
    "FRI",
    "SAT",
    "SUN"
];


const CLUBS = [
    "Royal Santoro",
    "Eastport City",
    "Club de Aderis",
    "Silvergate Athletic",
    "Westhaven FC",
    "Northbridge United",
    "Redmont FC",
    "Kingsport Athletic",
    "Valencia Crest",
    "Tokyo Phoenix",
    "Osaka United",
    "Berlin Forge",
    "Paris Royale",
    "Lisbon Stars",
    "Madrid Aurora",
    "Amsterdam Eleven",
    "Manchester Vale",
    "London Kings",
    "Rio Nova",
    "Sao Verano",
    "Buenos Aires FC",
    "Seoul Titans",
    "Dubai Falcons",
    "Mumbai Athletic",
    "Delhi United",
    "Bengaluru City"
];


const ACADEMIES = [
    {
        name: "PROJECT XI ACADEMY",
        city: "Tokyo",
        rating: 62,
        potential: 86,
        bonus: "Technical development"
    },
    {
        name: "ROYAL SANTORO ACADEMY",
        city: "Madrid",
        rating: 65,
        potential: 89,
        bonus: "Elite facilities"
    },
    {
        name: "EASTPORT CITY ACADEMY",
        city: "England",
        rating: 60,
        potential: 84,
        bonus: "Physical development"
    },
    {
        name: "TOKYO PHOENIX ACADEMY",
        city: "Japan",
        rating: 63,
        potential: 91,
        bonus: "Youth opportunities"
    },
    {
        name: "DUBAI FALCONS ACADEMY",
        city: "UAE",
        rating: 61,
        potential: 87,
        bonus: "Fast-track promotion"
    }
];


/* =========================================================
   FOOTBALL PLAYER NAMES
   ========================================================= */

const FIRST_NAMES = [
    "Adhi",
    "Zaid",
    "Zidan",
    "Sinan",
    "Sreyas",
    "Kishan",
    "Zaki",
    "Afthab",
    "Leo",
    "Kai",
    "Noah",
    "Luca",
    "Mateo",
    "Rafael",
    "Kenji",
    "Yuto",
    "Arjun",
    "Zayn",
    "Ethan",
    "Daniel",
    "Adam",
    "Alex",
    "Ryan",
    "Milan",
    "Ayaan",
    "Samir",
    "Omar",
    "Rayan",
    "Lucas",
    "Marco",
    "Thiago",
    "Diego",
    "Nico",
    "Julian",
    "Hugo",
    "Elias",
    "Dani",
    "Mika",
    "Jude",
    "Theo"
];


const LAST_NAMES = [
    "Varga",
    "Sato",
    "Costa",
    "Williams",
    "Müller",
    "Ricci",
    "Park",
    "Moreau",
    "Silva",
    "Khan",
    "Fernandez",
    "Torres",
    "Rossi",
    "Walker",
    "Tanaka",
    "Patel",
    "Sharma",
    "Alvarez",
    "Santos",
    "Ibrahim",
    "Hassan",
    "Martinez",
    "Anderson",
    "Garcia"
];


/* =========================================================
   WORLD NEWS
   ========================================================= */

const WORLD_NEWS = [
    "PROJECT XI scouting network identifies another wonderkid.",
    "Royal Santoro are preparing a major transfer bid.",
    "Tokyo Phoenix announce a new tactical system.",
    "European clubs are monitoring several young talents.",
    "A surprise managerial change shakes the football world.",
    "The international window is approaching.",
    "Fans are demanding a new generation of stars.",
    "Scouts are travelling across Europe and Asia.",
    "Transfer rumours are heating up.",
    "PROJECT XI insiders expect a huge season.",
    "A teenage midfielder is attracting attention across Europe.",
    "Several clubs are preparing for a major transfer battle.",
    "A new generation of academy players is emerging."
];


/* =========================================================
   GAME STATE
   ========================================================= */

let game = createDefaultGame();


function createDefaultGame() {

    return {

        started: false,

        player: {
            name: "PLAYER",
            country: "India",
            position: "ST",
            foot: "Right",

            age: 16,

            rating: 60,
            potential: 75,

            fitness: 100,
            form: 50,

            goals: 0,
            assists: 0,

            reputation: 0,

            money: 0,

            careerEarnings: 0,

            appearances: 0,

            seasonGoals: 0,
            seasonAssists: 0,

            trophies: 0,

            playerOfYear: false,
            goldenBoot: false,
            ballonDor: false
        },

        club: {
            name: "PROJECT XI ACADEMY",
            city: "Tokyo",
            rating: 60,
            professional: false
        },

        season: 1,

        week: 1,

        dayIndex: 0,

        matchDay: 5,

        currentOpponent: "Eastport City",

        match: {

            active: false,

            completed: false,

            finishing: false,

            season: 1,

            week: 1,

            home: "",
            away: "",

            homeScore: 0,
            awayScore: 0,

            minute: 0,

            playerGoals: 0,
            playerAssists: 0,

            actions: 0,

            events: [],

            homePlayers: [],
            awayPlayers: [],

            possessionHome: 50,
            possessionAway: 50,

            shotsHome: 0,
            shotsAway: 0,

            shotsOnTargetHome: 0,
            shotsOnTargetAway: 0,

            savesHome: 0,
            savesAway: 0,

            cornersHome: 0,
            cornersAway: 0,

            yellowHome: 0,
            yellowAway: 0
        },

        logs: [],

        worldFeed: [],

        transferOffers: [],

        selectedTransfer: null,

        currentScout: [],

        legacy: {

            active: false,

            club: {
                name: "",
                city: "",
                motto: "",
                stadium: ""
            },

            funds: 100000,

            rating: 40,

            reputation: 10,

            stadiumLevel: 1,

            youthLevel: 1,

            trainingLevel: 1,

            staffLevel: 1,

            squad: [],

            financeLog: []
        }

    };

}


/* =========================================================
   DOM HELPER
   ========================================================= */

function $(id) {

    return document.getElementById(id);

}


/* =========================================================
   SCREEN MANAGEMENT
   ========================================================= */

function showScreen(id) {

    document.querySelectorAll(".screen").forEach(screen => {

        screen.classList.remove("active");

    });


    const screen = $(id);


    if (screen) {

        screen.classList.add("active");

    }


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


/* =========================================================
   TOAST
   ========================================================= */

let toastTimer = null;


function toast(message, duration = 3200) {

    const el = $("toast");

    if (!el) return;


    el.textContent = message;

    el.classList.remove("hidden");


    clearTimeout(toastTimer);


    toastTimer = setTimeout(() => {

        el.classList.add("hidden");

    }, duration);

}


/* =========================================================
   MONEY
   ========================================================= */

function money(value) {

    return new Intl.NumberFormat("en-IE", {

        style: "currency",

        currency: "EUR",

        maximumFractionDigits: 0

    }).format(
        Math.max(0, Math.round(value || 0))
    );

}


/* =========================================================
   RANDOM
   ========================================================= */

function random(min, max) {

    return Math.floor(
        Math.random() * (max - min + 1)
    ) + min;

}


function pick(array) {

    return array[
        Math.floor(Math.random() * array.length)
    ];

}


function clamp(value, min, max) {

    return Math.max(
        min,
        Math.min(max, value)
    );

}


/* =========================================================
   SAFE HTML
   ========================================================= */

function escapeHTML(value) {

    return String(value)

        .replaceAll("&", "&amp;")

        .replaceAll("<", "&lt;")

        .replaceAll(">", "&gt;")

        .replaceAll('"', "&quot;")

        .replaceAll("'", "&#039;");

}


/* =========================================================
   SAVE
   ========================================================= */

function saveGame(showMessage = true) {

    localStorage.setItem(

        SAVE_KEY,

        JSON.stringify(game)

    );


    if (showMessage) {

        toast(
            "GAME SAVED — Your career has been secured."
        );

    }

}


/* =========================================================
   LOAD
   ========================================================= */

function loadGame() {

    const saved =
        localStorage.getItem(SAVE_KEY);


    if (!saved) {

        toast("NO CAREER SAVE FOUND.");

        return false;

    }


    try {

        const parsed =
            JSON.parse(saved);


        game =
            mergeDeep(
                createDefaultGame(),
                parsed
            );


        /*
            Repair old/incomplete match data.
        */

        repairMatchState();


        updateAll();


        if (game.legacy.active) {

            showScreen("ownerScreen");

        } else {

            showScreen("careerScreen");

        }


        toast(
            "CAREER LOADED — Welcome back."
        );


        return true;


    } catch (error) {

        console.error(error);

        toast(
            "SAVE FILE COULD NOT BE LOADED."
        );

        return false;

    }

}


/* =========================================================
   DEEP MERGE
   ========================================================= */

function mergeDeep(base, source) {

    for (const key of Object.keys(source || {})) {

        if (

            source[key] &&

            typeof source[key] === "object" &&

            !Array.isArray(source[key])

        ) {

            base[key] =
                mergeDeep(
                    base[key] || {},
                    source[key]
                );

        } else {

            base[key] =
                source[key];

        }

    }


    return base;

}


/* =========================================================
   REPAIR MATCH STATE
   ========================================================= */

function repairMatchState() {

    if (!game.match) {

        game.match =
            createDefaultGame().match;

        return;

    }


    if (
        typeof game.match.completed !== "boolean"
    ) {

        game.match.completed = false;

    }


    if (
        typeof game.match.finishing !== "boolean"
    ) {

        game.match.finishing = false;

    }


    if (!Array.isArray(game.match.events)) {

        game.match.events = [];

    }


    if (!Array.isArray(game.match.homePlayers)) {

        game.match.homePlayers = [];

    }


    if (!Array.isArray(game.match.awayPlayers)) {

        game.match.awayPlayers = [];

    }

}


/* =========================================================
   LOG
   ========================================================= */

function addLog(title, text) {

    game.logs.unshift({

        season: game.season,

        week: game.week,

        day: DAYS[game.dayIndex],

        title,

        text,

        time: Date.now()

    });


    game.logs =
        game.logs.slice(0, 100);


    renderCareerLog();

}


/* =========================================================
   WORLD FEED
   ========================================================= */

function generateWorldFeed() {

    const items = [];


    for (let i = 0; i < 7; i++) {

        items.push(
            pick(WORLD_NEWS)
        );

    }


    game.worldFeed = items;


    renderWorldFeed();

}


function renderWorldFeed() {

    const html =
        (game.worldFeed || [])

            .slice(0, 7)

            .map(news => `

                <div>

                    <strong>
                        WORLD FOOTBALL
                    </strong>

                    <br>

                    ${escapeHTML(news)}

                </div>

            `)

            .join("");


    if ($("worldFeed")) {

        $("worldFeed").innerHTML =
            html;

    }


    if ($("menuWorldFeed")) {

        $("menuWorldFeed").innerHTML =
            html;

    }


    if ($("ownerWorldFeed")) {

        $("ownerWorldFeed").innerHTML =
            html;

    }

}


/* =========================================================
   CAREER LOG
   ========================================================= */

function renderCareerLog() {

    const container =
        $("careerLog");


    if (!container) return;


    if (!game.logs.length) {

        container.innerHTML = `

            <div class="log-entry">

                <div class="log-heading">
                    CAREER
                </div>

                Your football story begins here.

            </div>

        `;

        return;

    }


    container.innerHTML =

        game.logs

            .map(log => `

                <div class="log-entry">

                    <div class="log-heading">

                        S${log.season}
                        · W${String(log.week).padStart(2, "0")}
                        · ${escapeHTML(log.day)}

                    </div>

                    <strong>

                        ${escapeHTML(log.title)}

                    </strong>

                    <br>

                    ${escapeHTML(log.text)}

                </div>

            `)

            .join("");

}


/* =========================================================
   PLAYER CREATION PREVIEW
   ========================================================= */

function updateCreationPreview() {

    const name =
        $("playerName")?.value.trim()
        || "YOUR PLAYER";


    const position =
        $("playerPosition")?.value
        || "ST";


    if ($("previewName")) {

        $("previewName").textContent =
            name.toUpperCase();

    }


    if ($("previewPosition")) {

        $("previewPosition").textContent =
            position;

    }

}


/* =========================================================
   CREATE PLAYER
   ========================================================= */

function createPlayer() {

    const name =
        $("playerName")?.value.trim();


    if (!name) {

        toast(
            "ENTER YOUR PLAYER NAME FIRST."
        );

        return;

    }


    game =
        createDefaultGame();


    game.started = true;


    game.player.name =
        name;


    game.player.country =
        $("playerCountry").value;


    game.player.position =
        $("playerPosition").value;


    game.player.foot =
        $("playerFoot").value;


    addLog(

        "CAREER START",

        `${name} has entered the PROJECT XI football pathway.`

    );


    generateWorldFeed();


    showScreen(
        "clubSelectScreen"
    );


    renderAcademies();


    saveGame(false);


    toast(
        "PLAYER CREATED — Choose your academy."
    );

}


/* =========================================================
   ACADEMY LIST
   ========================================================= */

function renderAcademies() {

    const container =
        $("academyList");


    if (!container) return;


    container.innerHTML =

        ACADEMIES

            .map((academy, index) => `

                <div class="academy-card">

                    <div>

                        <span class="eyebrow">

                            ACADEMY
                            ${String(index + 1).padStart(2, "0")}

                        </span>

                        <h3>

                            ${escapeHTML(academy.name)}

                        </h3>

                        <p>

                            ${escapeHTML(academy.city)}

                            ·

                            ${escapeHTML(academy.bonus)}

                        </p>

                    </div>

                    <div>

                        <strong>
                            OVR ${academy.rating}
                        </strong>

                        <br>

                        <span>
                            POT ${academy.potential}
                        </span>

                        <br><br>

                        <button
                            class="primary"
                            type="button"
                            data-academy="${index}">
                            JOIN
                        </button>

                    </div>

                </div>

            `)

            .join("");


    container
        .querySelectorAll("[data-academy]")
        .forEach(button => {

            button.addEventListener(

                "click",

                () => {

                    const index =
                        Number(
                            button.dataset.academy
                        );


                    chooseAcademy(
                        ACADEMIES[index]
                    );

                }

            );

        });

}


/* =========================================================
   CHOOSE ACADEMY
   ========================================================= */

function chooseAcademy(academy) {

    game.club.name =
        academy.name;


    game.club.city =
        academy.city;


    game.club.rating =
        academy.rating;


    game.player.rating =
        academy.rating;


    game.player.potential =
        academy.potential;


    game.season = 1;

    game.week = 1;

    game.dayIndex = 0;


    generateWeeklyMatch();


    addLog(

        "ACADEMY SIGNING",

        `${game.player.name} joins ${academy.name}. Potential: ${academy.potential}.`

    );


    toast(
        `${academy.name} — YOUR JOURNEY STARTS NOW.`
    );


    showScreen(
        "careerScreen"
    );


    updateAll();


    saveGame(false);

}


/* =========================================================
   CALENDAR ENGINE
   ========================================================= */

function generateWeeklyMatch() {

    game.matchDay =
        random(0, 6);


    game.currentOpponent =
        getRandomOpponent();


    game.match = {

        active: false,

        completed: false,

        finishing: false,

        season: game.season,

        week: game.week,

        home: "",

        away: "",

        homeScore: 0,

        awayScore: 0,

        minute: 0,

        playerGoals: 0,

        playerAssists: 0,

        actions: 0,

        events: [],

        homePlayers: [],

        awayPlayers: [],

        possessionHome: 50,

        possessionAway: 50,

        shotsHome: 0,

        shotsAway: 0,

        shotsOnTargetHome: 0,

        shotsOnTargetAway: 0,

        savesHome: 0,

        savesAway: 0,

        cornersHome: 0,

        cornersAway: 0,

        yellowHome: 0,

        yellowAway: 0

    };


    console.log(

        `Season ${game.season} Week ${game.week}: Matchday = ${DAYS[game.matchDay]} vs ${game.currentOpponent}`

    );

}


function getRandomOpponent() {

    const possible =
        CLUBS.filter(
            club =>
                club !== game.club.name
        );


    return pick(possible);

}


/* =========================================================
   CALENDAR EVENTS
   ========================================================= */

function getDayEvent(dayIndex) {

    if (
        dayIndex === game.matchDay
    ) {

        if (
            game.match.completed
        ) {

            return `MATCH COMPLETED — ${game.club.name} vs ${game.currentOpponent}`;

        }


        return `MATCHDAY — vs ${game.currentOpponent}`;

    }


    switch (dayIndex) {

        case 0:

            return "TRAINING — Technical Session";

        case 1:

            return "TRAINING — Tactical Session";

        case 2:

            return "RECOVERY — Fitness & Recovery";

        case 3:

            return "TRAINING — Position Training";

        case 4:

            return "REST — Prepare for the weekend";

        case 5:

            return "RECOVERY — Match Preparation";

        case 6:

            return "REST — Weekly Recovery";

        default:

            return "REST";

    }

}


/* =========================================================
   RENDER CALENDAR
   ========================================================= */

function renderCalendar() {

    const container =
        $("calendarList");


    if (!container) return;


    container.innerHTML =

        DAYS

            .map((day, index) => {

                const isCurrent =
                    index === game.dayIndex;


                const isMatch =
                    index === game.matchDay;


                let badge =
                    "SCHEDULED";


                if (isMatch && game.match.completed) {

                    badge = "PLAYED";

                } else if (isMatch) {

                    badge = "MATCH";

                } else if (isCurrent) {

                    badge = "TODAY";

                }


                return `

                    <div class="
                        calendar-day
                        ${isCurrent ? "current" : ""}
                        ${isMatch ? "matchday" : ""}
                    ">

                        <div class="calendar-day-name">

                            ${DAY_SHORT[index]}

                            <br>

                            ${day}

                        </div>

                        <div class="calendar-day-event">

                            ${escapeHTML(
                                getDayEvent(index)
                            )}

                        </div>

                        <div class="calendar-day-badge">

                            ${badge}

                        </div>

                    </div>

                `;

            })

            .join("");


    const currentDay =
        DAYS[game.dayIndex];


    const event =
        getDayEvent(game.dayIndex);


    if ($("calendarStatus")) {

        $("calendarStatus").textContent =

            `DAY ${game.dayIndex + 1} • ${currentDay.toUpperCase()} — ${event}`;

    }


    if ($("calendarDate")) {

        $("calendarDate").textContent =

            `SEASON ${game.season} · WEEK ${String(game.week).padStart(2, "0")}`;

    }

}


/* =========================================================
   ADVANCE DAY — FIXED
   ========================================================= */

function advanceDay() {

    /*
        If there is an active match,
        do not allow calendar movement.
    */

    if (game.match.active) {

        toast(
            "MATCH IN PROGRESS — Finish the match first."
        );

        return;

    }


    /*
        If today is matchday and the match
        has not been played, open it.
    */

    if (
        game.dayIndex === game.matchDay &&
        !game.match.completed
    ) {

        startMatch();

        return;

    }


    /*
        Otherwise ALWAYS move exactly
        ONE DAY forward.
    */

    game.dayIndex++;


    /*
        SUNDAY -> MONDAY OF NEW WEEK
    */

    if (game.dayIndex > 6) {

        startNewWeek();

        return;

    }


    /*
        Apply the new day's activity.
    */

    handleDailyActivity(
        game.dayIndex
    );


    updateAll();


    saveGame(false);


    toast(

        `DAY ADVANCED — ${DAYS[game.dayIndex]} — ${getDayEvent(game.dayIndex)}`

    );

}


/* =========================================================
   NEW WEEK
   ========================================================= */

function startNewWeek() {

    game.week++;


    game.dayIndex = 0;


    /*
        Every 52 weeks = new season.
    */

    if (game.week > 52) {

        game.week = 1;

        game.season++;

        game.player.age++;

        finishSeason();

    }


    /*
        Generate ONE brand-new match
        for the new week.
    */

    generateWeeklyMatch();


    /*
        Weekly recovery.
    */

    game.player.fitness =

        clamp(

            game.player.fitness + 10,

            0,

            100

        );


    addLog(

        "NEW WEEK",

        `Season ${game.season}, Week ${game.week} begins. Matchday: ${DAYS[game.matchDay]}.`

    );


    updateAll();


    saveGame(false);


    toast(

        `NEW WEEK — S${game.season} · WEEK ${game.week} — MATCHDAY: ${DAYS[game.matchDay].toUpperCase()}`,

        4500

    );


    /*
        If Monday happens to be matchday,
        open the match automatically.
    */

    if (
        game.matchDay === 0
    ) {

        setTimeout(() => {

            startMatch();

        }, 500);

    }

}


/* =========================================================
   DAILY ACTIVITIES
   ========================================================= */

function handleDailyActivity(dayIndex) {

    /*
        Never train on matchday.
    */

    if (
        dayIndex === game.matchDay
    ) {

        return;

    }


    switch (dayIndex) {

        case 0:

            trainingAction(
                "Technical Training",
                5,
                2
            );

            break;


        case 1:

            trainingAction(
                "Tactical Training",
                4,
                3
            );

            break;


        case 2:

            recoveryAction(
                "Recovery Day",
                12
            );

            break;


        case 3:

            trainingAction(
                "Position Training",
                6,
                3
            );

            break;


        case 4:

            recoveryAction(
                "Rest Day",
                15
            );

            break;


        case 5:

            recoveryAction(
                "Match Preparation",
                8
            );

            break;


        case 6:

            recoveryAction(
                "Weekly Recovery",
                18
            );

            break;

    }

}


/* =========================================================
   TRAINING
   ========================================================= */

function trainingAction(
    title,
    fitnessCost,
    formGain
) {

    const player =
        game.player;


    if (
        player.fitness < 10
    ) {

        toast(
            "TOO TIRED — You need recovery."
        );


        recoveryAction(
            "Forced Recovery",
            12
        );


        return;

    }


    player.fitness =

        clamp(

            player.fitness - fitnessCost,

            0,

            100

        );


    player.form =

        clamp(

            player.form + formGain,

            0,

            100

        );


    if (

        Math.random() < .22 &&

        player.rating <
        player.potential

    ) {

        player.rating =

            clamp(

                player.rating + 1,

                1,

                player.potential

            );


        addLog(

            title.toUpperCase(),

            `${title} completed successfully. OVR increased to ${player.rating}.`

        );

    } else {

        addLog(

            title.toUpperCase(),

            `${title} completed. Fitness -${fitnessCost}, Form +${formGain}.`

        );

    }

}


/* =========================================================
   RECOVERY
   ========================================================= */

function recoveryAction(
    title,
    fitnessGain
) {

    game.player.fitness =

        clamp(

            game.player.fitness + fitnessGain,

            0,

            100

        );


    game.player.form =

        clamp(

            game.player.form + 1,

            0,

            100

        );


    addLog(

        title.toUpperCase(),

        `${title}. Fitness +${fitnessGain}.`

    );

}


/* =========================================================
   MANUAL TRAIN
   ========================================================= */

function manualTrain() {

    trainingAction(

        "Individual Training",

        8,

        4

    );


    updateAll();

    saveGame(false);


    toast(
        "TRAINING COMPLETE — Fitness -8 · Form +4"
    );

}


/* =========================================================
   MANUAL REST
   ========================================================= */

function manualRest() {

    recoveryAction(

        "Rest Session",

        15

    );


    updateAll();

    saveGame(false);


    toast(
        "REST COMPLETE — Fitness +15"
    );

}


/* =========================================================
   MATCH PLAYER GENERATION
   ========================================================= */

function createMatchSquad(
    clubName,
    isHome
) {

    const positions = [

        "GK",
        "LB",
        "CB",
        "CB",
        "RB",
        "CDM",
        "CM",
        "CAM",
        "LW",
        "RW",
        "ST"

    ];


    const specialNames = [

        "Zaid",
        "Zidan",
        "Sinan",
        "Sreyas",
        "Kishan",
        "Zaki",
        "Afthab"

    ];


    const squad = [];


    for (
        let i = 0;
        i < positions.length;
        i++
    ) {

        let playerName;


        /*
            Give the player's team
            recognizable names.
        */

        if (
            isHome &&
            i < specialNames.length
        ) {

            playerName =
                specialNames[i];

        } else {

            playerName =

                `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`;

        }


        if (
            isHome &&
            i === 10
        ) {

            playerName =
                game.player.name;

        }


        squad.push({

            name: playerName,

            position: positions[i],

            rating: random(58, 78)

        });

    }


    return squad;

}


/* =========================================================
   MATCHDAY
   ========================================================= */

function startMatch() {

    /*
        PREVENT DUPLICATE MATCH.
    */

    if (
        game.match.completed
    ) {

        toast(
            "THIS WEEK'S MATCH HAS ALREADY BEEN PLAYED."
        );

        return;

    }


    if (
        game.match.active
    ) {

        return;

    }


    /*
        Never play against yourself.
    */

    if (

        !game.currentOpponent ||

        game.currentOpponent ===
        game.club.name

    ) {

        game.currentOpponent =
            getRandomOpponent();

    }


    /*
        Build fresh match.
    */

    game.match = {

        active: true,

        completed: false,

        finishing: false,

        season: game.season,

        week: game.week,

        home: game.club.name,

        away: game.currentOpponent,

        homeScore: 0,

        awayScore: 0,

        minute: 0,

        playerGoals: 0,

        playerAssists: 0,

        actions: 0,

        events: [],

        homePlayers:
            createMatchSquad(
                game.club.name,
                true
            ),

        awayPlayers:
            createMatchSquad(
                game.currentOpponent,
                false
            ),

        possessionHome: 50,

        possessionAway: 50,

        shotsHome: 0,

        shotsAway: 0,

        shotsOnTargetHome: 0,

        shotsOnTargetAway: 0,

        savesHome: 0,

        savesAway: 0,

        cornersHome: 0,

        cornersAway: 0,

        yellowHome: 0,

        yellowAway: 0

    };


    $("homeTeam").textContent =
        game.match.home;


    $("awayTeam").textContent =
        game.match.away;


    $("homeScore").textContent =
        "0";


    $("awayScore").textContent =
        "0";


    $("matchMinute").textContent =
        "00'";


    $("matchCommentary").textContent =

        `KICK-OFF — ${game.match.home} vs ${game.match.away}.`;


    $("matchCompetition").textContent =

        `SEASON ${game.season} · WEEK ${game.week} · LEAGUE MATCH`;


    showScreen(
        "matchScreen"
    );


    toast(

        `MATCHDAY — ${game.club.name} vs ${game.currentOpponent}`,

        4500

    );

}


/* =========================================================
   MATCH PLAYER HELPERS
   ========================================================= */

function getRandomOutfieldPlayer(
    squad,
    excludePlayer = null
) {

    const players =
        squad.filter(
            p => p.name !== excludePlayer
        );


    return pick(players);

}


function getOpponentScorer() {

    return getRandomOutfieldPlayer(
        game.match.awayPlayers
    );

}


function getTeammateScorer() {

    return getRandomOutfieldPlayer(
        game.match.homePlayers,
        game.player.name
    );

}


function getTeammateAssist() {

    return getRandomOutfieldPlayer(
        game.match.homePlayers,
        game.player.name
    );

}


function getOpponentAssist() {

    return getRandomOutfieldPlayer(
        game.match.awayPlayers
    );

}


/* =========================================================
   MATCH EVENT
   ========================================================= */

function addMatchEvent(text) {

    game.match.events.push({

        minute:
            game.match.minute,

        text

    });


    game.match.events =
        game.match.events.slice(-40);


    if ($("matchCommentary")) {

        $("matchCommentary").textContent =
            text;

    }

}


/* =========================================================
   MATCH ACTION
   ========================================================= */

function matchAction(type) {

    if (
        !game.match.active ||
        game.match.finishing
    ) {

        return;

    }


    game.match.actions++;


    /*
        Advance match clock.
    */

    const minuteIncrease =
        random(5, 14);


    game.match.minute =

        clamp(

            game.match.minute +
            minuteIncrease,

            0,

            90

        );


    $("matchMinute").textContent =

        `${String(game.match.minute).padStart(2, "0")}'`;


    const player =
        game.player;


    /*
        Player quality.
    */

    const quality =

        player.rating +

        player.form * .25 +

        player.fitness * .15;


    let chance =
        quality / 150;


    if (
        type === "attack"
    ) {

        chance += .18;

    }


    if (
        type === "pass"
    ) {

        chance += .08;

    }


    if (
        type === "defend"
    ) {

        chance -= .08;

    }


    chance =
        clamp(
            chance,
            .05,
            .85
        );


    const roll =
        Math.random();


    /*
        Possession.
    */

    if (
        type === "attack" ||
        type === "pass"
    ) {

        game.match.possessionHome =
            clamp(
                game.match.possessionHome +
                random(1, 5),
                35,
                70
            );

    } else {

        game.match.possessionAway =
            clamp(
                game.match.possessionAway +
                random(1, 4),
                30,
                65
            );

    }


    game.match.possessionAway =
        100 -
        game.match.possessionHome;


    /*
        PLAYER SHOT.
    */

    if (

        (
            type === "attack" ||
            type === "pass"
        ) &&

        roll <
        chance * .30

    ) {

        game.match.shotsHome++;


        const targetRoll =
            Math.random();


        if (
            targetRoll < .62
        ) {

            game.match.shotsOnTargetHome++;


            /*
                PLAYER GOAL.
            */

            if (
                Math.random() <
                .48
            ) {

                game.match.homeScore++;

                game.match.playerGoals++;


                addMatchEvent(

                    `${game.match.minute}' ⚽ GOAL — ${game.player.name}! Clinical finish!`

                );


                toast(
                    "GOAL! ⚽"
                );

            } else {

                game.match.savesAway++;


                addMatchEvent(

                    `${game.match.minute}' ${game.player.name} shoots — SAVED by the goalkeeper!`

                );

            }

        } else {

            addMatchEvent(

                `${game.match.minute}' ${game.player.name} shoots from distance — WIDE!`

            );

        }

    }


    /*
        PLAYER ASSIST.
    */

    else if (

        type === "pass" &&

        roll <
        chance * .68

    ) {

        const scorer =
            getTeammateScorer();


        game.match.homeScore++;

        game.match.playerAssists++;


        game.match.shotsOnTargetHome++;


        addMatchEvent(

            `${game.match.minute}' ⚽ GOAL — ${scorer.name}! Assist: ${game.player.name}`

        );


        toast(
            "ASSIST! 🅰️"
        );

    }


    /*
        TEAMMATE GOAL.
    */

    else if (
        roll < .22
    ) {

        const scorer =
            getTeammateScorer();


        const assister =
            getTeammateAssist();


        game.match.homeScore++;


        game.match.shotsHome++;

        game.match.shotsOnTargetHome++;


        addMatchEvent(

            `${game.match.minute}' ⚽ GOAL — ${scorer.name}! Assist: ${assister.name}`

        );

    }


    /*
        OPPONENT GOAL.
    */

    else if (
        roll < .34
    ) {

        const scorer =
            getOpponentScorer();


        const assister =
            getOpponentAssist();


        game.match.awayScore++;


        game.match.shotsAway++;

        game.match.shotsOnTargetAway++;


        addMatchEvent(

            `${game.match.minute}' ⚽ GOAL — ${scorer.name}! ${assister.name} provides the assist.`

        );


        toast(
            "OPPONENT GOAL"
        );

    }


    /*
        CORNER.
    */

    else if (
        roll < .43
    ) {

        if (
            Math.random() < .6
        ) {

            game.match.cornersHome++;


            addMatchEvent(

                `${game.match.minute}' Corner to ${game.club.name}.`

            );

        } else {

            game.match.cornersAway++;


            addMatchEvent(

                `${game.match.minute}' ${game.currentOpponent} win a corner.`

            );

        }

    }


    /*
        YELLOW CARD.
    */

    else if (
        roll < .48
    ) {

        if (
            Math.random() < .5
        ) {

            game.match.yellowHome++;


            const tackler =
                getRandomOutfieldPlayer(
                    game.match.homePlayers
                );


            addMatchEvent(

                `${game.match.minute}' 🟨 ${tackler.name} receives a yellow card.`

            );

        } else {

            game.match.yellowAway++;


            const tackler =
                getRandomOutfieldPlayer(
                    game.match.awayPlayers
                );


            addMatchEvent(

                `${game.match.minute}' 🟨 ${tackler.name} is booked for a late challenge.`

            );

        }

    }


    /*
        NORMAL FOOTBALL EVENTS.
    */

    else {

        const lines = {

            attack: [

                `${game.match.minute}' Zaid wins the ball in midfield.`,

                `${game.match.minute}' Zidan drives forward with the ball.`,

                `${game.match.minute}' Sinan makes a dangerous run behind the defence.`,

                `${game.match.minute}' Kishan tests the goalkeeper.`,

                `${game.match.minute}' Zaki beats his marker on the wing.`,

                `${game.match.minute}' Afthab presses high and forces a mistake.`,

                `${game.match.minute}' The attack builds down the right.`,

                `${game.match.minute}' A powerful run creates space.`

            ],

            pass: [

                `${game.match.minute}' Sreyas controls the midfield.`,

                `${game.match.minute}' Zaid plays a sharp through ball.`,

                `${game.match.minute}' Zidan switches play to the opposite wing.`,

                `${game.match.minute}' Sinan combines with ${game.player.name}.`,

                `${game.match.minute}' Beautiful passing sequence from ${game.club.name}.`,

                `${game.match.minute}' The midfield keeps possession.`

            ],

            defend: [

                `${game.match.minute}' Zaki makes an important tackle.`,

                `${game.match.minute}' Afthab tracks back and wins the ball.`,

                `${game.match.minute}' The defence stays compact.`,

                `${game.match.minute}' A dangerous attack is stopped.`,

                `${game.match.minute}' The goalkeeper claims the cross.`,

                `${game.match.minute}' ${game.club.name} survive a dangerous counterattack.`

            ]

        };


        addMatchEvent(
            pick(lines[type])
        );

    }


    /*
        Random post event.
    */

    if (
        Math.random() < .06
    ) {

        addMatchEvent(

            `${game.match.minute}' SHOT OFF THE POST! What an opportunity!`

        );

    }


    /*
        Update scoreboard.
    */

    $("homeScore").textContent =
        game.match.homeScore;


    $("awayScore").textContent =
        game.match.awayScore;


    /*
        Finish after 90 minutes.
    */

    if (
        game.match.minute >= 90 ||
        game.match.actions >= 10
    ) {

        game.match.finishing = true;


        setTimeout(
            finishMatch,
            700
        );

    }

}


/* =========================================================
   FINISH MATCH
   ========================================================= */

function finishMatch() {

    if (
        !game.match.active
    ) {

        return;

    }


    /*
        IMPORTANT:
        Lock the match immediately.
    */

    game.match.active = false;

    game.match.finishing = false;

    game.match.completed = true;


    const player =
        game.player;


    const goals =
        game.match.playerGoals;


    const assists =
        game.match.playerAssists;


    const home =
        game.match.homeScore;


    const away =
        game.match.awayScore;


    player.goals +=
        goals;


    player.assists +=
        assists;


    player.seasonGoals +=
        goals;


    player.seasonAssists +=
        assists;


    player.appearances++;


    /*
        Fitness.
    */

    player.fitness =

        clamp(

            player.fitness -
            random(8, 18),

            0,

            100

        );


    /*
        Match rating.
    */

    let rating =

        6.4 +

        goals * 1.15 +

        assists * .8 +

        (
            home > away
                ? .8
                : home === away
                    ? .2
                    : -.3
        );


    rating =
        clamp(
            rating,
            4.5,
            10
        );


    /*
        Form.
    */

    if (
        home > away
    ) {

        player.form =

            clamp(
                player.form + 6,
                0,
                100
            );


        player.reputation =

            clamp(
                player.reputation + 2,
                0,
                100
            );

    } else if (
        home < away
    ) {

        player.form =

            clamp(
                player.form - 3,
                0,
                100
            );

    } else {

        player.form =

            clamp(
                player.form + 1,
                0,
                100
            );

    }


    /*
        Earnings.
    */

    const earnings =

        Math.round(

            500 +

            player.rating * 25 +

            goals * 250 +

            assists * 150

        );


    player.money +=
        earnings;


    player.careerEarnings +=
        earnings;


    let result;


    if (
        home > away
    ) {

        result = "WIN";

    } else if (
        home < away
    ) {

        result = "LOSS";

    } else {

        result = "DRAW";

    }


    addLog(

        `MATCH ${result}`,

        `${game.club.name} ${home}–${away} ${game.currentOpponent}. ${goals} goal(s), ${assists} assist(s). Rating ${rating.toFixed(1)}. Earned ${money(earnings)}.`

    );


    /*
        OVR progression.
    */

    if (

        rating >= 8.5 &&

        player.rating <
        player.potential &&

        Math.random() < .4

    ) {

        player.rating =

            clamp(

                player.rating + 1,

                1,

                player.potential

            );


        toast(

            `PLAYER DEVELOPMENT — OVR increased to ${player.rating}!`

        );

    }


    $("matchCommentary").textContent =

        `FULL TIME — ${game.club.name} ${home}–${away} ${game.currentOpponent}.`;


    updateAll();


    /*
        SAVE IMMEDIATELY.

        This is what guarantees the match
        cannot be replayed accidentally.
    */

    saveGame(false);


    /*
        Return to career and MOVE THE CALENDAR.
    */

    setTimeout(() => {

        showScreen(
            "careerScreen"
        );


        moveToNextDayAfterMatch();


    }, 1000);

}


/* =========================================================
   MOVE TO NEXT DAY AFTER MATCH — IMPORTANT FIX
   ========================================================= */

function moveToNextDayAfterMatch() {

    /*
        The matchday has now been completed.
    */

    game.match.completed = true;


    /*
        MOVE EXACTLY ONE DAY FORWARD.
    */

    game.dayIndex++;


    /*
        If the match was Sunday,
        go directly to next week's Monday.
    */

    if (
        game.dayIndex > 6
    ) {

        startNewWeek();

        return;

    }


    /*
        Run the next day's activity.
    */

    handleDailyActivity(
        game.dayIndex
    );


    updateAll();


    saveGame(false);


    toast(

        `MATCH COMPLETED — NOW ${DAYS[game.dayIndex].toUpperCase()}`,

        4000

    );

}


/* =========================================================
   MANUAL MATCH BUTTON
   ========================================================= */

function manualMatch() {

    if (
        game.dayIndex !== game.matchDay
    ) {

        toast(

            `MATCHDAY IS ${DAYS[game.matchDay].toUpperCase()} — Follow the calendar.`

        );


        return;

    }


    if (
        game.match.completed
    ) {

        toast(

            "MATCH ALREADY COMPLETED — There is only ONE match per week."

        );


        return;

    }


    if (
        game.match.active
    ) {

        return;

    }


    startMatch();

}


/* =========================================================
   CONTRACT
   ========================================================= */

function showContract() {

    const value =
        calculateTransferValue();


    const salary =
        Math.round(
            value * .002
        );


    $("contractClubName").textContent =
        game.club.name;


    $("contractSalary").textContent =
        money(salary);


    $("contractValue").textContent =
        money(value);


    $("contractYears").textContent =
        "3 YEARS";


    showScreen(
        "contractScreen"
    );

}


function calculateTransferValue() {

    return Math.max(

        250000,

        Math.round(

            game.player.rating *
            game.player.rating *
            game.player.rating *
            35

        )

    );

}


/* =========================================================
   SIGN CONTRACT
   ========================================================= */

function signContract() {

    game.club.professional =
        true;


    game.player.reputation =

        clamp(

            game.player.reputation + 10,

            0,

            100

        );


    addLog(

        "PROFESSIONAL CONTRACT",

        `${game.player.name} signs a professional contract with ${game.club.name}.`

    );


    toast(

        "CONTRACT SIGNED — YOUR PROFESSIONAL CAREER BEGINS."

    );


    showScreen(
        "careerScreen"
    );


    updateAll();

    saveGame(false);

}


/* =========================================================
   TRANSFERS
   ========================================================= */

function openTransfers() {

    generateTransferOffers();


    showScreen(
        "transferScreen"
    );


    renderTransferOffers();

}


function generateTransferOffers() {

    const clubs =

        CLUBS.filter(

            club =>
                club !== game.club.name

        );


    const shuffled =

        [...clubs].sort(

            () =>
                Math.random() - .5

        );


    game.transferOffers =

        shuffled

            .slice(0, 4)

            .map(club => {

                const base =
                    calculateTransferValue();


                const multiplier =
                    random(70, 135) / 100;


                return {

                    club,

                    offer:
                        Math.round(
                            base * multiplier
                        ),

                    salary:
                        Math.round(
                            base * .0015
                        )

                };

            });

}


function renderTransferOffers() {

    const container =
        $("transferOffers");


    if (!container) return;


    container.innerHTML =

        game.transferOffers

            .map((offer, index) => `

                <div class="transfer-card">

                    <span class="eyebrow">
                        CLUB INTEREST
                    </span>

                    <h3>
                        ${escapeHTML(offer.club)}
                    </h3>

                    <div class="transfer-value">
                        ${money(offer.offer)}
                    </div>

                    <p>
                        Proposed salary:
                        ${money(offer.salary)}
                    </p>

                    <button
                        class="primary"
                        data-transfer="${index}"
                        type="button">
                        NEGOTIATE
                    </button>

                </div>

            `)

            .join("");


    container
        .querySelectorAll("[data-transfer]")
        .forEach(button => {

            button.addEventListener(

                "click",

                () => {

                    selectTransfer(

                        Number(
                            button.dataset.transfer
                        )

                    );

                }

            );

        });

}


/* =========================================================
   SELECT TRANSFER
   ========================================================= */

function selectTransfer(index) {

    const offer =
        game.transferOffers[index];


    if (!offer) return;


    game.selectedTransfer =
        offer;


    $("negotiationClub").textContent =
        offer.club;


    $("negotiationOffer").textContent =
        money(offer.offer);


    $("negotiationCurrentValue").textContent =
        money(calculateTransferValue());


    $("transferCounter").value =

        Math.round(
            offer.offer * 1.15
        );


    $("negotiationMessage").innerHTML = `

        <div class="log-entry">

            <div class="log-heading">
                NEGOTIATION
            </div>

            ${escapeHTML(offer.club)}
            have made an official approach.
            Decide whether to accept or negotiate.

        </div>

    `;


    showScreen(
        "negotiationScreen"
    );

}


/* =========================================================
   COUNTER OFFER
   ========================================================= */

function sendCounterOffer() {

    const offer =
        game.selectedTransfer;


    if (!offer) return;


    const counter =
        Number(
            $("transferCounter").value
        );


    if (
        !counter ||
        counter <= 0
    ) {

        toast(
            "ENTER A VALID COUNTER OFFER."
        );


        return;

    }


    if (
        counter <=
        offer.offer * 1.25
    ) {

        offer.offer =
            Math.round(counter);


        $("negotiationOffer").textContent =
            money(offer.offer);


        $("negotiationMessage").innerHTML = `

            <div class="log-entry">

                <div class="log-heading">
                    CLUB RESPONSE
                </div>

                ${escapeHTML(offer.club)}
                are considering your counter offer.

            </div>

        `;


        toast(

            "COUNTER SENT — The club is considering the deal."

        );

    } else {

        $("negotiationMessage").innerHTML = `

            <div class="log-entry">

                <div class="log-heading">
                    NEGOTIATION FAILED
                </div>

                ${escapeHTML(offer.club)}
                believe the valuation is too high.

            </div>

        `;


        toast(

            "NEGOTIATION WARNING — Asking price may be too high."

        );

    }

}


/* =========================================================
   ACCEPT TRANSFER
   ========================================================= */

function acceptTransfer() {

    const offer =
        game.selectedTransfer;


    if (!offer) return;


    const oldClub =
        game.club.name;


    game.club.name =
        offer.club;


    game.club.rating =

        clamp(

            game.player.rating +
            random(-3, 5),

            40,

            99

        );


    const bonus =

        Math.round(
            offer.offer * .03
        );


    game.player.money +=
        bonus;


    game.player.careerEarnings +=
        bonus;


    game.player.reputation =

        clamp(

            game.player.reputation + 8,

            0,

            100

        );


    addLog(

        "TRANSFER COMPLETED",

        `${game.player.name} moves from ${oldClub} to ${offer.club} for ${money(offer.offer)}. Signing bonus: ${money(bonus)}.`

    );


    /*
        New weekly match.
    */

    generateWeeklyMatch();


    toast(

        `TRANSFER COMPLETE — ${offer.club}`,

        4500

    );


    showScreen(
        "careerScreen"
    );


    updateAll();


    saveGame(false);

}


/* =========================================================
   REJECT TRANSFER
   ========================================================= */

function rejectTransfer() {

    const offer =
        game.selectedTransfer;


    if (!offer) return;


    addLog(

        "TRANSFER REJECTED",

        `${game.player.name} rejected an offer from ${offer.club}.`

    );


    toast(

        `TRANSFER REJECTED — Staying at ${game.club.name}.`

    );


    showScreen(
        "careerScreen"
    );


    saveGame(false);

}


/* =========================================================
   AWARDS
   ========================================================= */

function finishSeason() {

    const player =
        game.player;


    if (

        player.seasonGoals >= 20 ||

        player.seasonAssists >= 15

    ) {

        player.playerOfYear = true;

        player.trophies++;


        addLog(

            "PLAYER OF THE YEAR",

            `Outstanding season. ${player.name} wins Player of the Year.`

        );

    }


    if (
        player.seasonGoals >= 25
    ) {

        player.goldenBoot = true;

        player.trophies++;


        addLog(

            "GOLDEN BOOT",

            `${player.name} wins the Golden Boot with ${player.seasonGoals} goals.`

        );

    }


    if (

        player.rating >= 90 &&

        player.reputation >= 70

    ) {

        player.ballonDor = true;

        player.trophies++;


        addLog(

            "BALLON D'OR",

            `${player.name} has reached world-class status and wins the Ballon d'Or.`

        );

    }


    player.seasonGoals = 0;

    player.seasonAssists = 0;


    if (

        player.rating < player.potential &&

        Math.random() < .75

    ) {

        player.rating =

            clamp(

                player.rating + random(1, 3),

                1,

                player.potential

            );

    }

}


/* =========================================================
   AWARDS SCREEN
   ========================================================= */

function openAwards() {

    $("playerOfYearStatus").textContent =

        game.player.playerOfYear

            ? `WON — Season ${game.season - 1}`

            : "Not won";


    $("goldenBootStatus").textContent =

        game.player.goldenBoot

            ? `WON — Season ${game.season - 1}`

            : "Not won";


    $("ballonDorStatus").textContent =

        game.player.ballonDor

            ? `WON — World Football`

            : "Not won";


    $("teamTrophiesStatus").textContent =
        game.player.trophies;


    showScreen(
        "awardsScreen"
    );

}


/* =========================================================
   RETIRE
   ========================================================= */

function retireCareer() {

    $("retireGoals").textContent =
        game.player.goals;


    $("retireAssists").textContent =
        game.player.assists;


    $("retireTrophies").textContent =
        game.player.trophies;


    $("retireMoney").textContent =
        money(game.player.careerEarnings);


    $("retirementSummary").textContent =

        `${game.player.name} retires at age ${game.player.age}. ${game.player.goals} goals, ${game.player.assists} assists and ${game.player.trophies} trophies define the career.`;


    showScreen(
        "retirementScreen"
    );


    saveGame(false);

}


/* =========================================================
   LEGACY
   ========================================================= */

function openLegacy() {

    game.legacy.active =
        true;


    showScreen(
        "legacyScreen"
    );


    saveGame(false);

}


function openClubCreation() {

    showScreen(
        "clubCreateScreen"
    );

}


function updateClubPreview() {

    const name =
        $("newClubName")?.value.trim()
        || "YOUR CLUB";


    const city =
        $("newClubCity")?.value.trim()
        || "YOUR CITY";


    $("clubPreviewName").textContent =
        name.toUpperCase();


    $("clubPreviewCity").textContent =
        city.toUpperCase();

}


/* =========================================================
   FOUND CLUB
   ========================================================= */

function foundClub() {

    const name =
        $("newClubName").value.trim();


    const city =
        $("newClubCity").value.trim();


    const motto =
        $("newClubMotto").value.trim();


    const stadium =
        $("newClubStadium").value.trim();


    if (
        !name ||
        !city ||
        !motto ||
        !stadium
    ) {

        toast(
            "COMPLETE ALL CLUB FOUNDATION DETAILS."
        );


        return;

    }


    game.legacy.active =
        true;


    game.legacy.club = {

        name,

        city,

        motto,

        stadium

    };


    game.legacy.funds =

        Math.max(

            100000,

            game.player.money

        );


    game.legacy.squad =
        generateSquad();


    game.legacy.financeLog.unshift({

        text:
            `Founded ${name} in ${city}. Stadium: ${stadium}.`

    });


    addLog(

        "LEGACY CLUB FOUNDED",

        `${name} has been founded in ${city}.`

    );


    showScreen(
        "ownerScreen"
    );


    updateOwner();


    saveGame(false);


    toast(

        `CLUB FOUNDED — ${name}`,

        4500

    );

}


/* =========================================================
   GENERATE SQUAD
   ========================================================= */

function generateSquad() {

    const positions = [

        "GK",
        "GK",
        "CB",
        "CB",
        "LB",
        "RB",
        "CDM",
        "CM",
        "CAM",
        "LW",
        "RW",
        "ST"

    ];


    return positions.map(
        (position, index) => {

            const name =

                `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`;


            return {

                id:
                    Date.now() + index,

                name,

                position,

                rating:
                    random(55, 72),

                age:
                    random(17, 27),

                wage:
                    random(300, 900)

            };

        }
    );

}


/* =========================================================
   OWNER MODE
   ========================================================= */

function updateOwner() {

    const legacy =
        game.legacy;


    if (
        !legacy.club.name
    ) {

        return;

    }


    $("ownerClubName").textContent =
        legacy.club.name;


    $("ownerClubMotto").textContent =
        legacy.club.motto;


    $("ownerFunds").textContent =
        money(legacy.funds);


    $("ownerRating").textContent =
        legacy.rating;


    $("ownerReputation").textContent =
        legacy.reputation;


    $("ownerStadiumLevel").textContent =
        legacy.stadiumLevel;


    $("ownerYouthLevel").textContent =
        legacy.youthLevel;


    renderOwnerSquad();

    renderStartingXI();

    updateUpgradeCosts();

    renderOwnerWorld();

}


/* =========================================================
   OWNER SQUAD
   ========================================================= */

function renderOwnerSquad() {

    const container =
        $("ownerSquad");


    if (!container) return;


    container.innerHTML =

        game.legacy.squad

            .map(player => `

                <div>

                    <strong>
                        ${escapeHTML(player.name)}
                    </strong>

                    <br>

                    <span>

                        ${player.position}

                        · OVR ${player.rating}

                        · ${player.age} yrs

                    </span>

                </div>

            `)

            .join("");

}


/* =========================================================
   STARTING XI
   ========================================================= */

function renderStartingXI() {

    const container =
        $("startingXI");


    if (!container) return;


    const starting =
        game.legacy.squad.slice(0, 11);


    container.innerHTML =

        starting

            .map((player, index) => `

                <div>

                    ${index + 1}.

                    <strong>
                        ${escapeHTML(player.name)}
                    </strong>

                    — ${player.position}

                    · OVR ${player.rating}

                </div>

            `)

            .join("");

}


/* =========================================================
   OWNER WORLD
   ========================================================= */

function renderOwnerWorld() {

    if (
        !$("ownerWorldFeed")
    ) {

        return;

    }


    $("ownerWorldFeed").innerHTML =

        [

            "Your club is attracting local attention.",

            "Scouts are searching for the next generation.",

            "Supporters want investment in the stadium.",

            "Youth development is becoming a priority.",

            "Your club's reputation is growing."

        ]

            .map(text => `

                <div>

                    <strong>
                        CLUB NEWS
                    </strong>

                    <br>

                    ${text}

                </div>

            `)

            .join("");

}


/* =========================================================
   UPGRADE COSTS
   ========================================================= */

function updateUpgradeCosts() {

    const l =
        game.legacy;


    const stadium =
        25000 * l.stadiumLevel;


    const youth =
        20000 * l.youthLevel;


    const training =
        30000 * l.trainingLevel;


    const staff =
        15000 * l.staffLevel;


    $("stadiumUpgradeCost").textContent =
        money(stadium);


    $("youthUpgradeCost").textContent =
        money(youth);


    $("trainingUpgradeCost").textContent =
        money(training);


    $("staffUpgradeCost").textContent =
        money(staff);

}


/* =========================================================
   OWNER UPGRADE
   ========================================================= */

function buyUpgrade(type) {

    const l =
        game.legacy;


    let cost = 0;


    if (
        type === "stadium"
    ) {

        cost =
            25000 * l.stadiumLevel;


        if (
            !spendOwnerMoney(cost)
        ) return;


        l.stadiumLevel++;


        l.rating =

            clamp(
                l.rating + 3,
                1,
                99
            );


        addFinance(

            `Stadium upgraded to Level ${l.stadiumLevel}.`

        );


        toast(
            "STADIUM UPGRADED."
        );

    }


    if (
        type === "youth"
    ) {

        cost =
            20000 * l.youthLevel;


        if (
            !spendOwnerMoney(cost)
        ) return;


        l.youthLevel++;


        l.reputation =

            clamp(

                l.reputation + 4,

                0,

                100

            );


        addFinance(

            `Youth Academy upgraded to Level ${l.youthLevel}.`

        );


        toast(
            "YOUTH ACADEMY UPGRADED."
        );

    }


    if (
        type === "training"
    ) {

        cost =
            30000 * l.trainingLevel;


        if (
            !spendOwnerMoney(cost)
        ) return;


        l.trainingLevel++;


        l.rating =

            clamp(

                l.rating + 4,

                1,

                99

            );


        addFinance(

            `Training Centre upgraded to Level ${l.trainingLevel}.`

        );


        toast(
            "TRAINING CENTRE UPGRADED."
        );

    }


    if (
        type === "staff"
    ) {

        cost =
            15000 * l.staffLevel;


        if (
            !spendOwnerMoney(cost)
        ) return;


        l.staffLevel++;


        l.reputation =

            clamp(

                l.reputation + 2,

                0,

                100

            );


        addFinance(

            `Staff upgraded to Level ${l.staffLevel}.`

        );


        toast(
            "STAFF UPGRADED."
        );

    }


    updateOwner();

    saveGame(false);

}


/* =========================================================
   SPEND OWNER MONEY
   ========================================================= */

function spendOwnerMoney(amount) {

    if (
        game.legacy.funds < amount
    ) {

        toast(
            "NOT ENOUGH CLUB FUNDS."
        );


        return false;

    }


    game.legacy.funds -=
        amount;


    return true;

}


/* =========================================================
   FINANCES
   ========================================================= */

function addFinance(text) {

    game.legacy.financeLog.unshift({

        text,

        time: Date.now()

    });


    game.legacy.financeLog =

        game.legacy.financeLog.slice(
            0,
            50
        );

}


function openFinance() {

    const l =
        game.legacy;


    const revenue =

        l.stadiumLevel * 12500 +

        l.reputation * 500;


    const wages =

        l.squad.reduce(

            (sum, player) =>
                sum + player.wage,

            0

        ) * 4;


    const balance =
        revenue - wages;


    $("financeFunds").textContent =
        money(l.funds);


    $("financeRevenue").textContent =
        money(revenue);


    $("financeWages").textContent =
        money(wages);


    $("financeBalance").textContent =
        money(balance);


    $("financeLog").innerHTML =

        l.financeLog

            .map(entry => `

                <div>
                    ${escapeHTML(entry.text)}
                </div>

            `)

            .join("");


    showScreen(
        "financeScreen"
    );

}


/* =========================================================
   SCOUTING
   ========================================================= */

function openScout() {

    const prospects = [];


    for (
        let i = 0;
        i < 5;
        i++
    ) {

        prospects.push({

            name:
                `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`,

            position:
                pick([

                    "GK",
                    "CB",
                    "LB",
                    "RB",
                    "CM",
                    "CAM",
                    "LW",
                    "RW",
                    "ST"

                ]),

            age:
                random(16, 19),

            rating:
                random(

                    55 +
                    game.legacy.youthLevel * 2,

                    70 +
                    game.legacy.youthLevel * 2

                ),

            potential:
                random(75, 94),

            value:
                random(10000, 60000)

        });

    }


    $("scoutResults").innerHTML =

        prospects

            .map((player, index) => `

                <div class="scout-card">

                    <span class="eyebrow">
                        PROSPECT ${index + 1}
                    </span>

                    <h3>
                        ${escapeHTML(player.name)}
                    </h3>

                    <p>
                        ${player.position}
                        · Age ${player.age}
                    </p>

                    <strong>
                        OVR ${player.rating}
                    </strong>

                    <p>
                        Potential ${player.potential}
                    </p>

                    <button
                        class="primary"
                        data-sign-player="${index}"
                        type="button">

                        SIGN — ${money(player.value)}

                    </button>

                </div>

            `)

            .join("");


    game.currentScout =
        prospects;


    $("scoutResults")

        .querySelectorAll(
            "[data-sign-player]"
        )

        .forEach(button => {

            button.addEventListener(

                "click",

                () => {

                    signScoutedPlayer(

                        Number(
                            button.dataset.signPlayer
                        )

                    );

                }

            );

        });


    showScreen(
        "scoutScreen"
    );

}


/* =========================================================
   SIGN SCOUTED PLAYER
   ========================================================= */

function signScoutedPlayer(index) {

    const player =
        game.currentScout?.[index];


    if (!player) return;


    if (

        game.legacy.funds <
        player.value

    ) {

        toast(
            "NOT ENOUGH FUNDS TO SIGN THIS PLAYER."
        );


        return;

    }


    game.legacy.funds -=
        player.value;


    game.legacy.squad.push({

        id:
            Date.now(),

        name:
            player.name,

        position:
            player.position,

        rating:
            player.rating,

        age:
            player.age,

        wage:
            random(300, 900)

    });


    addFinance(

        `Signed ${player.name} for ${money(player.value)}.`

    );


    updateOwner();

    saveGame(false);


    toast(

        `PLAYER SIGNED — ${player.name}`

    );


    openScout();

}


/* =========================================================
   YOUTH ACADEMY
   ========================================================= */

function developYouth() {

    const cost =
        10000 *
        game.legacy.youthLevel;


    if (
        !spendOwnerMoney(cost)
    ) {

        return;

    }


    const player = {

        id:
            Date.now(),

        name:
            `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`,

        position:
            pick([

                "CM",
                "CAM",
                "LW",
                "RW",
                "ST"

            ]),

        rating:

            random(

                50,

                60 +
                game.legacy.youthLevel * 2

            ),

        age:
            random(15, 18),

        wage:
            random(200, 500)

    };


    game.legacy.squad.push(
        player
    );


    addFinance(

        `Youth academy promoted ${player.name}.`

    );


    updateOwner();

    saveGame(false);


    toast(

        `YOUTH PLAYER PROMOTED — ${player.name}`

    );

}


/* =========================================================
   OWNER MATCH
   ========================================================= */

function ownerMatch() {

    if (
        !game.legacy.club.name
    ) {

        toast(
            "FOUND A CLUB FIRST."
        );


        return;

    }


    const opponent =

        pick(

            CLUBS.filter(

                c =>
                    c !==
                    game.legacy.club.name

            )

        );


    const clubStrength =

        game.legacy.rating +

        game.legacy.trainingLevel * 3;


    const opponentStrength =
        random(45, 80);


    const homeScore =

        random(

            0,

            Math.max(

                1,

                Math.round(
                    clubStrength / 25
                )

            )

        );


    const awayScore =

        random(

            0,

            Math.max(

                1,

                Math.round(
                    opponentStrength / 25
                )

            )

        );


    let result =
        "DRAW";


    if (
        homeScore > awayScore
    ) {

        result =
            "WIN";


        game.legacy.rating =

            clamp(

                game.legacy.rating + 1,

                1,

                99

            );


        game.legacy.reputation =

            clamp(

                game.legacy.reputation + 2,

                0,

                100

            );

    } else if (
        homeScore < awayScore
    ) {

        result =
            "LOSS";

    }


    addFinance(

        `${game.legacy.club.name} ${homeScore}-${awayScore} ${opponent} — ${result}.`

    );


    toast(

        `MATCH RESULT — ${homeScore}-${awayScore} · ${result}`

    );


    updateOwner();

    saveGame(false);

}


/* =========================================================
   LEGACY INVEST
   ========================================================= */

function legacyInvest() {

    const amount =
        50000;


    if (
        game.player.money < amount
    ) {

        toast(
            "NOT ENOUGH PERSONAL FUNDS."
        );


        return;

    }


    game.player.money -=
        amount;


    game.legacy.funds +=
        amount * 2;


    game.legacy.reputation =

        clamp(

            game.legacy.reputation + 5,

            0,

            100

        );


    toast(

        "INVESTMENT SUCCESSFUL — Club funds increased."

    );


    updateOwner();

    saveGame(false);

}


/* =========================================================
   PLAYER UI
   ========================================================= */

function updatePlayerUI() {

    const p =
        game.player;


    if ($("topAge")) {

        $("topAge").innerHTML =
            `AGE <strong>${p.age}</strong>`;

    }


    if ($("topRating")) {

        $("topRating").innerHTML =
            `OVR <strong>${p.rating}</strong>`;

    }


    if ($("topMoney")) {

        $("topMoney").textContent =
            money(p.money);

    }


    if ($("careerPlayerName")) {

        $("careerPlayerName").textContent =
            p.name;

    }


    if ($("careerClub")) {

        $("careerClub").textContent =
            game.club.name;

    }


    if ($("careerRating")) {

        $("careerRating").textContent =
            p.rating;

    }


    if ($("careerAge")) {

        $("careerAge").textContent =
            p.age;

    }


    if ($("careerFitness")) {

        $("careerFitness").textContent =
            p.fitness;

    }


    if ($("careerForm")) {

        $("careerForm").textContent =
            p.form;

    }


    if ($("careerGoals")) {

        $("careerGoals").textContent =
            p.goals;

    }


    if ($("careerAssists")) {

        $("careerAssists").textContent =
            p.assists;

    }


    if ($("careerReputation")) {

        $("careerReputation").textContent =
            p.reputation;

    }


    if ($("profileRating")) {

        $("profileRating").textContent =
            p.rating;

    }


    if ($("profileName")) {

        $("profileName").textContent =
            p.name;

    }


    if ($("profilePosition")) {

        $("profilePosition").textContent =
            p.position;

    }


    if ($("profileClub")) {

        $("profileClub").textContent =
            game.club.name;

    }


    if ($("potentialValue")) {

        $("potentialValue").textContent =
            p.potential;

    }


    const potentialPercent =

        clamp(

            (
                p.rating /
                p.potential
            ) * 100,

            0,

            100

        );


    if ($("potentialFill")) {

        $("potentialFill").style.width =
            `${potentialPercent}%`;

    }

}


/* =========================================================
   UPDATE EVERYTHING
   ========================================================= */

function updateAll() {

    updatePlayerUI();

    renderCalendar();

    renderCareerLog();

    renderWorldFeed();


    if (

        game.legacy.active &&

        game.legacy.club.name

    ) {

        updateOwner();

    }

}


/* =========================================================
   RESET
   ========================================================= */

function resetGame() {

    const confirmed =

        confirm(

            "RESET PROJECT XI? Your saved career will be deleted."

        );


    if (!confirmed) {

        return;

    }


    localStorage.removeItem(
        SAVE_KEY
    );


    /*
        Also remove the previous V20 save
        so testing starts completely clean.
    */

    localStorage.removeItem(
        "PROJECT_XI_FOOTBALL_LIFE_V20"
    );


    game =
        createDefaultGame();


    updateAll();


    showScreen(
        "menuScreen"
    );


    toast(
        "CAREER RESET."
    );

}


/* =========================================================
   EVENT LISTENERS
   ========================================================= */

function setupEvents() {

    $("newGameButton")
        ?.addEventListener(

            "click",

            () =>
                showScreen(
                    "createScreen"
                )

        );


    $("continueButton")
        ?.addEventListener(

            "click",

            loadGame

        );


    $("logoButton")
        ?.addEventListener(

            "click",

            () => {

                if (
                    game.started
                ) {

                    showScreen(
                        "careerScreen"
                    );

                } else {

                    showScreen(
                        "menuScreen"
                    );

                }

            }

        );


    $("createPlayerButton")
        ?.addEventListener(

            "click",

            createPlayer

        );


    $("playerName")
        ?.addEventListener(

            "input",

            updateCreationPreview

        );


    $("playerPosition")
        ?.addEventListener(

            "change",

            updateCreationPreview

        );


    /*
        MAIN CALENDAR BUTTON
    */

    $("advanceDayButton")
        ?.addEventListener(

            "click",

            advanceDay

        );


    $("trainingButton")
        ?.addEventListener(

            "click",

            manualTrain

        );


    $("restButton")
        ?.addEventListener(

            "click",

            manualRest

        );


    $("matchButton")
        ?.addEventListener(

            "click",

            manualMatch

        );


    /*
        MATCH CONTROLS
    */

    $("matchAttackButton")
        ?.addEventListener(

            "click",

            () =>
                matchAction(
                    "attack"
                )

        );


    $("matchPassButton")
        ?.addEventListener(

            "click",

            () =>
                matchAction(
                    "pass"
                )

        );


    $("matchDefendButton")
        ?.addEventListener(

            "click",

            () =>
                matchAction(
                    "defend"
                )

        );


    $("signContractButton")
        ?.addEventListener(

            "click",

            signContract

        );


    $("transferButton")
        ?.addEventListener(

            "click",

            openTransfers

        );


    $("transferBackButton")
        ?.addEventListener(

            "click",

            () =>
                showScreen(
                    "careerScreen"
                )

        );


    $("counterOfferButton")
        ?.addEventListener(

            "click",

            sendCounterOffer

        );


    $("acceptTransferButton")
        ?.addEventListener(

            "click",

            acceptTransfer

        );


    $("rejectTransferButton")
        ?.addEventListener(

            "click",

            rejectTransfer

        );


    $("careerAwardsButton")
        ?.addEventListener(

            "click",

            openAwards

        );


    $("awardsBackButton")
        ?.addEventListener(

            "click",

            () =>
                showScreen(
                    "careerScreen"
                )

        );


    $("retireButton")
        ?.addEventListener(

            "click",

            retireCareer

        );


    $("beginLegacyButton")
        ?.addEventListener(

            "click",

            openLegacy

        );


    $("legacyMenuButton")
        ?.addEventListener(

            "click",

            openLegacy

        );


    $("createClubButton")
        ?.addEventListener(

            "click",

            openClubCreation

        );


    $("legacyInvestButton")
        ?.addEventListener(

            "click",

            legacyInvest

        );


    $("newClubName")
        ?.addEventListener(

            "input",

            updateClubPreview

        );


    $("newClubCity")
        ?.addEventListener(

            "input",

            updateClubPreview

        );


    $("foundClubButton")
        ?.addEventListener(

            "click",

            foundClub

        );


    $("scoutButton")
        ?.addEventListener(

            "click",

            openScout

        );


    $("scoutBackButton")
        ?.addEventListener(

            "click",

            () =>
                showScreen(
                    "ownerScreen"
                )

        );


    $("youthAcademyButton")
        ?.addEventListener(

            "click",

            developYouth

        );


    $("ownerMatchButton")
        ?.addEventListener(

            "click",

            ownerMatch

        );


    $("ownerFinanceButton")
        ?.addEventListener(

            "click",

            openFinance

        );


    $("financeBackButton")
        ?.addEventListener(

            "click",

            () =>
                showScreen(
                    "ownerScreen"
                )

        );


    $("ownerTransfersButton")
        ?.addEventListener(

            "click",

            openScout

        );


    $("upgradeStadiumButton")
        ?.addEventListener(

            "click",

            () =>
                buyUpgrade(
                    "stadium"
                )

        );


    $("upgradeYouthButton")
        ?.addEventListener(

            "click",

            () =>
                buyUpgrade(
                    "youth"
                )

        );


    $("upgradeTrainingButton")
        ?.addEventListener(

            "click",

            () =>
                buyUpgrade(
                    "training"
                )

        );


    $("hireStaffButton")
        ?.addEventListener(

            "click",

            () =>
                buyUpgrade(
                    "staff"
                )

        );


    $("saveGameButton")
        ?.addEventListener(

            "click",

            () =>
                saveGame(true)

        );


    $("resetGameButton")
        ?.addEventListener(

            "click",

            resetGame

        );

}


/* =========================================================
   INITIALIZATION
   ========================================================= */

function init() {

    setupEvents();


    updateCreationPreview();


    updateClubPreview();


    generateWorldFeed();


    updateAll();


    /*
        Silently load the V21 save.
    */

    const saved =
        localStorage.getItem(
            SAVE_KEY
        );


    if (saved) {

        try {

            const parsed =
                JSON.parse(saved);


            if (
                parsed?.started
            ) {

                game =

                    mergeDeep(

                        createDefaultGame(),

                        parsed

                    );


                repairMatchState();


                /*
                    If a previous save somehow
                    contained an active match,
                    don't leave the calendar frozen.
                */

                if (
                    game.match.active
                ) {

                    game.match.active =
                        false;

                }


                updateAll();

            }


        } catch (error) {

            console.warn(
                "Save exists but could not be read."
            );

        }

    }

}


document.addEventListener(

    "DOMContentLoaded",

    init

);
