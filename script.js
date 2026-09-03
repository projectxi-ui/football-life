/* =========================================================
   PROJECT XI: FOOTBALL LIFE
   COMPLETE GAME ENGINE
========================================================= */

const SAVE_KEY = "projectXI_football_life_v10";

let player = null;
let club = null;

let currentCutsceneCallback = null;
let currentTransfer = null;
let matchState = null;


/* =========================================================
   UTILITIES
========================================================= */

const $ = id => document.getElementById(id);

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function money(value) {
    return "€" + Math.floor(value || 0).toLocaleString();
}

function choose(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function getPositionName(position) {
    const names = {
        ST: "Striker",
        LW: "Left Wing",
        RW: "Right Wing",
        CAM: "Attacking Midfielder",
        CM: "Central Midfielder",
        CDM: "Defensive Midfielder",
        CB: "Centre Back",
        LB: "Left Back",
        RB: "Right Back",
        GK: "Goalkeeper"
    };

    return names[position] || position;
}


/* =========================================================
   SCREENS
========================================================= */

const screenIds = [
    "menuScreen",
    "createScreen",
    "clubSelectScreen",
    "careerScreen",
    "matchScreen",
    "contractScreen",
    "transferScreen",
    "negotiationScreen",
    "awardsScreen",
    "retirementScreen",
    "legacyScreen",
    "clubCreateScreen",
    "ownerScreen",
    "scoutScreen",
    "financeScreen",
    "settingsScreen"
];

function showScreen(id) {

    screenIds.forEach(screenId => {
        const element = $(screenId);

        if (element) {
            element.classList.remove("active");
            element.classList.add("hidden");
        }
    });

    const target = $(id);

    if (target) {
        target.classList.remove("hidden");
        target.classList.add("active");
    }

    updateUI();
}


/* =========================================================
   TOAST
========================================================= */

function toast(message) {

    const element = $("toast");

    if (!element) return;

    element.textContent = message;
    element.classList.remove("hidden");

    clearTimeout(window.toastTimer);

    window.toastTimer = setTimeout(() => {
        element.classList.add("hidden");
    }, 3000);
}


/* =========================================================
   CAREER LOG
========================================================= */

function addLog(text) {

    const log = $("careerLog");

    if (!log) return;

    const entry = document.createElement("div");

    entry.className = "log-entry";

    entry.innerHTML = `
        <span class="log-time">
            ${getDateLabel()}
        </span>
        <div>${text}</div>
    `;

    log.prepend(entry);
}

function getDateLabel() {

    if (!player) return "DAY 1";

    const days = player.day || 1;

    return `DAY ${days}`;
}


/* =========================================================
   CUTSCENES
========================================================= */

function playCutscene(location, title, text, callback) {

    const overlay = $("cutsceneOverlay");

    if (!overlay) {
        if (callback) callback();
        return;
    }

    $("cutsceneLocation").textContent = location;
    $("cutsceneTitle").textContent = title;
    $("cutsceneText").textContent = text;

    currentCutsceneCallback = callback || null;

    overlay.classList.remove("hidden");

    document.body.classList.add("cutscene-active");
}

function closeCutscene() {

    const overlay = $("cutsceneOverlay");

    if (overlay) {
        overlay.classList.add("hidden");
    }

    document.body.classList.remove("cutscene-active");

    const callback = currentCutsceneCallback;

    currentCutsceneCallback = null;

    if (callback) {
        callback();
    }
}

$("cutsceneContinue")?.addEventListener("click", closeCutscene);


/* =========================================================
   PLAYER CREATION
========================================================= */

$("newGameButton")?.addEventListener("click", () => {

    showScreen("createScreen");
});

$("continueButton")?.addEventListener("click", () => {

    if (!player) {
        showScreen("createScreen");
        return;
    }

    if (player.retired) {

        if (club) {
            updateOwnerUI();
            showScreen("ownerScreen");
        } else {
            showScreen("legacyScreen");
        }

    } else {

        showScreen("careerScreen");
    }
});


$("createPlayerButton")?.addEventListener("click", createPlayer);


function createPlayer() {

    const name = $("playerName").value.trim();
    const country = $("playerCountry").value;
    const position = $("playerPosition").value;
    const foot = $("playerFoot").value;

    if (!name) {

        toast("Enter a player name first.");
        return;
    }

    player = {

        name,
        country,
        position,
        foot,

        age: 16,
        season: 1,
        day: 1,
        week: 1,

        rating: 58,
        potential: random(75, 86),

        fitness: 100,
        form: 50,
        happiness: 80,
        reputation: 5,

        money: 2000,
        careerEarnings: 2000,

        club: "PROJECT XI Academy",
        clubStatus: "Youth Player",

        goals: 0,
        assists: 0,
        matches: 0,

        trophies: 0,
        leagueTitles: 0,

        goldenBoots: 0,
        playerOfYear: 0,
        ballonDor: 0,

        injured: false,
        injuryWeeks: 0,

        retired: false,

        contract: null,

        achievements: [],

        calendar: [],

        worldNews: [],

        lastMatch: null
    };

    club = null;

    $("careerLog").innerHTML = "";

    generateCalendar();

    addLog(
        `<strong>THE JOURNEY BEGINS.</strong> ${player.name} arrives at PROJECT XI Academy at age ${player.age}.`
    );

    addWorldNews(
        `PROJECT XI Academy welcomes a new prospect: ${player.name}.`
    );

    saveGame();
    updateUI();

    playCutscene(
        "PROJECT XI ACADEMY",
        "THE JOURNEY BEGINS",
        `${player.name} enters the world's greatest academy. The dream is simple: become a professional footballer.`,
        () => {
            showScreen("careerScreen");
        }
    );
}


/* =========================================================
   PLAYER PREVIEW
========================================================= */

$("playerName")?.addEventListener("input", () => {

    const name = $("playerName").value.trim();

    if ($("previewName")) {
        $("previewName").textContent =
            name || "YOUR PLAYER";
    }
});

$("playerPosition")?.addEventListener("change", () => {

    if ($("previewPosition")) {
        $("previewPosition").textContent =
            $("playerPosition").value;
    }
});


/* =========================================================
   UI UPDATE
========================================================= */

function updateUI() {

    if (!player) return;


    /* TOP BAR */

    if ($("topAge")) {
        $("topAge").innerHTML =
            `AGE <strong>${player.age}</strong>`;
    }

    if ($("topRating")) {
        $("topRating").innerHTML =
            `OVR <strong>${player.rating}</strong>`;
    }

    if ($("topMoney")) {
        $("topMoney").textContent =
            money(player.money);
    }


    /* CAREER */

    setText("careerPlayerName", player.name);
    setText("careerClub", player.club);
    setText("careerRating", player.rating);

    setText("careerAge", player.age);
    setText("careerFitness", player.fitness);
    setText("careerForm", player.form);
    setText("careerGoals", player.goals);
    setText("careerAssists", player.assists);
    setText("careerReputation", player.reputation);

    setText("profileName", player.name);
    setText("profilePosition", getPositionName(player.position));
    setText("profileClub", player.club);
    setText("profileRating", player.rating);
    setText("potentialValue", player.potential);

    if ($("potentialFill")) {

        const percentage =
            clamp((player.rating / player.potential) * 100, 0, 100);

        $("potentialFill").style.width =
            `${percentage}%`;
    }


    /* CALENDAR */

    renderCalendar();

    /* WORLD */

    renderWorldFeed();

    /* AWARDS */

    setText(
        "goldenBootStatus",
        player.goldenBoots
            ? `Won ${player.goldenBoots} time(s)`
            : "Not won"
    );

    setText(
        "playerOfYearStatus",
        player.playerOfYear
            ? `Won ${player.playerOfYear} time(s)`
            : "Not won"
    );

    setText(
        "ballonDorStatus",
        player.ballonDor
            ? `Won ${player.ballonDor} time(s)`
            : "Not won"
    );

    setText(
        "teamTrophiesStatus",
        player.trophies
    );


    /* OWNER */

    if (club) {
        updateOwnerUI();
    }
}


function setText(id, value) {

    const element = $(id);

    if (element) {
        element.textContent = value;
    }
}


/* =========================================================
   CALENDAR
========================================================= */

function generateCalendar() {

    if (!player) return;

    const schedule = [
        "TRAINING",
        "TRAINING",
        "REST",
        "TRAINING",
        "REST",
        "MATCH",
        "RECOVERY"
    ];

    player.calendar = schedule.map((activity, index) => {

        return {
            day: index + 1,
            activity,
            completed: false
        };
    });
}

function renderCalendar() {

    const list = $("calendarList");

    if (!list || !player) return;

    list.innerHTML = "";

    const names = [
        "MON",
        "TUE",
        "WED",
        "THU",
        "FRI",
        "SAT",
        "SUN"
    ];

    player.calendar.forEach((day, index) => {

        const div = document.createElement("div");

        div.className =
            `calendar-day ${day.completed ? "completed" : ""}`;

        div.innerHTML = `
            <span>${names[index]}</span>
            <strong>${day.activity}</strong>
            <small>${day.completed ? "COMPLETED" : "UPCOMING"}</small>
        `;

        list.appendChild(div);
    });

    setText(
        "calendarDate",
        `WEEK ${player.week}`
    );
}


/* =========================================================
   ADVANCE DAY
========================================================= */

$("advanceDayButton")?.addEventListener("click", advanceDay);

function advanceDay() {

    if (!player || player.retired) return;

    const currentDay =
        player.calendar[player.day - ((player.week - 1) * 7) - 1];

    let activity = "REST";

    if (currentDay) {
        activity = currentDay.activity;
        currentDay.completed = true;
    }

    executeCalendarActivity(activity);

    player.day++;

    if (player.day % 7 === 1) {

        player.week++;

        generateCalendar();

        weeklyWorldUpdate();

        payWeeklyIncome();
    }

    updateUI();
    saveGame();
}


function executeCalendarActivity(activity) {

    if (activity === "TRAINING") {

        performTraining();

    } else if (activity === "MATCH") {

        startMatch();

    } else if (activity === "RECOVERY") {

        recoverPlayer();

    } else {

        restPlayer();
    }
}


/* =========================================================
   TRAINING
========================================================= */

$("trainingButton")?.addEventListener("click", performTraining);

function performTraining() {

    if (!player || player.retired) return;

    if (player.injured) {

        toast(
            `Recovery required: ${player.injuryWeeks} week(s).`
        );

        return;
    }

    if (player.fitness < 35) {

        toast("You're too tired to train properly.");
        return;
    }

    player.fitness =
        clamp(player.fitness - random(2, 5), 0, 100);

    const chance = random(1, 100);

    if (
        chance <= 35 &&
        player.rating < player.potential
    ) {

        player.rating =
            Math.min(
                player.rating + 1,
                player.potential
            );

        player.form =
            clamp(player.form + 2, 0, 100);

        player.happiness =
            clamp(player.happiness + 1, 0, 100);

        addLog(
            `<strong>TRAINING BREAKTHROUGH.</strong> ${player.name}'s rating rises to ${player.rating}.`
        );

        toast("Training breakthrough.");
    } else {

        player.form =
            clamp(player.form + 1, 0, 100);

        addLog(
            `<strong>TRAINING GROUND.</strong> ${player.name} completed another hard session.`
        );

        toast("Training completed.");
    }

    updateUI();
    saveGame();
}


/* =========================================================
   REST
========================================================= */

$("restButton")?.addEventListener("click", restPlayer);

function restPlayer() {

    if (!player || player.retired) return;

    player.fitness =
        clamp(player.fitness + random(12, 18), 0, 100);

    player.happiness =
        clamp(player.happiness + random(2, 5), 0, 100);

    player.form =
        clamp(player.form + 1, 0, 100);

    addLog(
        `<strong>RECOVERY DAY.</strong> ${player.name} stayed away from training and focused on recovery.`
    );

    toast("Recovery complete.");

    updateUI();
    saveGame();
}


function recoverPlayer() {

    if (!player) return;

    player.fitness =
        clamp(player.fitness + random(15, 20), 0, 100);

    if (player.injured) {

        player.injuryWeeks--;

        if (player.injuryWeeks <= 0) {

            player.injured = false;
            player.injuryWeeks = 0;

            addLog(
                `<strong>MEDICAL CLEARANCE.</strong> ${player.name} has recovered and can return to football.`
            );
        }
    }
}


/* =========================================================
   MATCH SYSTEM
========================================================= */

$("matchButton")?.addEventListener("click", startMatch);
$("ownerMatchButton")?.addEventListener("click", ownerMatch);

function startMatch() {

    if (!player || player.retired) return;

    if (player.injured) {

        toast("You cannot play while injured.");
        return;
    }

    if (player.fitness < 25) {

        toast("Fitness is too low for a match.");
        return;
    }

    setupMatch();

    showScreen("matchScreen");
}


function setupMatch() {

    const opponents = [
        "Club de Aderis",
        "Northstar United",
        "Ravenholm FC",
        "Silvergate Athletic",
        "Westhaven FC",
        "Eastport Rovers",
        "Redmont United",
        "Ironbridge FC",
        "Blackridge Athletic",
        "Stormvale City"
    ];

    matchState = {

        minute: 0,

        home: player.club,

        away: choose(opponents),

        homeScore: 0,

        awayScore: 0,

        goals: 0,

        assists: 0,

        chances: 0,

        rating: 6.0,

        finished: false
    };

    setText("homeTeam", matchState.home);
    setText("awayTeam", matchState.away);

    setText("homeScore", "0");
    setText("awayScore", "0");
    setText("matchMinute", "0'");

    setText(
        "matchCompetition",
        choose([
            "LEAGUE MATCH",
            "ACADEMY CUP",
            "CHAMPIONSHIP MATCH",
            "WEEKEND FIXTURE"
        ])
    );

    setText(
        "matchCommentary",
        `${matchState.home} vs ${matchState.away}.`
    );
}


/* =========================================================
   MATCH ACTIONS
========================================================= */

$("matchAttackButton")?.addEventListener(
    "click",
    () => matchAction("attack")
);

$("matchPassButton")?.addEventListener(
    "click",
    () => matchAction("create")
);

$("matchDefendButton")?.addEventListener(
    "click",
    () => matchAction("defend")
);


function matchAction(type) {

    if (!matchState || matchState.finished) return;

    matchState.minute += random(5, 12);

    if (matchState.minute > 90) {
        finishMatch();
        return;
    }

    const roll = random(1, 100);

    let commentary = "";


    if (type === "attack") {

        if (roll <= 18) {

            matchState.goals++;

            matchState.homeScore++;

            matchState.rating += 0.8;

            commentary =
                `${matchState.minute}' — ${player.name} scores! What a finish!`;

        } else if (roll <= 42) {

            matchState.chances++;

            matchState.rating += 0.2;

            commentary =
                `${matchState.minute}' — ${player.name} gets into a dangerous position.`;

        } else {

            commentary =
                `${matchState.minute}' — The attack breaks down.`;
        }


    } else if (type === "create") {

        if (roll <= 25) {

            matchState.assists++;

            matchState.rating += 0.6;

            commentary =
                `${matchState.minute}' — ${player.name} creates a huge chance!`;

        } else {

            commentary =
                `${matchState.minute}' — Smart build-up play from ${player.name}.`;
        }


    } else {

        matchState.rating += 0.1;

        commentary =
            `${matchState.minute}' — ${player.name} holds position and helps the team.`;


        if (roll <= 12) {

            matchState.awayScore++;

            commentary +=
                ` ${matchState.away} hits back!`;
        }
    }


    if (roll >= 80 && type !== "defend") {

        matchState.awayScore++;
    }

    setText("homeScore", matchState.homeScore);
    setText("awayScore", matchState.awayScore);
    setText("matchMinute", `${matchState.minute}'`);
    setText("matchCommentary", commentary);
}


function finishMatch() {

    if (!matchState || matchState.finished) return;

    matchState.finished = true;

    player.matches++;

    player.goals += matchState.goals;
    player.assists += matchState.assists;

    player.fitness =
        clamp(player.fitness - random(8, 12), 0, 100);

    const result =
        matchState.homeScore > matchState.awayScore
            ? "WIN"
            : matchState.homeScore === matchState.awayScore
                ? "DRAW"
                : "LOSS";


    if (result === "WIN") {

        player.form =
            clamp(player.form + 5, 0, 100);

        player.reputation =
            clamp(player.reputation + 2, 0, 100);

    } else if (result === "LOSS") {

        player.form =
            clamp(player.form - 3, 0, 100);

    }


    if (matchState.goals > 0) {

        player.reputation =
            clamp(
                player.reputation + matchState.goals,
                0,
                100
            );

        player.happiness =
            clamp(player.happiness + 4, 0, 100);
    }


    const matchRating =
        clamp(
            matchState.rating +
            matchState.goals * 0.7 +
            matchState.assists * 0.4,
            4.5,
            10
        );

    player.lastMatch = {
        opponent: matchState.away,
        result,
        goals: matchState.goals,
        assists: matchState.assists,
        rating: Number(matchRating.toFixed(1))
    };


    addLog(
        `<strong>FULL TIME — ${matchState.home} ${matchState.homeScore}–${matchState.awayScore} ${matchState.away}.</strong>
        ${player.name} finished with ${matchState.goals} goal(s), ${matchState.assists} assist(s) and a ${matchRating.toFixed(1)} match rating.`
    );


    /* TEAM TROPHY CHANCE */

    if (
        player.age >= 18 &&
        result === "WIN" &&
        random(1, 100) <= 3
    ) {

        player.trophies++;

        addLog(
            `<strong>TROPHY WON.</strong> The team lifts a major trophy.`
        );

        playCutscene(
            "THE TROPHY CEREMONY",
            "CHAMPIONS",
            `${player.name} and the team are champions. The first piece of silverware has been added to the cabinet.`,
            () => {}
        );
    }


    checkAwards();
    checkCareerProgression();

    saveGame();
    updateUI();

    setTimeout(() => {

        if (!$("matchScreen").classList.contains("hidden")) {
            showScreen("careerScreen");
        }

    }, 1000);
}


/* =========================================================
   LIFE EVENT
========================================================= */

function lifeEvent() {

    if (!player || player.retired) return;

    const events = [

        {
            text: "You spent time with family and friends.",
            log: `<strong>LIFE.</strong> ${player.name} took some time away from football.`,
            happiness: 8
        },

        {
            text: "You attended a community football event.",
            log: `<strong>COMMUNITY.</strong> ${player.name} connected with young football fans.`,
            happiness: 5,
            reputation: 2
        },

        {
            text: "You had a quiet day away from the spotlight.",
            log: `<strong>QUIET DAY.</strong> ${player.name} stayed away from the cameras.`,
            happiness: 3,
            fitness: 5
        },

        {
            text: "The pressure of football got to you.",
            log: `<strong>PRESSURE.</strong> A difficult day away from the pitch.`,
            happiness: -5
        }
    ];

    const event = choose(events);

    player.happiness =
        clamp(
            player.happiness + (event.happiness || 0),
            0,
            100
        );

    if (event.reputation) {
        player.reputation =
            clamp(
                player.reputation + event.reputation,
                0,
                100
            );
    }

    if (event.fitness) {
        player.fitness =
            clamp(
                player.fitness + event.fitness,
                0,
                100
            );
    }

    addLog(event.log);

    toast(event.text);

    updateUI();
    saveGame();
}


/* =========================================================
   WEEKLY WORLD
========================================================= */

const worldTeams = [
    "Ravenholm FC",
    "Northstar United",
    "Kingsbridge City",
    "Silvergate Athletic",
    "Westhaven FC",
    "Eastport Rovers",
    "Redmont United",
    "Ironbridge FC",
    "Blackridge Athletic",
    "Stormvale City",
    "Oakchester FC",
    "Crownfield United",
    "Riverstone FC",
    "Highland Rovers",
    "Westmoor City",
    "Ashford Athletic",
    "Deportivo Veyra",
    "Club de Aderis",
    "Atlético Marenza"
];

function addWorldNews(text) {

    if (!player) return;

    player.worldNews.unshift({
        text,
        day: player.day
    });

    player.worldNews =
        player.worldNews.slice(0, 12);
}


function weeklyWorldUpdate() {

    if (!player) return;

    const teamA = choose(worldTeams);
    const teamB = choose(
        worldTeams.filter(team => team !== teamA)
    );

    const scoreA = random(0, 4);
    const scoreB = random(0, 4);

    const events = [

        `${teamA} ${scoreA}–${scoreB} ${teamB}.`,

        `${teamA} are monitoring a young midfielder from the academy system.`,

        `${teamB} have announced a new manager.`,

        `Transfer rumours are growing around ${teamA}.`,

        `${teamB} have suffered an injury to a key player.`,

        `Scouts from ${teamA} were spotted at a youth tournament.`,

        `The football world is talking about the rise of ${teamB}.`
    ];

    addWorldNews(choose(events));
}


function renderWorldFeed() {

    if (!player) return;

    const feeds = [
        $("worldFeed"),
        $("ownerWorldFeed"),
        $("menuWorldFeed")
    ];

    feeds.forEach(feed => {

        if (!feed) return;

        feed.innerHTML = "";

        const news =
            player.worldNews.length
                ? player.worldNews
                : [{
                    text: "The football world is moving.",
                    day: player.day
                }];

        news.slice(0, 7).forEach(item => {

            const div = document.createElement("div");

            div.className = "feed-item";

            div.innerHTML = `
                <small>DAY ${item.day}</small>
                <span>${item.text}</span>
            `;

            feed.appendChild(div);
        });
    });
}


/* =========================================================
   WEEKLY PAY
========================================================= */

function payWeeklyIncome() {

    if (!player) return;

    let income = 100;

    if (player.clubStatus === "Professional Player") {
        income = 700;
    }

    if (player.clubStatus === "First Team Player") {
        income = 1800;
    }

    if (player.clubStatus === "Star Player") {
        income = 4000;
    }

    if (player.clubStatus === "World-Class Player") {
        income = 8000;
    }

    player.money += income;
    player.careerEarnings += income;

    addLog(
        `<strong>WEEKLY PAY.</strong> ${player.name} received ${money(income)}.`
    );
}


/* =========================================================
   AGE / SEASON
========================================================= */

function ageUp() {

    if (!player || player.retired) return;

    player.age++;
    player.season++;

    player.form =
        clamp(player.form + random(-5, 5), 0, 100);

    player.happiness =
        clamp(player.happiness + random(-4, 5), 0, 100);

    yearlyDevelopment();

    weeklyWorldUpdate();

    checkCareerProgression();

    checkAwards();

    if (player.age >= 40) {

        retirePlayer();
        return;
    }

    generateCalendar();

    addLog(
        `<strong>NEW SEASON.</strong> ${player.name} begins Season ${player.season} at age ${player.age}.`
    );

    saveGame();
    updateUI();
}


function yearlyDevelopment() {

    if (
        player.age <= 24 &&
        player.rating < player.potential
    ) {

        const chance = random(1, 100);

        if (chance <= 50) {

            player.rating =
                Math.min(
                    player.rating + 1,
                    player.potential
                );
        }
    }

    if (player.age >= 30) {

        if (random(1, 100) <= 25) {

            player.rating =
                Math.max(
                    60,
                    player.rating - 1
                );
        }
    }

    player.fitness =
        clamp(player.fitness + 10, 0, 100);
}


/* =========================================================
   CAREER PROGRESSION
========================================================= */

function checkCareerProgression() {

    if (!player) return;


    /* FIRST PRO CONTRACT */

    if (
        player.age >= 18 &&
        player.rating >= 64 &&
        player.clubStatus === "Youth Player"
    ) {

        player.club = "PROJECT XI FC";

        player.clubStatus =
            "Professional Player";

        player.money += 5000;

        player.careerEarnings += 5000;

        player.contract = {
            years: 3,
            salary: 1200,
            value: 250000
        };

        addLog(
            `<strong>PROFESSIONAL CONTRACT.</strong> ${player.name} has received a professional contract from PROJECT XI FC.`
        );

        playCutscene(
            "PROJECT XI FC",
            "THE FIRST PROFESSIONAL CONTRACT",
            `${player.name} signs the contract. The dream of becoming a professional footballer is now real.`,
            () => {
                showScreen("careerScreen");
            }
        );

        return;
    }


    /* FIRST TEAM */

    if (
        player.age >= 21 &&
        player.rating >= 72 &&
        player.clubStatus === "Professional Player"
    ) {

        player.club =
            "PROJECT XI UNITED";

        player.clubStatus =
            "First Team Player";

        player.money += 15000;

        player.careerEarnings += 15000;

        if (player.contract) {
            player.contract.salary = 3500;
            player.contract.value = 5000000;
        }

        addLog(
            `<strong>FIRST TEAM.</strong> ${player.name} has earned a place in PROJECT XI United's first team.`
        );

        playCutscene(
            "PROJECT XI UNITED",
            "THE BIG STEP",
            `${player.name} is no longer just a prospect. The first team is now home.`,
            () => {
                showScreen("careerScreen");
            }
        );

        return;
    }


    /* STAR */

    if (
        player.age >= 25 &&
        player.rating >= 80 &&
        player.clubStatus === "First Team Player"
    ) {

        player.clubStatus =
            "Star Player";

        if (player.contract) {
            player.contract.salary = 9000;
            player.contract.value = 30000000;
        }

        addLog(
            `<strong>STAR STATUS.</strong> ${player.name} has become one of the most important players at the club.`
        );

        playCutscene(
            "THE FOOTBALL WORLD",
            "STAR PLAYER",
            `${player.name} is no longer a rising prospect. The football world now knows the name.`,
            () => {}
        );

        return;
    }


    /* WORLD CLASS */

    if (
        player.age >= 29 &&
        player.rating >= 85 &&
        player.reputation >= 60 &&
        player.clubStatus === "Star Player"
    ) {

        player.clubStatus =
            "World-Class Player";

        if (player.contract) {
            player.contract.salary = 25000;
            player.contract.value = 90000000;
        }

        addLog(
            `<strong>WORLD CLASS.</strong> ${player.name} has reached the highest level of the game.`
        );

        playCutscene(
            "THE FOOTBALL WORLD",
            "WORLD CLASS",
            `${player.name}'s name is now known in every major football stadium.`,
            () => {}
        );
    }
}


/* =========================================================
   TRANSFERS
========================================================= */

$("transferButton")?.addEventListener(
    "click",
    openTransfers
);

$("transferBackButton")?.addEventListener(
    "click",
    () => showScreen("careerScreen")
);

function openTransfers() {

    if (!player || player.retired) return;

    renderTransferOffers();

    showScreen("transferScreen");
}


function calculateTransferValue() {

    if (!player) return 0;

    let value = 50000;

    value += player.rating * 150000;

    value += player.goals * 25000;

    value += player.assists * 15000;

    value += player.reputation * 50000;

    value += player.trophies * 1000000;

    value += Math.max(
        0,
        player.potential - player.rating
    ) * 100000;

    if (player.age <= 23) {
        value *= 1.35;
    }

    if (player.age >= 30) {
        value *= 0.65;
    }

    return Math.max(50000, Math.floor(value));
}


function renderTransferOffers() {

    const container = $("transferOffers");

    if (!container) return;

    container.innerHTML = "";

    const offers = generateTransferOffers();

    offers.forEach(offer => {

        const div = document.createElement("div");

        div.className = "transfer-offer";

        div.innerHTML = `
            <strong>${offer.club}</strong>
            <span>Club Rating: ${offer.rating}</span>
            <span>Offer: ${money(offer.offer)}</span>
            <button
                class="primary transfer-select"
                data-club="${offer.club}">
                NEGOTIATE
            </button>
        `;

        container.appendChild(div);
    });

    container
        .querySelectorAll(".transfer-select")
        .forEach(button => {

            button.addEventListener("click", () => {

                const offer =
                    offers.find(
                        item => item.club === button.dataset.club
                    );

                openNegotiation(offer);
            });
        });
}


function generateTransferOffers() {

    const value = calculateTransferValue();

    const clubs = [
        {
            club: "Northstar United",
            rating: 91
        },
        {
            club: "Ravenholm FC",
            rating: 84
        },
        {
            club: "Silvergate Athletic",
            rating: 87
        },
        {
            club: "Westhaven FC",
            rating: 79
        }
    ];

    return clubs
        .filter(item => item.club !== player.club)
        .map(item => {

            return {
                ...item,

                offer: Math.floor(
                    value * random(70, 115) / 100
                )
            };
        });
}


function openNegotiation(offer) {

    if (!offer) return;

    currentTransfer = offer;

    setText(
        "negotiationClub",
        offer.club
    );

    setText(
        "negotiationOffer",
        money(offer.offer)
    );

    setText(
        "negotiationCurrentValue",
        money(calculateTransferValue())
    );

    $("transferCounter").value =
        calculateTransferValue();

    setText(
        "negotiationMessage",
        "The club is waiting for your response."
    );

    showScreen("negotiationScreen");
}


$("counterOfferButton")?.addEventListener(
    "click",
    sendCounterOffer
);

function sendCounterOffer() {

    if (!currentTransfer) return;

    const counter =
        Number($("transferCounter").value);

    if (!counter || counter <= 0) {

        toast("Enter a valid transfer fee.");
        return;
    }

    const original =
        currentTransfer.offer;

    if (counter > original * 1.8) {

        setText(
            "negotiationMessage",
            "The club considers your demand far too high."
        );

        toast("Negotiation is close to collapsing.");

        return;
    }

    if (counter <= original * 1.2) {

        setText(
            "negotiationMessage",
            `${currentTransfer.club} is considering your counter offer of ${money(counter)}.`
        );

        setTimeout(() => {

            acceptTransfer(counter);

        }, 700);

    } else {

        setText(
            "negotiationMessage",
            `${currentTransfer.club} rejected the counter and has lowered the offer.`
        );

        currentTransfer.offer =
            Math.floor(original * 0.92);

        setText(
            "negotiationOffer",
            money(currentTransfer.offer)
        );
    }
}


$("acceptTransferButton")?.addEventListener(
    "click",
    () => {

        if (!currentTransfer) return;

        acceptTransfer(currentTransfer.offer);
    }
);


function acceptTransfer(fee) {

    if (!currentTransfer) return;

    const oldClub = player.club;

    player.club =
        currentTransfer.club;

    player.clubStatus =
        player.rating >= 85
            ? "World-Class Player"
            : player.rating >= 80
                ? "Star Player"
                : "First Team Player";

    player.money += Math.floor(fee * 0.05);

    player.careerEarnings +=
        Math.floor(fee * 0.05);

    if (player.contract) {
        player.contract.value = calculateTransferValue();
    }

    addLog(
        `<strong>TRANSFER COMPLETE.</strong> ${player.name} has joined ${currentTransfer.club} from ${oldClub} for ${money(fee)}.`
    );

    playCutscene(
        "TRANSFER MARKET",
        "TRANSFER COMPLETE",
        `${player.name} has completed the move to ${currentTransfer.club}. The next chapter begins now.`,
        () => {
            currentTransfer = null;
            showScreen("careerScreen");
            saveGame();
        }
    );
}


$("rejectTransferButton")?.addEventListener(
    "click",
    () => {

        if (!currentTransfer) return;

        addLog(
            `<strong>TRANSFER REJECTED.</strong> ${player.name} decided to remain at ${player.club}.`
        );

        currentTransfer = null;

        showScreen("careerScreen");
        saveGame();
    }
);


/* =========================================================
   AWARDS
========================================================= */

$("careerAwardsButton")?.addEventListener(
    "click",
    () => {

        checkAwards();
        showScreen("awardsScreen");
    }
);

$("awardsBackButton")?.addEventListener(
    "click",
    () => showScreen("careerScreen")
);


function checkAwards() {

    if (!player) return;


    /* GOLDEN BOOT */

    if (
        player.goals >= 25 &&
        !player.achievements.includes("Golden Boot")
    ) {

        player.goldenBoots++;

        player.achievements.push("Golden Boot");

        addLog(
            `<strong>GOLDEN BOOT.</strong> ${player.name} has finished as the world's top scorer.`
        );

        playCutscene(
            "WORLD FOOTBALL AWARDS",
            "GOLDEN BOOT",
            `${player.name} has finished the season as the world's top scorer.`,
            () => {}
        );
    }


    /* PLAYER OF YEAR */

    if (
        player.rating >= 82 &&
        player.goals >= 40 &&
        player.trophies >= 2 &&
        !player.achievements.includes("Player of the Year")
    ) {

        player.playerOfYear++;

        player.achievements.push("Player of the Year");

        addLog(
            `<strong>PLAYER OF THE YEAR.</strong> ${player.name} has been named Player of the Year.`
        );

        playCutscene(
            "WORLD FOOTBALL AWARDS",
            "PLAYER OF THE YEAR",
            `${player.name} has been recognised as the best player of the season.`,
            () => {}
        );
    }


    /* BALLON D'OR */

    if (
        player.rating >= 90 &&
        player.goals >= 100 &&
        player.trophies >= 5 &&
        player.reputation >= 80 &&
        !player.achievements.includes("Ballon d'Or")
    ) {

        player.ballonDor++;

        player.achievements.push("Ballon d'Or");

        addLog(
            `<strong>BALLON D'OR.</strong> ${player.name} has won football's biggest individual prize.`
        );

        playCutscene(
            "PARIS — WORLD FOOTBALL AWARDS",
            "BALLON D'OR",
            `${player.name.toUpperCase()} HAS WON THE BALLON D'OR.\n\nThe football world has witnessed history.`,
            () => {}
        );
    }
}


/* =========================================================
   RETIREMENT
========================================================= */

$("retireButton")?.addEventListener(
    "click",
    () => {

        if (!player || player.retired) return;

        if (
            !confirm(
                "Are you sure you want to retire from professional football?"
            )
        ) {
            return;
        }

        retirePlayer();
    }
);


function retirePlayer() {

    player.retired = true;

    addLog(
        `<strong>RETIREMENT.</strong> ${player.name} has ended an incredible playing career.`
    );

    setText("retireGoals", player.goals);
    setText("retireAssists", player.assists);
    setText("retireTrophies", player.trophies);
    setText("retireMoney", money(player.careerEarnings));

    setText(
        "retirementSummary",
        `${player.name} leaves football with ${player.goals} goals, ${player.assists} assists and ${player.trophies} trophies.`
    );

    saveGame();

    playCutscene(
        "THE FINAL WHISTLE",
        "THE PLAYING CAREER ENDS",
        `${player.name}'s boots are finally hung up.\n\nBut the football story isn't over.`,
        () => {
            showScreen("retirementScreen");
        }
    );
}


/* =========================================================
   LEGACY
========================================================= */

$("beginLegacyButton")?.addEventListener(
    "click",
    () => showScreen("legacyScreen")
);

$("createClubButton")?.addEventListener(
    "click",
    () => showScreen("clubCreateScreen")
);

$("legacyInvestButton")?.addEventListener(
    "click",
    legacyInvestment
);


function legacyInvestment() {

    if (!player || !player.retired) return;

    const investment =
        Math.min(
            player.money,
            10000
        );

    if (investment <= 0) {

        toast("You don't have enough money to invest.");
        return;
    }

    player.money -= investment;

    player.reputation =
        clamp(
            player.reputation + 3,
            0,
            100
        );

    addLog(
        `<strong>INVESTMENT.</strong> ${player.name} invested ${money(investment)} into football development.`
    );

    toast("Investment completed.");

    saveGame();
    updateUI();
}


/* =========================================================
   CLUB CREATION
========================================================= */

$("foundClubButton")?.addEventListener(
    "click",
    foundClub
);


function foundClub() {

    if (!player || !player.retired) return;

    const name =
        $("newClubName").value.trim();

    const city =
        $("newClubCity").value.trim();

    const motto =
        $("newClubMotto").value.trim();

    const stadium =
        $("newClubStadium").value.trim();

    if (!name || !city || !motto || !stadium) {

        toast("Complete every club field.");
        return;
    }

    if (player.money < 100000) {

        toast("You need €100,000 to found your club.");
        return;
    }

    player.money -= 100000;

    club = {

        name,
        city,
        motto,
        stadium,

        funds: 100000,

        rating: 40,
        reputation: 10,

        stadiumLevel: 1,
        youthLevel: 1,
        trainingLevel: 1,
        staffLevel: 1,

        wins: 0,
        losses: 0,
        draws: 0,

        squad: generateStartingSquad()
    };

    player.club = name;
    player.clubStatus = "Owner";

    addLog(
        `<strong>CLUB FOUNDED.</strong> ${player.name} has founded ${name} in ${city}.`
    );

    saveGame();

    playCutscene(
        name,
        "A NEW CLUB IS BORN",
        `${player.name} has gone from footballer to owner.\n\nThe next mission: build a club that can conquer the world.`,
        () => {
            updateOwnerUI();
            showScreen("ownerScreen");
        }
    );
}


function generateStartingSquad() {

    const positions = [
        "GK",
        "RB",
        "CB",
        "CB",
        "LB",
        "CDM",
        "CM",
        "CAM",
        "RW",
        "LW",
        "ST"
    ];

    return positions.map((position, index) => {

        return {

            id: Date.now() + index,

            name:
                choose([
                    "Alex Mercer",
                    "Daniel Cruz",
                    "Marco Silva",
                    "Leo Varga",
                    "Noah Bennett",
                    "Kenji Ito",
                    "Yadhu Raman",
                    "Rafael Costa",
                    "Matteo Ricci",
                    "Min-Jun Park",
                    "Lucas Moreau"
                ]) + " " + random(1, 99),

            position,

            age: random(18, 27),

            rating:
                random(48, 62),

            potential:
                random(60, 78),

            salary:
                random(500, 1500)
        };
    });
}


/* =========================================================
   OWNER UI
========================================================= */

function updateOwnerUI() {

    if (!club) return;

    setText("ownerClubName", club.name);
    setText("ownerClubMotto", `"${club.motto}"`);

    setText("ownerFunds", money(club.funds));

    setText("ownerRating", club.rating);
    setText("ownerReputation", club.reputation);
    setText("ownerStadiumLevel", club.stadiumLevel);
    setText("ownerYouthLevel", club.youthLevel);

    renderSquad();
    renderStartingXI();

    setText(
        "stadiumUpgradeCost",
        money(25000 * club.stadiumLevel)
    );

    setText(
        "youthUpgradeCost",
        money(20000 * club.youthLevel)
    );

    setText(
        "trainingUpgradeCost",
        money(30000 * club.trainingLevel)
    );

    setText(
        "staffUpgradeCost",
        money(15000 * club.staffLevel)
    );

    renderWorldFeed();
}


/* =========================================================
   OWNER SQUAD
========================================================= */

function renderSquad() {

    const container = $("ownerSquad");

    if (!container || !club) return;

    container.innerHTML = "";

    club.squad.forEach(playerData => {

        const div = document.createElement("div");

        div.className = "squad-player";

        div.innerHTML = `
            <strong>${playerData.name}</strong>
            <span>${playerData.position}</span>
            <span>OVR ${playerData.rating}</span>
            <small>Potential ${playerData.potential}</small>
        `;

        container.appendChild(div);
    });
}


function renderStartingXI() {

    const container = $("startingXI");

    if (!container || !club) return;

    container.innerHTML = "";

    club.squad.forEach((playerData, index) => {

        const div = document.createElement("div");

        div.className = "xi-player";

        div.innerHTML = `
            <span>${index + 1}</span>
            <strong>${playerData.name}</strong>
            <small>${playerData.position} • ${playerData.rating}</small>
        `;

        container.appendChild(div);
    });
}


/* =========================================================
   CLUB UPGRADES
========================================================= */

$("upgradeStadiumButton")?.addEventListener(
    "click",
    () => upgradeClub("stadium")
);

$("upgradeYouthButton")?.addEventListener(
    "click",
    () => upgradeClub("youth")
);

$("upgradeTrainingButton")?.addEventListener(
    "click",
    () => upgradeClub("training")
);

$("hireStaffButton")?.addEventListener(
    "click",
    () => upgradeClub("staff")
);


function upgradeClub(type) {

    if (!club) return;

    const levels = {

        stadium: "stadiumLevel",
        youth: "youthLevel",
        training: "trainingLevel",
        staff: "staffLevel"
    };

    const field = levels[type];

    if (!field) return;

    const costs = {

        stadium: 25000 * club.stadiumLevel,

        youth: 20000 * club.youthLevel,

        training: 30000 * club.trainingLevel,

        staff: 15000 * club.staffLevel
    };

    const cost = costs[type];

    if (club.funds < cost) {

        toast("Your club doesn't have enough funds.");
        return;
    }

    club.funds -= cost;

    club[field]++;

    if (type === "stadium") {

        club.rating =
            clamp(club.rating + 2, 0, 99);
    }

    if (type === "youth") {

        club.reputation =
            clamp(club.reputation + 3, 0, 100);
    }

    if (type === "training") {

        club.rating =
            clamp(club.rating + 3, 0, 99);
    }

    if (type === "staff") {

        club.reputation =
            clamp(club.reputation + 2, 0, 100);
    }

    addLog(
        `<strong>CLUB DEVELOPMENT.</strong> ${field} has reached level ${club[field]}.`
    );

    updateOwnerUI();
    saveGame();

    toast("Club upgrade completed.");
}


/* =========================================================
   OWNER MATCH
========================================================= */

function ownerMatch() {

    if (!club) return;

    const opponent =
        choose(worldTeams);

    const clubStrength =
        club.rating + random(-8, 8);

    const opponentStrength =
        random(55, 90);

    if (clubStrength > opponentStrength) {

        club.wins++;

        club.funds += 5000;

        club.rating =
            clamp(club.rating + 1, 0, 99);

        club.reputation =
            clamp(club.reputation + 2, 0, 100);

        addWorldNews(
            `${club.name} defeated ${opponent} in a major fixture.`
        );

        toast(`${club.name} won the match.`);

    } else if (clubStrength === opponentStrength) {

        club.draws++;

        club.funds += 2500;

        addWorldNews(
            `${club.name} drew with ${opponent}.`
        );

        toast("The match ended in a draw.");

    } else {

        club.losses++;

        club.reputation =
            clamp(club.reputation - 1, 0, 100);

        addWorldNews(
            `${club.name} lost to ${opponent}.`
        );

        toast(`${club.name} lost the match.`);
    }

    updateOwnerUI();
    saveGame();
}


/* =========================================================
   SCOUTING
========================================================= */

$("scoutButton")?.addEventListener(
    "click",
    scoutPlayer
);

$("youthAcademyButton")?.addEventListener(
    "click",
    scoutPlayer
);

$("scoutBackButton")?.addEventListener(
    "click",
    () => showScreen("ownerScreen")
);


function scoutPlayer() {

    if (!club) return;

    const playerAge =
        random(15, 20);

    const rating =
        random(
            35 + club.youthLevel * 3,
            50 + club.youthLevel * 4
        );

    const potential =
        random(
            60 + club.youthLevel * 3,
            78 + club.youthLevel * 3
        );

    const positions = [
        "ST",
        "LW",
        "RW",
        "CAM",
        "CM",
        "CDM",
        "CB",
        "LB",
        "RB",
        "GK"
    ];

    const prospect = {

        name:
            choose([
                "Ethan Cole",
                "Arjun Dev",
                "Mateo Santos",
                "Kai Nakamura",
                "Adam Brooks",
                "Rayan Costa",
                "Luca Moretti",
                "Samir Khan"
            ]),

        age: playerAge,

        position: choose(positions),

        rating,

        potential,

        fee: random(5000, 25000)
    };

    const container = $("scoutResults");

    if (!container) return;

    container.innerHTML = `
        <div class="scout-card">

            <span class="eyebrow">SCOUT REPORT</span>

            <h3>${prospect.name}</h3>

            <p>
                Age ${prospect.age}
                • ${prospect.position}
            </p>

            <div class="scout-stats">
                <strong>OVR ${prospect.rating}</strong>
                <strong>POT ${prospect.potential}</strong>
            </div>

            <p>
                Recruitment fee:
                ${money(prospect.fee)}
            </p>

            <button
                id="signProspectButton"
                class="primary"
                type="button">
                SIGN PLAYER
            </button>

        </div>
    `;

    showScreen("scoutScreen");

    $("signProspectButton").addEventListener(
        "click",
        () => {

            if (club.funds < prospect.fee) {

                toast("Not enough club funds.");
                return;
            }

            club.funds -= prospect.fee;

            club.squad.push({
                id: Date.now(),
                name: prospect.name,
                age: prospect.age,
                position: prospect.position,
                rating: prospect.rating,
                potential: prospect.potential,
                salary: 500
            });

            addLog(
                `<strong>SCOUTING SUCCESS.</strong> ${prospect.name} has joined ${club.name}.`
            );

            updateOwnerUI();
            saveGame();

            showScreen("ownerScreen");
        }
    );
}


/* =========================================================
   OWNER FINANCES
========================================================= */

$("ownerFinanceButton")?.addEventListener(
    "click",
    openFinances
);

$("financeBackButton")?.addEventListener(
    "click",
    () => showScreen("ownerScreen")
);


function openFinances() {

    if (!club) return;

    const revenue =
        club.stadiumLevel * 4000;

    const wages =
        club.squad.reduce(
            (total, playerData) =>
                total + playerData.salary,
            0
        );

    const balance =
        revenue - wages;

    setText(
        "financeFunds",
        money(club.funds)
    );

    setText(
        "financeRevenue",
        money(revenue)
    );

    setText(
        "financeWages",
        money(wages)
    );

    setText(
        "financeBalance",
        money(balance)
    );

    const log = $("financeLog");

    if (log) {

        log.innerHTML = `
            <div class="log-entry">
                <strong>WEEKLY FINANCIAL REPORT</strong>
                <p>
                    Stadium revenue:
                    ${money(revenue)}
                </p>
                <p>
                    Player wages:
                    ${money(wages)}
                </p>
                <p>
                    Net:
                    ${money(balance)}
                </p>
            </div>
        `;
    }

    showScreen("financeScreen");
}


/* =========================================================
   OWNER TRANSFERS
========================================================= */

$("ownerTransfersButton")?.addEventListener(
    "click",
    () => {

        toast(
            "The owner transfer market is coming into the next club-management layer."
        );
    }
);


/* =========================================================
   LOGO / MENU
========================================================= */

$("logoButton")?.addEventListener(
    "click",
    () => showScreen("menuScreen")
);


/* =========================================================
   SAVE
========================================================= */

function saveGame() {

    try {

        localStorage.setItem(
            SAVE_KEY,
            JSON.stringify({
                player,
                club
            })
        );

    } catch (error) {

        console.error(
            "Could not save game:",
            error
        );
    }
}


$("saveGameButton")?.addEventListener(
    "click",
    () => {

        saveGame();

        toast("Game saved.");
    }
);


/* =========================================================
   RESET
========================================================= */

$("resetGameButton")?.addEventListener(
    "click",
    () => {

        const confirmed =
            confirm(
                "Delete your entire PROJECT XI football life?"
            );

        if (!confirmed) return;

        localStorage.removeItem(SAVE_KEY);

        player = null;
        club = null;

        location.reload();
    }
);


/* =========================================================
   LOAD
========================================================= */

function loadGame() {

    const saved =
        localStorage.getItem(SAVE_KEY);

    if (!saved) return;

    try {

        const data =
            JSON.parse(saved);

        player =
            data.player || null;

        club =
            data.club || null;

        if (!player) return;

        if (!player.worldNews) {
            player.worldNews = [];
        }

        if (!player.calendar) {
            generateCalendar();
        }

        updateUI();

    } catch (error) {

        console.error(
            "Save data corrupted:",
            error
        );

        localStorage.removeItem(SAVE_KEY);

        player = null;
        club = null;
    }
}


/* =========================================================
   MENU WORLD NEWS
========================================================= */

function createInitialWorldNews() {

    if (!player) return;

    if (!player.worldNews.length) {

        addWorldNews(
            "Northstar United opened the season with a dramatic victory."
        );

        addWorldNews(
            "Ravenholm FC are searching for a new manager."
        );

        addWorldNews(
            "Silvergate Athletic have entered the transfer market."
        );
    }
}


/* =========================================================
   INITIALIZE
========================================================= */

loadGame();

if (player) {

    createInitialWorldNews();

    updateUI();

} else {

    showScreen("menuScreen");
}


/* =========================================================
   KEYBOARD SHORTCUTS
========================================================= */

document.addEventListener("keydown", event => {

    if (event.key === "Escape") {

        const overlay =
            $("cutsceneOverlay");

        if (
            overlay &&
            !overlay.classList.contains("hidden")
        ) {
            closeCutscene();
        }
    }
});


/* =========================================================
   AUTO WORLD NEWS
========================================================= */

setInterval(() => {

    if (!player) return;

    if (
        document.hidden
    ) return;

    weeklyWorldUpdate();

    renderWorldFeed();

    saveGame();

}, 60000);
