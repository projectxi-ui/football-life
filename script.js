"use strict";

/* =========================================================
   PROJECT XI: FOOTBALL LIFE
   Version 10
   Matches the exact HTML IDs from your current index.html
========================================================= */

const SAVE_KEY = "projectXI_football_life_v10";

const $ = (id) => document.getElementById(id);

const screens = Array.from(document.querySelectorAll(".screen"));

let player = null;
let club = null;
let currentOffer = null;
let currentCutsceneCallback = null;


/* =========================================================
   UTILITIES
========================================================= */

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function money(value) {
    return "€" + Math.floor(Number(value) || 0).toLocaleString();
}

function positionName(position) {
    const names = {
        GK: "Goalkeeper",
        CB: "Centre Back",
        LB: "Left Back",
        RB: "Right Back",
        CDM: "Defensive Midfielder",
        CM: "Central Midfielder",
        CAM: "Attacking Midfielder",
        LW: "Left Wing",
        RW: "Right Wing",
        ST: "Striker"
    };

    return names[position] || position;
}

function showToast(message) {
    const toast = $("toast");

    if (!toast) {
        console.log(message);
        return;
    }

    toast.textContent = message;
    toast.classList.remove("hidden");

    clearTimeout(showToast.timer);

    showToast.timer = setTimeout(() => {
        toast.classList.add("hidden");
    }, 2800);
}

function showScreen(screenId) {
    screens.forEach((screen) => {
        screen.classList.remove("active");
    });

    const target = $(screenId);

    if (target) {
        target.classList.add("active");
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }
}

function addLog(text) {
    const log = $("careerLog");

    if (!log) return;

    const entry = document.createElement("div");
    entry.className = "log-entry";
    entry.innerHTML = text;

    log.prepend(entry);
}

function addOwnerLog(text) {
    const log = $("financeLog");

    if (!log) return;

    const entry = document.createElement("div");
    entry.className = "log-entry";
    entry.innerHTML = text;

    log.prepend(entry);
}

function addWorldFeed(text) {
    const feed = $("worldFeed");

    if (!feed) return;

    const item = document.createElement("div");
    item.className = "feed-item";
    item.textContent = text;

    feed.prepend(item);

    while (feed.children.length > 8) {
        feed.removeChild(feed.lastChild);
    }
}

function randomName() {
    const first = [
        "Kai",
        "Luca",
        "Mateo",
        "Noah",
        "Leo",
        "Rafael",
        "Kenji",
        "Arjun",
        "Elias",
        "Min",
        "Daniel",
        "Adam",
        "Nico",
        "Yuki",
        "Alex"
    ];

    const last = [
        "Varga",
        "Sato",
        "Müller",
        "Costa",
        "Park",
        "Rossi",
        "Silva",
        "Moreau",
        "Williams",
        "Ricci",
        "Fernandez",
        "Khan",
        "Santos",
        "Tanaka",
        "Bennett"
    ];

    return `${first[random(0, first.length - 1)]} ${
        last[random(0, last.length - 1)]
    }`;
}


/* =========================================================
   TEAMS
========================================================= */

const TEAMS = [
    {
        name: "PROJECT XI FC",
        rating: 99,
        country: "Global"
    },
    {
        name: "Northstar United",
        rating: 91,
        country: "England"
    },
    {
        name: "Royal Santoro",
        rating: 87,
        country: "Spain"
    },
    {
        name: "Ravenholm FC",
        rating: 83,
        country: "Germany"
    },
    {
        name: "Eastport City",
        rating: 78,
        country: "England"
    },
    {
        name: "Silvergate Athletic",
        rating: 73,
        country: "France"
    },
    {
        name: "Westhaven FC",
        rating: 69,
        country: "Netherlands"
    },
    {
        name: "Club de Aderis",
        rating: 66,
        country: "Portugal"
    }
];

const ACADEMIES = [
    {
        name: "PROJECT XI Academy",
        rating: 72,
        country: "Global",
        description: "The elite development system."
    },
    {
        name: "Northstar Youth",
        rating: 68,
        country: "England",
        description: "Strong technical development."
    },
    {
        name: "Royal Santoro Academy",
        rating: 65,
        country: "Spain",
        description: "Technical and creative football."
    },
    {
        name: "Ravenholm Academy",
        rating: 63,
        country: "Germany",
        description: "Physical and tactical development."
    },
    {
        name: "Eastport Academy",
        rating: 60,
        country: "England",
        description: "Balanced youth football."
    },
    {
        name: "Silvergate Academy",
        rating: 57,
        country: "France",
        description: "Creative attacking development."
    },
    {
        name: "Westhaven Academy",
        rating: 54,
        country: "Netherlands",
        description: "Possession-focused football."
    }
];

const OPPONENTS = [
    "Club de Aderis",
    "Westhaven FC",
    "Silvergate Athletic",
    "Eastport City",
    "Ravenholm FC",
    "Royal Santoro",
    "Northstar United"
];

const WORLD_TEAMS = [
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


/* =========================================================
   CUTSCENES
========================================================= */

function showCutscene(location, title, text, callback) {
    const overlay = $("cutsceneOverlay");

    if (!overlay) {
        if (callback) callback();
        return;
    }

    $("cutsceneLocation").textContent = location || "";
    $("cutsceneTitle").textContent = title || "";
    $("cutsceneText").textContent = text || "";

    currentCutsceneCallback = callback || null;

    overlay.classList.remove("hidden");
}

function closeCutscene() {
    const overlay = $("cutsceneOverlay");

    if (overlay) {
        overlay.classList.add("hidden");
    }

    const callback = currentCutsceneCallback;
    currentCutsceneCallback = null;

    if (callback) {
        callback();
    }
}


/* =========================================================
   PLAYER CREATION
========================================================= */

function createPlayer() {
    const name = $("playerName")?.value.trim();
    const country = $("playerCountry")?.value.trim();
    const position = $("playerPosition")?.value;
    const foot = $("playerFoot")?.value;

    if (!name || !country) {
        showToast("Enter your player name and country.");

        return;
    }

    const startingRating = random(57, 61);
    const potential = clamp(
        startingRating + random(15, 25),
        72,
        86
    );

    player = {
        name,
        country,
        position,
        foot,

        age: 16,

        season: 1,
        week: 1,
        dayIndex: 0,

        rating: startingRating,
        potential,

        fitness: 100,
        form: 70,
        happiness: 80,
        reputation: 5,

        money: 2000,
        careerEarnings: 0,

        club: "PROJECT XI Academy",
        clubStatus: "Academy Player",

        goals: 0,
        assists: 0,
        appearances: 0,

        seasonGoals: 0,
        seasonAssists: 0,
        seasonAppearances: 0,

        trophies: 0,
        leagueTitles: 0,
        cupTitles: 0,

        goldenBoots: 0,
        playerOfYear: 0,
        ballonDor: 0,

        salary: 0,
        contractYears: 0,

        injured: false,
        injuryWeeks: 0,

        nationalTeam: false,
        nationalCaps: 0,
        nationalGoals: 0,

        retired: false,

        currentOpponent: null,
        matchScheduled: false,

        seasonWins: 0,
        seasonDraws: 0,
        seasonLosses: 0,
        seasonPoints: 0,

        achievements: [],

        transferInterest: [],

        firstProGoal: false,
        firstProContract: false,

        transferWindow: false
    };

    $("createScreen")?.querySelectorAll(".error").forEach((el) => {
        el.textContent = "";
    });

    showScreen("clubSelectScreen");

    renderAcademies();

    saveGame();
}


/* =========================================================
   PLAYER PREVIEW
========================================================= */

function updatePlayerPreview() {
    const name = $("playerName")?.value.trim() || "YOUR NAME";
    const position = $("playerPosition")?.value || "ST";

    if ($("previewName")) {
        $("previewName").textContent = name.toUpperCase();
    }

    if ($("previewPosition")) {
        $("previewPosition").textContent =
            positionName(position).toUpperCase();
    }
}


/* =========================================================
   ACADEMY SELECTION
========================================================= */

function renderAcademies() {
    const list = $("academyList");

    if (!list) return;

    list.innerHTML = "";

    ACADEMIES.forEach((academy) => {
        const button = document.createElement("button");

        button.type = "button";
        button.className = "academy-option";

        button.innerHTML = `
            <strong>${academy.name}</strong>
            <span>${academy.country} · Level ${academy.rating}</span>
            <small>${academy.description}</small>
        `;

        button.addEventListener("click", () => {
            selectAcademy(academy);
        });

        list.appendChild(button);
    });
}

function selectAcademy(academy) {
    if (!player) return;

    player.club = academy.name;
    player.clubStatus = "Academy Player";

    addLog(
        `<strong>ACADEMY SELECTED.</strong><br>
        ${player.name} joins ${academy.name}.`
    );

    scheduleNextMatch();

    updateCareerUI();
    saveGame();

    showScreen("careerScreen");

    showCutscene(
        academy.name.toUpperCase(),
        "WELCOME TO THE ACADEMY",
        `${player.name}, your development starts here. Every session, every match and every decision will shape your career.`,
        () => {
            showToast("Your football journey has begun.");
        }
    );
}


/* =========================================================
   CAREER UI
========================================================= */

function updateCareerUI() {
    if (!player) return;

    if ($("careerPlayerName"))
        $("careerPlayerName").textContent = player.name;

    if ($("careerClub"))
        $("careerClub").textContent = player.club;

    if ($("careerRating"))
        $("careerRating").textContent = player.rating;

    if ($("careerAge"))
        $("careerAge").textContent = player.age;

    if ($("careerFitness"))
        $("careerFitness").textContent = player.fitness;

    if ($("careerForm"))
        $("careerForm").textContent = player.form;

    if ($("careerGoals"))
        $("careerGoals").textContent = player.goals;

    if ($("careerAssists"))
        $("careerAssists").textContent = player.assists;

    if ($("careerReputation"))
        $("careerReputation").textContent = player.reputation;

    if ($("careerChapter"))
        $("careerChapter").textContent =
            player.retired
                ? "LEGACY"
                : `SEASON ${player.season}`;

    if ($("profileRating"))
        $("profileRating").textContent = player.rating;

    if ($("profileName"))
        $("profileName").textContent = player.name;

    if ($("profilePosition"))
        $("profilePosition").textContent =
            positionName(player.position);

    if ($("profileClub"))
        $("profileClub").textContent = player.club;

    if ($("potentialValue"))
        $("potentialValue").textContent =
            player.potential;

    if ($("potentialFill")) {
        const percent =
            clamp(
                (player.rating / player.potential) * 100,
                0,
                100
            );

        $("potentialFill").style.width =
            `${percent}%`;
    }

    if ($("calendarDate")) {
        $("calendarDate").textContent =
            `Season ${player.season} · Week ${player.week}`;
    }

    updateCalendar();
    updateWorldFeed();
}

function updateTopBar() {
    if (!player) return;

    if ($("topAge"))
        $("topAge").innerHTML =
            `AGE <strong>${player.age}</strong>`;

    if ($("topRating"))
        $("topRating").innerHTML =
            `OVR <strong>${player.rating}</strong>`;

    if ($("topMoney"))
        $("topMoney").textContent =
            money(player.money);
}

function updateWorldFeed() {
    const feed = $("worldFeed");

    if (!feed) return;

    if (!feed.children.length) {
        addWorldFeed(
            "PROJECT XI WORLD — A new football season begins."
        );

        addWorldFeed(
            "Scouts across Europe are searching for the next generation."
        );
    }
}

function updateCalendar() {
    const list = $("calendarList");

    if (!list || !player) return;

    list.innerHTML = "";

    const days = [
        ["MON", "TRAINING"],
        ["TUE", "TRAINING"],
        ["WED", "RECOVERY"],
        ["THU", "TRAINING"],
        ["FRI", "REST"],
        ["SAT", "MATCHDAY"],
        ["SUN", "RECOVERY"]
    ];

    days.forEach((item, index) => {
        const row = document.createElement("div");

        row.className = "calendar-row";

        if (index === player.dayIndex % 7) {
            row.classList.add("current");
        }

        let activity = item[1];

        if (index === 5 && player.matchScheduled) {
            activity =
                `MATCH vs ${player.currentOpponent}`;
        }

        row.innerHTML = `
            <span>${item[0]}</span>
            <strong>${activity}</strong>
        `;

        list.appendChild(row);
    });

    if ($("calendarStatus")) {
        const day = player.dayIndex % 7;

        if (day === 5 && player.matchScheduled) {
            $("calendarStatus").textContent =
                `MATCHDAY — vs ${player.currentOpponent}`;
        } else {
            $("calendarStatus").textContent =
                days[day][1];
        }
    }
}


/* =========================================================
   MATCH SCHEDULING
========================================================= */

function scheduleNextMatch() {
    if (!player || player.retired) return;

    let opponent =
        OPPONENTS[random(0, OPPONENTS.length - 1)];

    if (opponent === player.club) {
        opponent = "Eastport City";
    }

    player.currentOpponent = opponent;
    player.matchScheduled = true;

    updateCalendar();
}


/* =========================================================
   TRAINING
========================================================= */

function trainPlayer() {
    if (!player || player.retired) return;

    if (player.injured) {
        showToast(
            `You are injured for ${player.injuryWeeks} more week(s).`
        );

        return;
    }

    const fitnessGain = random(3, 8);

    player.fitness =
        clamp(player.fitness + fitnessGain, 0, 100);

    player.form =
        clamp(player.form + random(2, 5), 0, 100);

    player.happiness =
        clamp(player.happiness + 1, 0, 100);

    let development = false;

    if (
        player.rating < player.potential &&
        player.age <= 27
    ) {
        const chance =
            player.age <= 21 ? 38 :
            player.age <= 24 ? 28 :
            18;

        if (random(1, 100) <= chance) {
            player.rating++;
            development = true;
        }
    }

    if (development) {
        addLog(
            `<strong>TRAINING BREAKTHROUGH.</strong><br>
            Rating increased to ${player.rating}. Fitness +${fitnessGain}.`
        );

        showToast(
            `BREAKTHROUGH — OVR ${player.rating}`
        );
    } else {
        addLog(
            `<strong>TRAINING SESSION.</strong><br>
            Fitness +${fitnessGain}. Form improved.`
        );

        showToast(
            `Training complete · Fitness +${fitnessGain}`
        );
    }

    updateCareerUI();
    updateTopBar();
    saveGame();
}


/* =========================================================
   REST
========================================================= */

function restPlayer() {
    if (!player || player.retired) return;

    const recovery = random(10, 18);

    player.fitness =
        clamp(player.fitness + recovery, 0, 100);

    player.happiness =
        clamp(player.happiness + random(2, 6), 0, 100);

    player.form =
        clamp(player.form + random(1, 3), 0, 100);

    if (player.injured) {
        player.injuryWeeks--;

        addLog(
            `<strong>RECOVERY.</strong><br>
            Medical recovery continues. ${Math.max(
                0,
                player.injuryWeeks
            )} week(s) remaining.`
        );

        if (player.injuryWeeks <= 0) {
            player.injured = false;
            player.injuryWeeks = 0;

            showToast("MEDICAL CLEARANCE — You are fit to play.");

            addLog(
                `<strong>MEDICAL CLEARANCE.</strong><br>
                You are cleared to return.`
            );
        }
    } else {
        addLog(
            `<strong>REST DAY.</strong><br>
            Fitness +${recovery}.`
        );

        showToast(`Recovery complete · Fitness +${recovery}`);
    }

    updateCareerUI();
    updateTopBar();
    saveGame();
}


/* =========================================================
   MATCH SCREEN
========================================================= */

function startMatch() {
    if (!player || player.retired) return;

    if (player.injured) {
        showToast("You cannot play while injured.");
        return;
    }

    if (!player.matchScheduled) {
        showToast("No match is currently scheduled.");
        return;
    }

    if (player.fitness < 35) {
        showToast("Your fitness is too low to play.");
        return;
    }

    const opponent = player.currentOpponent;

    const opponentData =
        TEAMS.find(
            (team) => team.name === opponent
        );

    const opponentRating =
        opponentData
            ? opponentData.rating
            : random(60, 85);

    player.match = {
        opponent,
        opponentRating,

        minute: 0,

        homeScore: 0,
        awayScore: 0,

        playerGoals: 0,
        playerAssists: 0,

        actions: 0,

        performance:
            clamp(
                player.rating +
                Math.floor((player.form - 50) / 5) +
                Math.floor((player.fitness - 50) / 10),
                40,
                100
            )
    };

    $("matchCompetition").textContent =
        player.clubStatus === "Academy Player"
            ? "ACADEMY LEAGUE"
            : "LEAGUE MATCH";

    $("homeTeam").textContent =
        player.club;

    $("awayTeam").textContent =
        opponent;

    $("homeScore").textContent = "0";
    $("awayScore").textContent = "0";
    $("matchMinute").textContent = "0'";

    if ($("matchCommentary")) {
        $("matchCommentary").textContent =
            `Kick-off. ${player.club} vs ${opponent}.`;
    }

    showScreen("matchScreen");
}

function matchAction(action) {
    if (!player || !player.match) return;

    const match = player.match;

    if (match.minute >= 90) {
        finishMatch();
        return;
    }

    let minutes;

    if (action === "attack") {
        minutes = random(8, 13);
    } else if (action === "pass") {
        minutes = random(6, 11);
    } else {
        minutes = random(7, 12);
    }

    match.minute =
        Math.min(90, match.minute + minutes);

    match.actions++;

    const attackPower =
        player.rating +
        Math.floor(player.form / 8) +
        Math.floor(player.fitness / 15) +
        random(-15, 15);

    const defencePower =
        match.opponentRating +
        random(-12, 12);

    let commentary = "";

    if (action === "attack") {
        if (attackPower >= defencePower + 5) {
            if (random(1, 100) <= 28) {
                match.homeScore++;

                match.playerGoals++;

                commentary =
                    `${match.minute}' GOAL! ${player.name} finds the net!`;
            } else {
                commentary =
                    `${match.minute}' ${player.name} attacks the defence but the chance is missed.`;
            }
        } else {
            commentary =
                `${match.minute}' The defence holds firm.`;
        }
    }

    if (action === "pass") {
        if (
            attackPower >= defencePower - 5 &&
            random(1, 100) <= 35
        ) {
            match.homeScore++;

            match.playerAssists++;

            commentary =
                `${match.minute}' Brilliant chance created by ${player.name}!`;
        } else {
            commentary =
                `${match.minute}' ${player.name} keeps possession and looks for an opening.`;
        }
    }

    if (action === "defend") {
        if (defencePower > attackPower) {
            commentary =
                `${match.minute}' Strong defensive work. The opposition attack is stopped.`;
        } else {
            commentary =
                `${match.minute}' The team survives the pressure.`;
        }
    }

    if (
        random(1, 100) <=
        clamp(
            18 +
            Math.floor(
                (defencePower - attackPower) / 4
            ),
            5,
            35
        )
    ) {
        match.awayScore++;

        commentary +=
            ` ${match.minute}' The opposition scores.`;
    }

    $("homeScore").textContent =
        match.homeScore;

    $("awayScore").textContent =
        match.awayScore;

    $("matchMinute").textContent =
        `${match.minute}'`;

    if ($("matchCommentary")) {
        $("matchCommentary").textContent =
            commentary;
    }

    if (match.minute >= 90) {
        setTimeout(finishMatch, 500);
    }
}

function finishMatch() {
    if (!player || !player.match) return;

    const match = player.match;

    const goals = match.playerGoals;
    const assists = match.playerAssists;

    player.goals += goals;
    player.assists += assists;

    player.seasonGoals += goals;
    player.seasonAssists += assists;

    player.appearances++;
    player.seasonAppearances++;

    player.fitness =
        clamp(
            player.fitness - random(8, 12),
            0,
            100
        );

    const result =
        match.homeScore > match.awayScore
            ? "WIN"
            : match.homeScore < match.awayScore
                ? "LOSS"
                : "DRAW";

    if (result === "WIN") {
        player.seasonWins++;
        player.seasonPoints += 3;
        player.happiness =
            clamp(player.happiness + 4, 0, 100);
        player.reputation =
            clamp(player.reputation + 1, 0, 100);
    }

    if (result === "DRAW") {
        player.seasonDraws++;
        player.seasonPoints++;
    }

    if (result === "LOSS") {
        player.seasonLosses++;
        player.form =
            clamp(player.form - 3, 0, 100);
    }

    const matchRating =
        clamp(
            5.5 +
            (match.performance - 50) / 20 +
            goals * 0.8 +
            assists * 0.4 +
            random(-5, 5) / 10,
            5.0,
            9.8
        );

    let pay =
        player.salary > 0
            ? Math.floor(player.salary / 52)
            : random(100, 300);

    if (player.clubStatus === "Academy Player") {
        pay = random(50, 150);
    }

    player.money += pay;
    player.careerEarnings += pay;

    player.form =
        clamp(
            player.form +
            (result === "WIN" ? 5 : result === "DRAW" ? 2 : -2) +
            goals * 2,
            0,
            100
        );

    addLog(
        `<strong>FULL TIME — ${result}</strong><br>
        ${player.club} ${match.homeScore}–${match.awayScore} ${match.opponent}<br>
        ${goals} goal(s) · ${assists} assist(s) · Rating ${matchRating.toFixed(1)}<br>
        Match earnings: ${money(pay)}`
    );

    player.matchScheduled = false;
    player.currentOpponent = null;
    player.match = null;

    showScreen("careerScreen");

    updateCareerUI();
    updateTopBar();

    checkCareerMilestones();

    if (
        player.seasonAppearances >= 52
    ) {
        endSeason();
    } else {
        scheduleNextMatch();
    }

    saveGame();
}


/* =========================================================
   CAREER MILESTONES
========================================================= */

function checkCareerMilestones() {
    if (!player) return;

    if (
        player.goals >= 1 &&
        !player.firstProGoal &&
        player.clubStatus !== "Academy Player"
    ) {
        player.firstProGoal = true;

        if (!player.achievements.includes("First Professional Goal")) {
            player.achievements.push(
                "First Professional Goal"
            );
        }

        showCutscene(
            "MATCHDAY",
            "FIRST PROFESSIONAL GOAL",
            `${player.name} has scored the first professional goal of the career.`,
            () => {
                updateCareerUI();
                saveGame();
            }
        );
    }

    const milestones = [
        {
            value: 10,
            text: "10 Career Goals"
        },
        {
            value: 25,
            text: "25 Career Goals"
        },
        {
            value: 50,
            text: "50 Career Goals"
        },
        {
            value: 100,
            text: "100 Career Goals"
        }
    ];

    milestones.forEach((milestone) => {
        if (
            player.goals >= milestone.value &&
            !player.achievements.includes(milestone.text)
        ) {
            player.achievements.push(milestone.text);

            showCutscene(
                "CAREER MILESTONE",
                `${milestone.value} GOALS`,
                `${player.name} has reached ${milestone.value} career goals.`,
                () => updateCareerUI()
            );
        }
    });
}


/* =========================================================
   PROFESSIONAL CONTRACT
========================================================= */

function offerProfessionalContract() {
    if (!player) return;

    if (
        player.clubStatus !== "Academy Player" ||
        player.rating < 64
    ) {
        return;
    }

    const salary =
        2500 +
        player.rating * 120;

    const value =
        Math.floor(
            player.rating *
            player.rating *
            700
        );

    $("contractClubName").textContent =
        "PROJECT XI FC";

    $("contractSalary").textContent =
        money(salary) + " / season";

    $("contractYears").textContent =
        "3 years";

    $("contractValue").textContent =
        money(value);

    player.pendingContract = {
        club: "PROJECT XI FC",
        salary,
        years: 3,
        value
    };

    showScreen("contractScreen");
}

function signProfessionalContract() {
    if (!player || !player.pendingContract) return;

    const contract = player.pendingContract;

    player.club = contract.club;
    player.clubStatus = "Professional Player";

    player.salary = contract.salary;
    player.contractYears = contract.years;

    player.money += 5000;

    player.firstProContract = true;

    if (!player.achievements.includes("First Professional Contract")) {
        player.achievements.push(
            "First Professional Contract"
        );
    }

    player.pendingContract = null;

    addLog(
        `<strong>FIRST PROFESSIONAL CONTRACT.</strong><br>
        ${player.name} signs for ${player.club}.<br>
        Salary: ${money(player.salary)} per season.`
    );

    showScreen("careerScreen");

    showCutscene(
        "PROJECT XI FC",
        "THE FIRST CONTRACT",
        `${player.name} is officially a professional footballer.`,
        () => {
            updateCareerUI();
            updateTopBar();
            saveGame();
        }
    );
}


/* =========================================================
   CAREER PROGRESSION
========================================================= */

function checkCareerProgression() {
    if (!player || player.retired) return;

    if (
        player.clubStatus === "Academy Player" &&
        player.age >= 17 &&
        player.rating >= 64
    ) {
        offerProfessionalContract();
        return;
    }

    if (
        player.clubStatus === "Professional Player" &&
        player.age >= 20 &&
        player.rating >= 72
    ) {
        player.clubStatus = "First Team Player";

        player.salary =
            Math.max(
                player.salary,
                9000
            );

        player.contractYears = 4;

        addLog(
            `<strong>FIRST TEAM BREAKTHROUGH.</strong><br>
            ${player.name} becomes a regular first-team player.`
        );

        showCutscene(
            player.club,
            "FIRST TEAM",
            `${player.name} has earned a permanent place in the first team.`,
            () => updateCareerUI()
        );

        return;
    }

    if (
        player.clubStatus === "First Team Player" &&
        player.age >= 24 &&
        player.rating >= 80
    ) {
        player.clubStatus = "Star Player";

        player.salary =
            Math.max(
                player.salary,
                30000
            );

        addLog(
            `<strong>STAR PLAYER.</strong><br>
            ${player.name} has become one of the club's most important players.`
        );

        showCutscene(
            player.club,
            "STAR PLAYER",
            `${player.name} has become a star of the football world.`,
            () => updateCareerUI()
        );

        return;
    }

    if (
        player.clubStatus === "Star Player" &&
        player.age >= 27 &&
        player.rating >= 86 &&
        player.reputation >= 60
    ) {
        player.clubStatus = "World-Class Player";

        player.salary =
            Math.max(
                player.salary,
                75000
            );

        addLog(
            `<strong>WORLD CLASS.</strong><br>
            ${player.name} has reached the highest level of the game.`
        );

        showCutscene(
            "THE FOOTBALL WORLD",
            "WORLD CLASS",
            `${player.name} is now recognised among football's elite.`,
            () => updateCareerUI()
        );
    }
}


/* =========================================================
   TRANSFERS
========================================================= */

function openTransfers() {
    if (!player || player.retired) return;

    if (player.clubStatus === "Academy Player") {
        showToast("You need to become a professional first.");
        return;
    }

    generateTransferOffers();

    showScreen("transferScreen");
}

function calculatePlayerValue() {
    if (!player) return 0;

    let value =
        player.rating *
        player.rating *
        10000;

    value += player.potential * 100000;

    value += player.goals * 250000;
    value += player.assists * 150000;
    value += player.trophies * 750000;

    value += player.reputation * 100000;

    if (player.age < 23) {
        value *= 1.25;
    }

    if (player.age > 30) {
        value *= 0.65;
    }

    return Math.max(
        1000000,
        Math.floor(value)
    );
}

function generateTransferOffers() {
    const container = $("transferOffers");

    if (!container) return;

    container.innerHTML = "";

    const possible = TEAMS.filter(
        (team) =>
            team.name !== player.club &&
            team.rating >= player.rating - 12
    );

    possible.sort(
        () => Math.random() - 0.5
    );

    const selected =
        possible.slice(
            0,
            Math.min(4, possible.length)
        );

    if (!selected.length) {
        container.innerHTML =
            "<p>No clubs are currently interested.</p>";

        return;
    }

    selected.forEach((team) => {
        const baseValue =
            calculatePlayerValue();

        const offer =
            Math.floor(
                baseValue *
                random(75, 115) /
                100
            );

        const button =
            document.createElement("button");

        button.type = "button";
        button.className = "transfer-offer";

        button.innerHTML = `
            <strong>${team.name}</strong>
            <span>${team.country} · Club rating ${team.rating}</span>
            <b>${money(offer)}</b>
        `;

        button.addEventListener("click", () => {
            openNegotiation(team, offer);
        });

        container.appendChild(button);
    });
}

function openNegotiation(team, offer) {
    currentOffer = {
        team,
        offer,
        playerValue: calculatePlayerValue()
    };

    if ($("negotiationClub"))
        $("negotiationClub").textContent =
            team.name;

    if ($("negotiationOffer"))
        $("negotiationOffer").textContent =
            money(offer);

    if ($("negotiationCurrentValue"))
        $("negotiationCurrentValue").textContent =
            money(currentOffer.playerValue);

    if ($("transferCounter"))
        $("transferCounter").value =
            Math.floor(
                currentOffer.playerValue
            );

    if ($("negotiationMessage"))
        $("negotiationMessage").textContent =
            "Choose your negotiation strategy.";

    showScreen("negotiationScreen");
}

function acceptTransfer() {
    if (!player || !currentOffer) return;

    completeTransfer(
        currentOffer.team,
        currentOffer.offer
    );
}

function counterTransfer() {
    if (!player || !currentOffer) return;

    const input =
        $("transferCounter");

    const requested =
        Number(
            String(input?.value || "")
                .replace(/[^\d]/g, "")
        );

    if (!requested || requested <= 0) {
        showToast("Enter a valid transfer fee.");
        return;
    }

    const base =
        currentOffer.offer;

    const ratio =
        requested / base;

    if (ratio <= 1.15) {
        completeTransfer(
            currentOffer.team,
            requested
        );

        return;
    }

    if (ratio <= 1.45) {
        const counter =
            Math.floor(
                requested * random(82, 94) / 100
            );

        if ($("negotiationMessage")) {
            $("negotiationMessage").textContent =
                `${currentOffer.team.name} countered with ${money(counter)}.`;
        }

        const accept =
            window.confirm(
                `${currentOffer.team.name} countered with ${money(counter)}.\n\nAccept?`
            );

        if (accept) {
            completeTransfer(
                currentOffer.team,
                counter
            );
        }

        return;
    }

    if ($("negotiationMessage")) {
        $("negotiationMessage").textContent =
            `${currentOffer.team.name} walked away from the negotiation.`;
    }

    addLog(
        `<strong>TRANSFER COLLAPSED.</strong><br>
        ${currentOffer.team.name} rejected the requested fee.`
    );

    currentOffer = null;

    saveGame();
}

function rejectTransfer() {
    currentOffer = null;
    showScreen("transferScreen");
}

function completeTransfer(team, fee) {
    if (!player || !team) return;

    const oldClub = player.club;

    player.club = team.name;

    player.clubStatus =
        player.rating >= 86
            ? "Star Player"
            : "First Team Player";

    player.salary =
        Math.max(
            player.salary,
            team.rating * 500
        );

    player.contractYears = 4;

    const signingBonus =
        Math.floor(fee * 0.03);

    player.money += signingBonus;
    player.careerEarnings += signingBonus;

    player.transferInterest = [];

    addLog(
        `<strong>TRANSFER COMPLETED.</strong><br>
        ${player.name} moves from ${oldClub} to ${team.name}.<br>
        Transfer fee: ${money(fee)}.<br>
        Signing bonus: ${money(signingBonus)}.`
    );

    currentOffer = null;

    showScreen("careerScreen");

    showCutscene(
        "TRANSFER WINDOW",
        "DEAL COMPLETED",
        `${player.name} is officially a ${team.name} player.`,
        () => {
            updateCareerUI();
            updateTopBar();
            saveGame();
        }
    );
}


/* =========================================================
   NATIONAL TEAM
========================================================= */

function checkNationalTeam() {
    if (!player || player.retired) return;

    if (
        !player.nationalTeam &&
        player.rating >= 72 &&
        player.reputation >= 20
    ) {
        player.nationalTeam = true;
        player.nationalCaps = 1;

        addLog(
            `<strong>NATIONAL TEAM DEBUT.</strong><br>
            ${player.name} has been called up by ${player.country}.`
        );

        showCutscene(
            player.country,
            "NATIONAL TEAM DEBUT",
            `${player.name} has received the call to represent ${player.country}.`,
            () => updateCareerUI()
        );

        return;
    }

    if (player.nationalTeam) {
        if (random(1, 100) <= 50) {
            player.nationalCaps++;

            if (random(1, 100) <= 30) {
                player.nationalGoals++;
            }
        }
    }
}


/* =========================================================
   END SEASON
========================================================= */

function endSeason() {
    if (!player || player.retired) return;

    const seasonNumber =
        player.season;

    addLog(
        `<strong>SEASON ${seasonNumber} COMPLETE.</strong><br>
        ${player.seasonGoals} goals ·
        ${player.seasonAssists} assists ·
        ${player.seasonAppearances} appearances ·
        ${player.seasonPoints} points`
    );

    let trophyWon = false;

    /* League title */
    if (
        player.seasonPoints >= 75
    ) {
        player.trophies++;
        player.leagueTitles++;

        player.achievements.push(
            `League Champion — Season ${seasonNumber}`
        );

        trophyWon = true;

        addLog(
            `<strong>LEAGUE CHAMPIONS.</strong><br>
            ${player.name} lifts the league trophy.`
        );

        showCutscene(
            "SEASON FINALE",
            "LEAGUE CHAMPIONS",
            `${player.name} has helped the club lift the league trophy.`,
            () => updateCareerUI()
        );
    }

    /* Golden Boot */
    if (
        player.seasonGoals >= 20
    ) {
        player.goldenBoots++;
        player.trophies++;

        player.achievements.push(
            `Golden Boot — Season ${seasonNumber}`
        );

        addLog(
            `<strong>GOLDEN BOOT.</strong><br>
            ${player.name} finishes as the league's top scorer.`
        );

        showCutscene(
            "AWARDS NIGHT",
            "GOLDEN BOOT",
            `${player.name} has won the Golden Boot.`,
            () => updateCareerUI()
        );
    }

    /* Player of Year */
    if (
        player.seasonGoals >= 15 &&
        player.seasonAssists >= 8 &&
        player.seasonPoints >= 70 &&
        player.rating >= 80
    ) {
        player.playerOfYear++;
        player.trophies++;

        player.achievements.push(
            `Player of the Year — Season ${seasonNumber}`
        );

        addLog(
            `<strong>PLAYER OF THE YEAR.</strong><br>
            ${player.name} has been named Player of the Year.`
        );

        showCutscene(
            "AWARDS NIGHT",
            "PLAYER OF THE YEAR",
            `${player.name} has been named Player of the Year.`,
            () => updateCareerUI()
        );
    }

    /* Rare Ballon d'Or */
    if (
        player.rating >= 91 &&
        player.seasonGoals >= 25 &&
        player.seasonAssists >= 10 &&
        player.seasonPoints >= 80 &&
        player.trophies >= 5 &&
        player.reputation >= 85 &&
        random(1, 100) <= 20
    ) {
        player.ballonDor++;
        player.trophies++;

        player.achievements.push(
            `Ballon d'Or — Season ${seasonNumber}`
        );

        addLog(
            `<strong>BALLON D'OR.</strong><br>
            ${player.name} has won football's biggest individual award.`
        );

        showCutscene(
            "THE FOOTBALL WORLD",
            "BALLON D'OR",
            `${player.name}, YOU HAVE WON THE BALLON D'OR.`,
            () => updateCareerUI()
        );
    }

    if (trophyWon) {
        player.reputation =
            clamp(
                player.reputation + 5,
                0,
                100
            );
    }

    /* Age and development */
    player.age++;

    if (
        player.age <= 24 &&
        player.rating < player.potential
    ) {
        if (random(1, 100) <= 70) {
            player.rating += random(1, 2);

            player.rating =
                Math.min(
                    player.rating,
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
        clamp(
            player.fitness + random(8, 20),
            0,
            100
        );

    player.form =
        clamp(
            player.form + random(-3, 5),
            0,
            100
        );

    /* Reset season */
    player.season++;

    player.week = 1;
    player.dayIndex = 0;

    player.seasonGoals = 0;
    player.seasonAssists = 0;
    player.seasonAppearances = 0;

    player.seasonWins = 0;
    player.seasonDraws = 0;
    player.seasonLosses = 0;
    player.seasonPoints = 0;

    player.transferWindow = true;

    checkNationalTeam();
    checkCareerProgression();

    if (player.age >= 40) {
        retirePlayer();
        return;
    }

    scheduleNextMatch();

    addWorldNews(
        `${player.club} begin a new season with ${player.name} in the squad.`
    );

    updateCareerUI();
    updateTopBar();
    saveGame();
}


/* =========================================================
   DAY ADVANCEMENT
========================================================= */

function advanceDay() {
    if (!player || player.retired) return;

    const currentDay =
        player.dayIndex % 7;

    /*
       Saturday = matchday.
       Don't automatically play the match.
    */

    if (
        currentDay === 5 &&
        player.matchScheduled
    ) {
        startMatch();
        return;
    }

    player.dayIndex++;

    const newDay =
        player.dayIndex % 7;

    if (newDay === 0) {
        player.week++;

        weeklyUpdate();
    }

    if (newDay === 0 || newDay === 2 || newDay === 6) {
        player.fitness =
            clamp(
                player.fitness + random(8, 15),
                0,
                100
            );

        player.form =
            clamp(
                player.form + 1,
                0,
                100
            );
    }

    if (newDay === 0) {
        addWorldNews(
            generateWorldNews()
        );
    }

    /* Random injury */
    if (
        !player.injured &&
        random(1, 100) <= 2
    ) {
        player.injured = true;
        player.injuryWeeks = random(1, 3);

        addLog(
            `<strong>INJURY SETBACK.</strong><br>
            Recovery time: ${player.injuryWeeks} week(s).`
        );
    }

    if (player.injured && newDay === 0) {
        player.injuryWeeks--;

        if (player.injuryWeeks <= 0) {
            player.injured = false;
            player.injuryWeeks = 0;

            addLog(
                `<strong>INJURY RECOVERY.</strong><br>
                Medical staff have cleared you to play.`
            );
        }
    }

    /* 52 weeks = season */
    if (player.week > 52) {
        endSeason();
        return;
    }

    /* Saturday */
    if (
        newDay === 5 &&
        !player.matchScheduled
    ) {
        scheduleNextMatch();
    }

    updateCareerUI();
    updateTopBar();
    saveGame();
}

function weeklyUpdate() {
    if (!player) return;

    if (player.salary > 0) {
        const salary =
            Math.floor(
                player.salary / 52
            );

        player.money += salary;
        player.careerEarnings += salary;

        addLog(
            `<strong>WEEKLY SALARY.</strong><br>
            ${money(salary)} received.`
        );
    }

    if (player.contractYears > 0) {
        player.contractWeeks =
            (player.contractWeeks || 0) + 1;

        if (
            player.contractWeeks >= 52
        ) {
            player.contractYears =
                Math.max(
                    0,
                    player.contractYears - 1
                );

            player.contractWeeks = 0;
        }
    }

    checkNationalTeam();
}


/* =========================================================
   WORLD NEWS
========================================================= */

function generateWorldNews() {
    let a =
        WORLD_TEAMS[
            random(0, WORLD_TEAMS.length - 1)
        ];

    let b =
        WORLD_TEAMS[
            random(0, WORLD_TEAMS.length - 1)
        ];

    while (a === b) {
        b =
            WORLD_TEAMS[
                random(0, WORLD_TEAMS.length - 1)
            ];
    }

    const events = [
        `${a} defeated ${b} in a dramatic league match.`,
        `${a} have announced a new manager.`,
        `${b} are preparing a major transfer bid.`,
        `${a} have reached the cup semi-final.`,
        `${b} have moved into the top four.`,
        `${a} have extended their captain's contract.`,
        `${b} are scouting several young prospects.`,
        `${a} have shocked the football world with a major signing.`
    ];

    return events[
        random(0, events.length - 1)
    ];
}


/* =========================================================
   AWARDS SCREEN
========================================================= */

function updateAwardsUI() {
    if (!player) return;

    if ($("playerOfYearStatus")) {
        $("playerOfYearStatus").textContent =
            `${player.playerOfYear} win(s)`;
    }

    if ($("goldenBootStatus")) {
        $("goldenBootStatus").textContent =
            `${player.goldenBoots} win(s)`;
    }

    if ($("ballonDorStatus")) {
        $("ballonDorStatus").textContent =
            `${player.ballonDor} win(s)`;
    }

    if ($("teamTrophiesStatus")) {
        $("teamTrophiesStatus").textContent =
            `${player.trophies} trophy/trophies`;
    }
}


/* =========================================================
   RETIREMENT
========================================================= */

function retirePlayer() {
    if (!player || player.retired) return;

    player.retired = true;

    addLog(
        `<strong>RETIREMENT.</strong><br>
        ${player.name}'s playing career has ended.`
    );

    if ($("retireGoals"))
        $("retireGoals").textContent =
            player.goals;

    if ($("retireAssists"))
        $("retireAssists").textContent =
            player.assists;

    if ($("retireTrophies"))
        $("retireTrophies").textContent =
            player.trophies;

    if ($("retireMoney"))
        $("retireMoney").textContent =
            money(player.money);

    if ($("retirementSummary")) {
        $("retirementSummary").textContent =
            `${player.name} finished with ${player.goals} goals, ${player.assists} assists and ${player.trophies} trophies.`;
    }

    showScreen("retirementScreen");

    showCutscene(
        "THE FINAL WHISTLE",
        "YOUR PLAYING CAREER IS OVER",
        `${player.name} has retired from professional football. The next chapter begins now.`,
        () => {
            updateTopBar();
            saveGame();
        }
    );
}


/* =========================================================
   LEGACY
========================================================= */

function openLegacy() {
    if (!player || !player.retired) {
        showToast("You need to retire before entering Legacy.");
        return;
    }

    showScreen("legacyScreen");
}


/* =========================================================
   CLUB CREATION
========================================================= */

function openClubCreation() {
    if (!player || !player.retired) return;

    showScreen("clubCreateScreen");
}

function createClub() {
    if (!player || !player.retired) return;

    const name =
        $("newClubName")?.value.trim();

    const city =
        $("newClubCity")?.value.trim();

    const motto =
        $("newClubMotto")?.value.trim();

    const stadium =
        $("newClubStadium")?.value.trim();

    if (!name || !city || !motto || !stadium) {
        showToast("Complete every club field.");
        return;
    }

    const creationCost = 100000;

    if (player.money < creationCost) {
        showToast(
            `You need ${money(creationCost)} to create the club.`
        );

        return;
    }

    player.money -= creationCost;

    club = {
        name,
        city,
        motto,
        stadium,

        funds: 100000,

        reputation: 10,

        stadiumLevel: 1,
        youthLevel: 1,
        trainingLevel: 1,
        scoutingLevel: 1,
        staffLevel: 1,

        wins: 0,
        draws: 0,
        losses: 0,

        trophies: 0,

        squad: [],
        startingXI: [],

        revenue: 0,
        wages: 0,

        financeLog: []
    };

    generateInitialSquad();

    player.club = name;
    player.clubStatus = "Owner";

    addLog(
        `<strong>CLUB FOUNDED.</strong><br>
        ${name} has officially entered world football.`
    );

    addOwnerFinanceLog(
        `Club founded with initial funds of ${money(club.funds)}.`
    );

    updateOwnerUI();

    saveGame();

    showScreen("ownerScreen");

    showCutscene(
        name.toUpperCase(),
        "A NEW CLUB IS BORN",
        `${name} begins its journey through the world of football.`,
        () => {
            updateOwnerUI();
            saveGame();
        }
    );
}


/* =========================================================
   OWNER SQUAD
========================================================= */

function generateInitialSquad() {
    if (!club) return;

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

    club.squad = positions.map(
        (position, index) => ({
            id:
                Date.now() +
                index,

            name:
                randomName(),

            age:
                random(18, 28),

            position,

            rating:
                random(58, 70),

            potential:
                random(70, 84),

            salary:
                random(500, 1500),

            contract:
                random(1, 4)
        })
    );

    club.startingXI =
        club.squad.map(
            (p) => p.id
        );
}

function renderOwnerSquad() {
    const container = $("ownerSquad");

    if (!container || !club) return;

    container.innerHTML = "";

    club.squad.forEach((playerData) => {
        const row =
            document.createElement("div");

        row.className = "squad-row";

        row.innerHTML = `
            <strong>${playerData.name}</strong>
            <span>${playerData.position}</span>
            <span>${playerData.age}</span>
            <b>${playerData.rating}</b>
        `;

        container.appendChild(row);
    });
}

function renderStartingXI() {
    const container = $("startingXI");

    if (!container || !club) return;

    container.innerHTML = "";

    club.startingXI.forEach((id) => {
        const p =
            club.squad.find(
                (playerData) =>
                    playerData.id === id
            );

        if (!p) return;

        const row =
            document.createElement("div");

        row.className = "starting-player";

        row.textContent =
            `${p.position} — ${p.name} · ${p.rating}`;

        container.appendChild(row);
    });
}


/* =========================================================
   OWNER UI
========================================================= */

function updateOwnerUI() {
    if (!club) return;

    if ($("ownerClubName"))
        $("ownerClubName").textContent =
            club.name;

    if ($("ownerClubMotto"))
        $("ownerClubMotto").textContent =
            club.motto;

    if ($("ownerFunds"))
        $("ownerFunds").textContent =
            money(club.funds);

    if ($("ownerRating"))
        $("ownerRating").textContent =
            calculateClubRating();

    if ($("ownerReputation"))
        $("ownerReputation").textContent =
            club.reputation;

    if ($("ownerStadiumLevel"))
        $("ownerStadiumLevel").textContent =
            club.stadiumLevel;

    if ($("ownerYouthLevel"))
        $("ownerYouthLevel").textContent =
            club.youthLevel;

    if ($("stadiumUpgradeCost"))
        $("stadiumUpgradeCost").textContent =
            money(
                30000 *
                club.stadiumLevel
            );

    if ($("youthUpgradeCost"))
        $("youthUpgradeCost").textContent =
            money(
                20000 *
                club.youthLevel
            );

    if ($("trainingUpgradeCost"))
        $("trainingUpgradeCost").textContent =
            money(
                25000 *
                club.trainingLevel
            );

    if ($("staffUpgradeCost"))
        $("staffUpgradeCost").textContent =
            money(
                22000 *
                club.staffLevel
            );

    renderOwnerSquad();
    renderStartingXI();
}

function calculateClubRating() {
    if (!club || !club.squad.length) return 0;

    const total =
        club.squad.reduce(
            (sum, p) =>
                sum + p.rating,
            0
        );

    return Math.round(
        total / club.squad.length
    );
}


/* =========================================================
   OWNER UPGRADES
========================================================= */

function upgradeOwner(type) {
    if (!club) return;

    const config = {
        stadium: {
            level: "stadiumLevel",
            cost: 30000,
            label: "Stadium"
        },

        youth: {
            level: "youthLevel",
            cost: 20000,
            label: "Youth Academy"
        },

        training: {
            level: "trainingLevel",
            cost: 25000,
            label: "Training Centre"
        },

        staff: {
            level: "staffLevel",
            cost: 22000,
            label: "Club Staff"
        }
    };

    const data = config[type];

    if (!data) return;

    const actualCost =
        data.cost *
        club[data.level];

    if (club.funds < actualCost) {
        showToast(
            `Not enough funds. Cost: ${money(actualCost)}`
        );

        return;
    }

    club.funds -= actualCost;
    club[data.level]++;

    if (type === "stadium") {
        club.reputation =
            clamp(
                club.reputation + 1,
                0,
                100
            );
    }

    addOwnerFinanceLog(
        `${data.label} upgraded to level ${club[data.level]}.`
    );

    showToast(
        `${data.label} upgraded.`
    );

    updateOwnerUI();
    saveGame();
}


/* =========================================================
   SCOUTING
========================================================= */

function openScouting() {
    if (!club) return;

    renderScoutResults();

    showScreen("scoutScreen");
}

function renderScoutResults() {
    const container =
        $("scoutResults");

    if (!container || !club) return;

    container.innerHTML = "";

    for (let i = 0; i < 3; i++) {
        const level =
            club.scoutingLevel;

        const prospect = {
            id: Date.now() + i,

            name: randomName(),

            age: random(16, 21),

            position: [
                "GK",
                "CB",
                "LB",
                "RB",
                "CDM",
                "CM",
                "CAM",
                "LW",
                "RW",
                "ST"
            ][random(0, 9)],

            rating:
                random(
                    52 + level,
                    62 + level
                ),

            potential:
                random(
                    70 + level,
                    80 + level
                ),

            salary:
                random(300, 1000),

            contract: 3
        };

        const row =
            document.createElement("div");

        row.className = "scout-player";

        row.innerHTML = `
            <strong>${prospect.name}</strong>
            <span>${prospect.age} · ${prospect.position}</span>
            <span>OVR ${prospect.rating}</span>
            <span>POT ${prospect.potential}</span>
            <button type="button">SIGN</button>
        `;

        row.querySelector("button")
            .addEventListener(
                "click",
                () => {
                    signProspect(prospect);
                }
            );

        container.appendChild(row);
    }
}

function signProspect(prospect) {
    if (!club) return;

    const cost =
        5000 *
        club.scoutingLevel;

    if (club.funds < cost) {
        showToast(
            `Scouting signing costs ${money(cost)}.`
        );

        return;
    }

    club.funds -= cost;

    club.squad.push(prospect);

    addOwnerFinanceLog(
        `Signed ${prospect.name}, age ${prospect.age}, OVR ${prospect.rating}.`
    );

    showToast(
        `${prospect.name} joins the club.`
    );

    updateOwnerUI();
    saveGame();
}


/* =========================================================
   YOUTH ACADEMY
========================================================= */

function developYouth() {
    if (!club) return;

    const cost =
        10000 *
        club.youthLevel;

    if (club.funds < cost) {
        showToast(
            `Youth development costs ${money(cost)}.`
        );

        return;
    }

    club.funds -= cost;

    const youth = {
        id: Date.now(),

        name: randomName(),

        age: random(15, 18),

        position: [
            "GK",
            "CB",
            "LB",
            "RB",
            "CM",
            "CAM",
            "LW",
            "RW",
            "ST"
        ][random(0, 8)],

        rating:
            random(
                45 + club.youthLevel * 2,
                55 + club.youthLevel * 2
            ),

        potential:
            random(
                75 + club.youthLevel,
                85 + club.youthLevel
            ),

        salary: 250,

        contract: 3
    };

    club.squad.push(youth);

    addOwnerFinanceLog(
        `Youth academy produced ${youth.name}, potential ${youth.potential}.`
    );

    showToast(
        `${youth.name} has joined your academy.`
    );

    updateOwnerUI();
    saveGame();
}


/* =========================================================
   OWNER MATCH
========================================================= */

function playOwnerMatch() {
    if (!club) return;

    const opponents =
        TEAMS.filter(
            (team) =>
                team.name !== club.name
        );

    const opponent =
        opponents[
            random(
                0,
                opponents.length - 1
            )
        ];

    const clubRating =
        calculateClubRating();

    const opponentRating =
        opponent.rating;

    const homeGoals =
        random(
            0,
            Math.max(
                1,
                Math.floor(
                    clubRating / 18
                )
            )
        );

    const awayGoals =
        random(
            0,
            Math.max(
                1,
                Math.floor(
                    opponentRating / 18
                )
            )
        );

    if (clubRating > opponentRating + 5) {
        club.wins++;
    } else if (
        clubRating < opponentRating - 5
    ) {
        club.losses++;
    } else {
        club.draws++;
    }

    const revenue =
        12000 +
        club.stadiumLevel * 5000;

    club.funds += revenue;
    club.revenue += revenue;

    addOwnerFinanceLog(
        `Match vs ${opponent.name}: ${homeGoals}-${awayGoals}. Revenue ${money(revenue)}.`
    );

    if (homeGoals > awayGoals) {
        club.reputation =
            clamp(
                club.reputation + 2,
                0,
                100
            );

        showToast(
            `WIN ${homeGoals}-${awayGoals}`
        );
    } else if (
        homeGoals === awayGoals
    ) {
        showToast(
            `DRAW ${homeGoals}-${awayGoals}`
        );
    } else {
        club.reputation =
            clamp(
                club.reputation - 1,
                0,
                100
            );

        showToast(
            `LOSS ${homeGoals}-${awayGoals}`
        );
    }

    updateOwnerUI();
    saveGame();
}


/* =========================================================
   OWNER FINANCES
========================================================= */

function addOwnerFinanceLog(text) {
    if (!club) return;

    if (!club.financeLog) {
        club.financeLog = [];
    }

    club.financeLog.unshift(text);

    if (club.financeLog.length > 20) {
        club.financeLog =
            club.financeLog.slice(0, 20);
    }
}

function updateFinanceUI() {
    if (!club) return;

    let wages = 0;

    club.squad.forEach((p) => {
        wages += p.salary;
    });

    const weeklyWages =
        Math.floor(
            wages / 52
        );

    const revenue =
        club.revenue || 0;

    const balance =
        club.funds;

    if ($("financeFunds"))
        $("financeFunds").textContent =
            money(club.funds);

    if ($("financeRevenue"))
        $("financeRevenue").textContent =
            money(revenue);

    if ($("financeWages"))
        $("financeWages").textContent =
            money(weeklyWages);

    if ($("financeBalance"))
        $("financeBalance").textContent =
            money(balance);

    const log =
        $("financeLog");

    if (log) {
        log.innerHTML = "";

        (club.financeLog || [])
            .forEach((entry) => {
                const div =
                    document.createElement("div");

                div.className = "log-entry";
                div.textContent = entry;

                log.appendChild(div);
            });
    }
}

function ownerWeeklyFinance() {
    if (!club) return;

    const attendance =
        club.stadiumLevel *
        3500;

    const ticketIncome =
        attendance * 8;

    const sponsorIncome =
        club.reputation * 250;

    let wages = 0;

    club.squad.forEach((p) => {
        wages += p.salary;
    });

    const weeklyWages =
        Math.floor(
            wages / 52
        );

    const income =
        ticketIncome +
        sponsorIncome;

    const balance =
        income -
        weeklyWages;

    club.funds =
        Math.max(
            0,
            club.funds + balance
        );

    club.revenue += income;

    club.wages += weeklyWages;

    addOwnerFinanceLog(
        `Weekly finance: +${money(income)} revenue, -${money(weeklyWages)} wages.`
    );

    updateOwnerUI();
}


/* =========================================================
   FINANCE SCREEN
========================================================= */

function openFinance() {
    if (!club) return;

    updateFinanceUI();

    showScreen("financeScreen");
}


/* =========================================================
   SAVE / LOAD
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

function loadGame() {
    try {
        const saved =
            localStorage.getItem(
                SAVE_KEY
            );

        if (!saved) return false;

        const data =
            JSON.parse(saved);

        player =
            data.player || null;

        club =
            data.club || null;

        if (!player) return false;

        updateCareerUI();
        updateTopBar();

        if (club) {
            updateOwnerUI();
        }

        return true;
    } catch (error) {
        console.error(
            "Could not load game:",
            error
        );

        player = null;
        club = null;

        return false;
    }
}


/* =========================================================
   SETTINGS
========================================================= */

function resetGame() {
    const confirmed =
        window.confirm(
            "Delete your current PROJECT XI life permanently?"
        );

    if (!confirmed) return;

    localStorage.removeItem(
        SAVE_KEY
    );

    player = null;
    club = null;

    window.location.reload();
}


/* =========================================================
   EVENT LISTENERS
========================================================= */

function setupEvents() {

    /* Logo */
    $("logoButton")?.addEventListener(
        "click",
        () => showScreen("menuScreen")
    );

    /* Menu */
    $("newGameButton")?.addEventListener(
        "click",
        () => {
            const confirmed =
                !player ||
                window.confirm(
                    "Start a new football life? Your current save will be replaced."
                );

            if (!confirmed) return;

            localStorage.removeItem(
                SAVE_KEY
            );

            player = null;
            club = null;

            if ($("playerName"))
                $("playerName").value = "";

            if ($("playerCountry"))
                $("playerCountry").value = "";

            showScreen("createScreen");
        }
    );

    $("continueButton")?.addEventListener(
        "click",
        () => {
            if (!player) {
                showToast("No career save found.");
                showScreen("createScreen");
                return;
            }

            if (player.retired && club) {
                updateOwnerUI();
                showScreen("ownerScreen");
                return;
            }

            if (player.retired) {
                showScreen("legacyScreen");
                return;
            }

            updateCareerUI();
            updateTopBar();

            showScreen("careerScreen");
        }
    );

    $("legacyMenuButton")?.addEventListener(
        "click",
        () => {
            if (player?.retired) {
                showScreen("legacyScreen");
            } else {
                showToast(
                    "Legacy becomes available after retirement."
                );
            }
        }
    );

    /* Create player */
    $("createPlayerButton")?.addEventListener(
        "click",
        createPlayer
    );

    $("playerName")?.addEventListener(
        "input",
        updatePlayerPreview
    );

    $("playerPosition")?.addEventListener(
        "change",
        updatePlayerPreview
    );

    /* Career */
    $("trainingButton")?.addEventListener(
        "click",
        trainPlayer
    );

    $("restButton")?.addEventListener(
        "click",
        restPlayer
    );

    $("matchButton")?.addEventListener(
        "click",
        startMatch
    );

    $("advanceDayButton")?.addEventListener(
        "click",
        advanceDay
    );

    $("transferButton")?.addEventListener(
        "click",
        openTransfers
    );

    $("careerAwardsButton")?.addEventListener(
        "click",
        () => {
            updateAwardsUI();
            showScreen("awardsScreen");
        }
    );

    $("retireButton")?.addEventListener(
        "click",
        () => {
            if (!player) return;

            if (player.age < 34) {
                showToast(
                    "You can retire from playing at age 34."
                );

                return;
            }

            const confirmed =
                window.confirm(
                    "Retire from professional football?"
                );

            if (confirmed) {
                retirePlayer();
            }
        }
    );

    /* Match */
    $("matchAttackButton")?.addEventListener(
        "click",
        () => matchAction("attack")
    );

    $("matchPassButton")?.addEventListener(
        "click",
        () => matchAction("pass")
    );

    $("matchDefendButton")?.addEventListener(
        "click",
        () => matchAction("defend")
    );

    /* Contract */
    $("signContractButton")?.addEventListener(
        "click",
        signProfessionalContract
    );

    /* Transfer */
    $("transferBackButton")?.addEventListener(
        "click",
        () => showScreen("careerScreen")
    );

    $("counterOfferButton")?.addEventListener(
        "click",
        counterTransfer
    );

    $("acceptTransferButton")?.addEventListener(
        "click",
        acceptTransfer
    );

    $("rejectTransferButton")?.addEventListener(
        "click",
        rejectTransfer
    );

    /* Awards */
    $("awardsBackButton")?.addEventListener(
        "click",
        () => showScreen("careerScreen")
    );

    /* Retirement */
    $("beginLegacyButton")?.addEventListener(
        "click",
        openLegacy
    );

    /* Legacy */
    $("createClubButton")?.addEventListener(
        "click",
        openClubCreation
    );

    $("legacyInvestButton")?.addEventListener(
        "click",
        () => {
            if (!player) return;

            const amount = 25000;

            if (player.money < amount) {
                showToast(
                    `You need ${money(amount)}.`
                );

                return;
            }

            player.money -= amount;

            showToast(
                `Invested ${money(amount)} into your future club.`
            );

            saveGame();
            updateTopBar();
        }
    );

    /* Club creation */
    $("foundClubButton")?.addEventListener(
        "click",
        createClub
    );

    /* Owner */
    $("upgradeStadiumButton")?.addEventListener(
        "click",
        () => upgradeOwner("stadium")
    );

    $("upgradeYouthButton")?.addEventListener(
        "click",
        () => upgradeOwner("youth")
    );

    $("upgradeTrainingButton")?.addEventListener(
        "click",
        () => upgradeOwner("training")
    );

    $("hireStaffButton")?.addEventListener(
        "click",
        () => upgradeOwner("staff")
    );

    $("scoutButton")?.addEventListener(
        "click",
        openScouting
    );

    $("youthAcademyButton")?.addEventListener(
        "click",
        developYouth
    );

    $("ownerMatchButton")?.addEventListener(
        "click",
        playOwnerMatch
    );

    $("ownerFinanceButton")?.addEventListener(
        "click",
        openFinance
    );

    /* Scout */
    $("scoutBackButton")?.addEventListener(
        "click",
        () => {
            updateOwnerUI();
            showScreen("ownerScreen");
        }
    );

    /* Finance */
    $("financeBackButton")?.addEventListener(
        "click",
        () => {
            updateOwnerUI();
            showScreen("ownerScreen");
        }
    );

    /* Settings */
    $("saveGameButton")?.addEventListener(
        "click",
        () => {
            saveGame();
            showToast("GAME SAVED");
        }
    );

    $("resetGameButton")?.addEventListener(
        "click",
        resetGame
    );

    /* Cutscene */
    $("cutsceneContinue")?.addEventListener(
        "click",
        closeCutscene
    );
}


/* =========================================================
   STARTUP
========================================================= */

function initializeGame() {
    setupEvents();

    const loaded =
        loadGame();

    updatePlayerPreview();

    if (!loaded) {
        showScreen("menuScreen");
    } else {
        updateCareerUI();
        updateTopBar();

        if (player.retired && club) {
            updateOwnerUI();
        }
    }
}

initializeGame();
