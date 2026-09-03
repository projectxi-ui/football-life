/* =========================================================
   PROJECT XI | FOOTBALL LIFE
   SCRIPT.JS — MATCHES CURRENT INDEX.HTML
========================================================= */

const SAVE_KEY = "projectXI_football_life_v10";

let player = null;
let club = null;

const $ = id => document.getElementById(id);


/* =========================================================
   SCREEN SYSTEM
========================================================= */

const screens = {
    menu: $("menuScreen"),
    create: $("createScreen"),
    clubSelect: $("clubSelectScreen"),
    career: $("careerScreen"),
    match: $("matchScreen"),
    contract: $("contractScreen"),
    transfer: $("transferScreen"),
    negotiation: $("negotiationScreen"),
    awards: $("awardsScreen"),
    retirement: $("retirementScreen"),
    legacy: $("legacyScreen"),
    clubCreate: $("clubCreateScreen"),
    owner: $("ownerScreen"),
    scout: $("scoutScreen"),
    finance: $("financeScreen"),
    settings: $("settingsScreen")
};

function showScreen(screen) {

    Object.values(screens).forEach(s => {
        if (s) s.classList.remove("active");
    });

    if (screen) {
        screen.classList.add("active");
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


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
    return "€" + Math.floor(value || 0).toLocaleString();
}

function positionName(position) {

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

function getDayName(index) {

    const days = [
        "MONDAY",
        "TUESDAY",
        "WEDNESDAY",
        "THURSDAY",
        "FRIDAY",
        "SATURDAY",
        "SUNDAY"
    ];

    return days[index % 7];
}

function toast(message) {

    const box = $("toast");

    if (!box) return;

    box.textContent = message;
    box.classList.remove("hidden");

    clearTimeout(toast.timer);

    toast.timer = setTimeout(() => {
        box.classList.add("hidden");
    }, 2500);
}


/* =========================================================
   CAREER LOG
========================================================= */

function addLog(text) {

    const log = $("careerLog");

    if (!log) return;

    const entry = document.createElement("div");

    entry.className = "log-entry";
    entry.innerHTML = text;

    log.prepend(entry);
}


/* =========================================================
   WORLD FOOTBALL
========================================================= */

const WORLD_TEAMS = [
    "Northstar United",
    "Royal Santoro",
    "Ravenholm FC",
    "Eastport City",
    "Silvergate Athletic",
    "Westhaven FC",
    "Club de Aderis",
    "Kingsbridge City",
    "Redmont United",
    "Ironbridge FC",
    "Blackridge Athletic",
    "Stormvale City",
    "Oakchester FC",
    "Crownfield United",
    "Riverstone FC",
    "Highland Rovers",
    "Deportivo Veyra",
    "Atlético Marenza"
];

function generateWorldNews() {

    let a = WORLD_TEAMS[random(0, WORLD_TEAMS.length - 1)];
    let b = WORLD_TEAMS[random(0, WORLD_TEAMS.length - 1)];

    while (b === a) {
        b = WORLD_TEAMS[random(0, WORLD_TEAMS.length - 1)];
    }

    const events = [
        `${a} defeated ${b} in a dramatic league match.`,
        `${b} are preparing a major transfer bid.`,
        `${a} have announced a new manager.`,
        `${a}'s star striker is expected to miss several weeks.`,
        `${b} have reached the cup semi-final.`,
        `${a} have moved into the top four.`,
        `${b} have extended the contract of their captain.`,
        `${a} have discovered a highly-rated young prospect.`
    ];

    return events[random(0, events.length - 1)];
}

function renderWorldNews() {

    const feeds = [
        $("worldFeed"),
        $("menuWorldFeed"),
        $("ownerWorldFeed")
    ];

    feeds.forEach(feed => {

        if (!feed) return;

        if (!feed.children.length) {
            feed.innerHTML = "";
        }

        const item = document.createElement("div");

        item.className = "feed-item";

        item.textContent = generateWorldNews();

        feed.prepend(item);

        while (feed.children.length > 6) {
            feed.removeChild(feed.lastChild);
        }
    });
}


/* =========================================================
   CUTSCENES
========================================================= */

let cutsceneCallback = null;

function playCutscene(location, title, text, callback) {

    const overlay = $("cutsceneOverlay");

    if (!overlay) {
        if (callback) callback();
        return;
    }

    $("cutsceneLocation").textContent = location;
    $("cutsceneTitle").textContent = title;
    $("cutsceneText").textContent = text;

    cutsceneCallback = callback || null;

    overlay.classList.remove("hidden");
}

if ($("cutsceneContinue")) {

    $("cutsceneContinue").addEventListener("click", () => {

        $("cutsceneOverlay").classList.add("hidden");

        if (cutsceneCallback) {

            const callback = cutsceneCallback;

            cutsceneCallback = null;

            callback();
        }
    });
}


/* =========================================================
   TEAMS
========================================================= */

const TEAMS = [
    {
        name: "PROJECT XI FC",
        rating: 99,
        country: "Global",
        tier: "World Elite"
    },
    {
        name: "Northstar United",
        rating: 91,
        country: "England",
        tier: "Elite"
    },
    {
        name: "Royal Santoro",
        rating: 87,
        country: "Spain",
        tier: "Elite"
    },
    {
        name: "Ravenholm FC",
        rating: 83,
        country: "Germany",
        tier: "Top Division"
    },
    {
        name: "Eastport City",
        rating: 78,
        country: "England",
        tier: "Top Division"
    },
    {
        name: "Silvergate Athletic",
        rating: 73,
        country: "France",
        tier: "Top Division"
    },
    {
        name: "Westhaven FC",
        rating: 69,
        country: "Netherlands",
        tier: "Professional"
    },
    {
        name: "Club de Aderis",
        rating: 66,
        country: "Portugal",
        tier: "Professional"
    }
];


/* =========================================================
   ACADEMY SELECTION
========================================================= */

const ACADEMIES = [
    {
        name: "PROJECT XI ACADEMY",
        rating: 72,
        country: "Global",
        bonus: 4,
        description: "The most advanced academy. Faster development, tougher competition."
    },
    {
        name: "Northstar Youth",
        rating: 65,
        country: "England",
        bonus: 3,
        description: "A disciplined academy focused on technical development."
    },
    {
        name: "Royal Santoro Academy",
        rating: 62,
        country: "Spain",
        bonus: 3,
        description: "Technical football and creative attacking development."
    },
    {
        name: "Ravenholm Youth",
        rating: 60,
        country: "Germany",
        bonus: 2,
        description: "Physical development and tactical discipline."
    },
    {
        name: "Eastport Academy",
        rating: 56,
        country: "England",
        bonus: 2,
        description: "A balanced route into professional football."
    },
    {
        name: "Westhaven Youth",
        rating: 52,
        country: "Netherlands",
        bonus: 1,
        description: "A difficult route, but excellent technical foundations."
    }
];

function renderAcademies() {

    const list = $("academyList");

    if (!list) return;

    list.innerHTML = "";

    ACADEMIES.forEach((academy, index) => {

        const button = document.createElement("button");

        button.type = "button";
        button.className = "club-option";

        button.innerHTML = `
            <div>
                <span class="eyebrow">${academy.country}</span>
                <h3>${academy.name}</h3>
                <p>${academy.description}</p>
            </div>

            <strong>${academy.rating}</strong>
        `;

        button.addEventListener("click", () => {

            if (!player) return;

            player.club = academy.name;
            player.clubStatus = "Youth Player";

            player.rating = clamp(
                player.rating + academy.bonus,
                1,
                99
            );

            player.academy = academy.name;

            addLog(`
                <strong>ACADEMY SELECTED.</strong><br>
                ${player.name} joins ${academy.name}.
            `);

            updateUI();
            saveGame();

            showScreen(screens.career);

            playCutscene(
                academy.name,
                "THE FIRST STEP",
                `${player.name} begins the journey at ${academy.name}.`,
                () => {
                    scheduleNextMatch();
                    updateUI();
                }
            );
        });

        list.appendChild(button);
    });
}


/* =========================================================
   PLAYER CREATION
========================================================= */

if ($("playerName")) {

    $("playerName").addEventListener("input", () => {

        $("previewName").textContent =
            $("playerName").value.trim() || "YOUR PLAYER";

        $("previewPosition").textContent =
            $("playerPosition").value;
    });
}

if ($("playerPosition")) {

    $("playerPosition").addEventListener("change", () => {

        $("previewPosition").textContent =
            $("playerPosition").value;
    });
}

if ($("newGameButton")) {

    $("newGameButton").addEventListener("click", () => {

        localStorage.removeItem(SAVE_KEY);

        player = null;
        club = null;

        if ($("playerName"))
            $("playerName").value = "";

        showScreen(screens.create);
    });
}

if ($("createPlayerButton")) {

    $("createPlayerButton").addEventListener("click", () => {

        const name =
            $("playerName").value.trim();

        const country =
            $("playerCountry").value;

        const position =
            $("playerPosition").value;

        const foot =
            $("playerFoot").value;

        if (!name) {

            toast("Enter a player name.");

            return;
        }

        player = {

            name,
            country,
            position,
            foot,

            age: 16,

            season: 1,
            week: 1,
            day: 1,
            dayIndex: 0,

            rating: 60,
            potential: random(76, 88),

            fitness: 100,
            form: 50,
            happiness: 80,
            reputation: 5,

            money: 2000,
            careerEarnings: 0,

            club: "PROJECT XI Academy",
            academy: null,
            clubStatus: "Youth Player",

            goals: 0,
            assists: 0,

            seasonGoals: 0,
            seasonAssists: 0,
            seasonMatches: 0,
            seasonWins: 0,
            seasonPoints: 0,

            trophies: 0,
            leagueTitles: 0,
            cupTitles: 0,

            goldenBoots: 0,
            playerOfYear: 0,
            ballonDor: 0,

            salary: 0,
            contractYears: 0,
            transferValue: 0,

            injured: false,
            injuryWeeks: 0,

            nationalTeam: false,
            nationalCaps: 0,
            nationalGoals: 0,

            retired: false,

            currentOpponent: null,
            matchScheduled: false,

            achievements: [],
            transferOffers: []
        };

        $("careerLog").innerHTML = "";

        addLog(`
            <strong>AGE ${player.age} — DAY 1</strong><br>
            Your football journey begins.
        `);

        renderAcademies();

        updateUI();
        saveGame();

        showScreen(screens.clubSelect);
    });
}


/* =========================================================
   UI UPDATE
========================================================= */

function updateUI() {

    if (!player) return;

    const set = (id, value) => {

        if ($(id)) {
            $(id).textContent = value;
        }
    };

    set("topAge", `AGE ${player.age}`);
    set("topRating", `OVR ${player.rating}`);
    set("topMoney", money(player.money));

    set("careerChapter", `SEASON ${player.season}`);
    set("careerPlayerName", player.name);
    set("careerClub", player.club);
    set("careerRating", player.rating);

    set("careerAge", player.age);
    set("careerFitness", player.fitness);
    set("careerForm", player.form);
    set("careerGoals", player.goals);
    set("careerAssists", player.assists);
    set("careerReputation", player.reputation);

    set("profileRating", player.rating);
    set("profileName", player.name);
    set("profilePosition", `${player.position} • ${positionName(player.position)}`);
    set("profileClub", player.club);

    set("potentialValue", player.potential);

    if ($("potentialFill")) {

        const percentage =
            clamp(
                (player.rating / player.potential) * 100,
                0,
                100
            );

        $("potentialFill").style.width =
            percentage + "%";
    }

    updateCalendarUI();
    updateAwardsUI();

    if ($("retireGoals"))
        $("retireGoals").textContent = player.goals;

    if ($("retireAssists"))
        $("retireAssists").textContent = player.assists;

    if ($("retireTrophies"))
        $("retireTrophies").textContent = player.trophies;

    if ($("retireMoney"))
        $("retireMoney").textContent =
            money(player.careerEarnings);

    if ($("retirementSummary"))
        $("retirementSummary").textContent =
            `${player.name} finished a career with ${player.goals} goals, ${player.assists} assists and ${player.trophies} trophies.`;

    updateOwnerUI();
}


/* =========================================================
   CALENDAR
========================================================= */

function getActivity(day) {

    if (day === 0) return "TRAINING";
    if (day === 1) return "TRAINING";
    if (day === 2) return "RECOVERY";
    if (day === 3) return "TRAINING";
    if (day === 4) return "REST";

    if (day === 5) {

        return player && player.matchScheduled
            ? `MATCH vs ${player.currentOpponent}`
            : "MATCHDAY";
    }

    return "RECOVERY";
}

function updateCalendarUI() {

    if (!player) return;

    const list = $("calendarList");

    if (!list) return;

    list.innerHTML = "";

    const currentDay =
        player.dayIndex % 7;

    for (let i = 0; i < 7; i++) {

        const div =
            document.createElement("div");

        div.className = "calendar-day";

        if (i === currentDay) {
            div.classList.add("current");
        }

        div.innerHTML = `
            <div class="calendar-day-name">
                ${getDayName(i)}
            </div>

            <div class="calendar-day-event">
                ${getActivity(i)}
            </div>
        `;

        list.appendChild(div);
    }

    const week =
        Math.ceil(player.day / 7);

    if ($("calendarDate"))
        $("calendarDate").textContent =
            `WEEK ${String(week).padStart(2, "0")}`;

    if ($("calendarStatus"))
        $("calendarStatus").textContent =
            `DAY ${player.day} • ${getDayName(currentDay)}`;
}


/* =========================================================
   MATCH SCHEDULING
========================================================= */

const OPPONENTS = [
    "Club de Aderis",
    "Westhaven FC",
    "Silvergate Athletic",
    "Eastport City",
    "Ravenholm FC",
    "Royal Santoro",
    "Northstar United"
];

function scheduleNextMatch() {

    if (!player || player.retired) return;

    player.currentOpponent =
        OPPONENTS[random(0, OPPONENTS.length - 1)];

    player.matchScheduled = true;

    addLog(`
        <strong>FIXTURE CONFIRMED.</strong><br>
        Saturday — ${player.club} vs ${player.currentOpponent}.
    `);

    updateCalendarUI();
}


/* =========================================================
   TRAINING
========================================================= */

if ($("trainingButton")) {

    $("trainingButton").addEventListener("click", () => {

        if (!player || player.retired) return;

        if (player.injured) {

            toast(
                `Injured — ${player.injuryWeeks} week(s) remaining.`
            );

            return;
        }

        const fitnessGain =
            random(3, 8);

        player.fitness =
            clamp(
                player.fitness + fitnessGain,
                0,
                100
            );

        let improved = false;

        if (
            player.rating < player.potential &&
            player.age <= 27 &&
            random(1, 100) <= 30
        ) {

            player.rating++;

            improved = true;
        }

        player.form =
            clamp(
                player.form + random(2, 5),
                0,
                100
            );

        if (improved) {

            addLog(`
                <strong>TRAINING BREAKTHROUGH.</strong><br>
                Rating increased to ${player.rating}.<br>
                Fitness +${fitnessGain}.
            `);

            toast(`BREAKTHROUGH — OVR ${player.rating}`);

        } else {

            addLog(`
                <strong>TRAINING SESSION.</strong><br>
                Fitness +${fitnessGain}. Form improved.
            `);

            toast(`Training complete — Fitness +${fitnessGain}`);
        }

        updateUI();
        saveGame();
    });
}


/* =========================================================
   REST
========================================================= */

if ($("restButton")) {

    $("restButton").addEventListener("click", () => {

        if (!player || player.retired) return;

        if (player.injured) {

            player.fitness =
                clamp(
                    player.fitness + 15,
                    0,
                    100
                );

            player.injuryWeeks--;

            if (player.injuryWeeks <= 0) {

                player.injured = false;
                player.injuryWeeks = 0;

                addLog(`
                    <strong>MEDICAL CLEARANCE.</strong><br>
                    You have recovered from your injury.
                `);

            } else {

                addLog(`
                    <strong>RECOVERY.</strong><br>
                    ${player.injuryWeeks} week(s) remain.
                `);
            }

        } else {

            const recovery =
                random(10, 18);

            player.fitness =
                clamp(
                    player.fitness + recovery,
                    0,
                    100
                );

            player.happiness =
                clamp(
                    player.happiness + random(2, 6),
                    0,
                    100
                );

            player.form =
                clamp(
                    player.form + random(1, 4),
                    0,
                    100
                );

            addLog(`
                <strong>REST DAY.</strong><br>
                Fitness +${recovery}.
            `);
        }

        updateUI();
        saveGame();
    });
}


/* =========================================================
   MATCHDAY
========================================================= */

let matchState = null;

if ($("matchButton")) {

    $("matchButton").addEventListener("click", () => {

        if (!player || player.retired) return;

        if (player.injured) {

            toast("You cannot play while injured.");

            return;
        }

        if (!player.matchScheduled) {

            toast("No match is scheduled.");

            return;
        }

        if (player.fitness < 35) {

            toast("Fitness too low to play.");

            return;
        }

        startMatch();
    });
}

function startMatch() {

    matchState = {

        minute: 0,
        homeScore: 0,
        awayScore: 0,

        attackCount: 0,
        finished: false
    };

    $("homeTeam").textContent =
        player.club;

    $("awayTeam").textContent =
        player.currentOpponent;

    $("homeScore").textContent = "0";
    $("awayScore").textContent = "0";
    $("matchMinute").textContent = "00'";

    $("matchCommentary").textContent =
        "The referee blows the whistle. Match underway.";

    showScreen(screens.match);
}

function matchAction(type) {

    if (!matchState || matchState.finished) return;

    matchState.minute += random(8, 15);

    const opponent =
        TEAMS.find(
            t => t.name === player.currentOpponent
        );

    const opponentRating =
        opponent
            ? opponent.rating
            : 70;

    let chance =
        player.rating - opponentRating;

    chance +=
        Math.floor(
            (player.form - 50) / 5
        );

    chance +=
        Math.floor(
            (player.fitness - 50) / 10
        );

    if (type === "attack") {
        chance += 12;
    }

    if (type === "chance") {
        chance += 6;
    }

    if (type === "defend") {
        chance -= 8;
    }

    const roll = random(1, 100);

    if (
        roll <= clamp(
            18 + chance,
            5,
            55
        )
    ) {

        matchState.homeScore++;

        if (type !== "defend") {

            player.seasonGoals++;
        }

        $("matchCommentary").textContent =
            `${player.name} creates danger! GOAL! ${player.club} score!`;

    } else {

        if (type === "attack") {

            $("matchCommentary").textContent =
                `${player.name} attacks the defence but the chance is missed.`;

        } else if (type === "chance") {

            $("matchCommentary").textContent =
                `${player.name} creates a dangerous opening.`;

        } else {

            $("matchCommentary").textContent =
                `${player.name} holds position and helps the team stay organised.`;
        }
    }

    if (random(1, 100) <= 15) {

        matchState.awayScore++;

        $("matchCommentary").textContent +=
            ` ${player.currentOpponent} respond immediately.`;
    }

    $("homeScore").textContent =
        matchState.homeScore;

    $("awayScore").textContent =
        matchState.awayScore;

    $("matchMinute").textContent =
        `${Math.min(matchState.minute, 90)}'`;

    if (matchState.minute >= 90) {

        finishMatch();
    }
}

if ($("matchAttackButton")) {

    $("matchAttackButton").addEventListener(
        "click",
        () => matchAction("attack")
    );
}

if ($("matchPassButton")) {

    $("matchPassButton").addEventListener(
        "click",
        () => matchAction("chance")
    );
}

if ($("matchDefendButton")) {

    $("matchDefendButton").addEventListener(
        "click",
        () => matchAction("defend")
    );
}

function finishMatch() {

    if (!matchState || matchState.finished) return;

    matchState.finished = true;

    const goals =
        matchState.homeScore > matchState.awayScore
            ? random(0, 2)
            : random(0, 1);

    const assists =
        random(0, 1);

    player.goals += goals;
    player.assists += assists;

    player.seasonGoals += goals;
    player.seasonAssists += assists;

    player.seasonMatches++;

    let result;

    if (
        matchState.homeScore >
        matchState.awayScore
    ) {

        result = "WIN";

        player.seasonWins++;
        player.seasonPoints += 3;

        player.happiness =
            clamp(
                player.happiness + 4,
                0,
                100
            );

    } else if (
        matchState.homeScore <
        matchState.awayScore
    ) {

        result = "LOSS";

        player.form =
            clamp(
                player.form - 4,
                0,
                100
            );

    } else {

        result = "DRAW";

        player.seasonPoints += 1;
    }

    const performance =
        clamp(
            player.rating +
            random(-10, 10),
            40,
            99
        );

    const matchRating =
        clamp(
            6 +
            (performance - 50) / 10,
            5,
            9.8
        );

    player.fitness =
        clamp(
            player.fitness - random(8, 12),
            0,
            100
        );

    const pay =
        player.salary > 0
            ? Math.floor(player.salary / 52)
            : random(100, 300);

    player.money += pay;
    player.careerEarnings += pay;

    if (goals > 0) {

        player.reputation =
            clamp(
                player.reputation + goals,
                0,
                100
            );
    }

    player.matchScheduled = false;
    player.currentOpponent = null;

    addLog(`
        <strong>FULL TIME — ${result}</strong><br>
        ${player.seasonGoals} season goal(s) •
        ${assists} assist(s) this match •
        Match rating ${matchRating.toFixed(1)}<br>
        Earnings: ${money(pay)}
    `);

    $("matchCommentary").textContent =
        `FULL TIME — ${result}. ${goals} goal(s), ${assists} assist(s).`;

    checkMilestones();

    setTimeout(() => {

        showScreen(screens.career);

        updateUI();
        saveGame();

        if (player.seasonMatches >= 12) {

            finishSeason();
        }

    }, 1200);
}


/* =========================================================
   MILESTONES
========================================================= */

function checkMilestones() {

    if (
        player.goals >= 1 &&
        !player.achievements.includes(
            "First Professional Goal"
        ) &&
        player.clubStatus !== "Youth Player"
    ) {

        player.achievements.push(
            "First Professional Goal"
        );

        playCutscene(
            "MATCHDAY",
            "FIRST PROFESSIONAL GOAL",
            `${player.name} has scored the first professional goal of the career.`
        );
    }
}


/* =========================================================
   PROFESSIONAL CONTRACT
========================================================= */

function calculateTransferValue() {

    const ageFactor =
        player.age <= 23
            ? 1.25
            : player.age <= 28
                ? 1
                : 0.75;

    const base =
        player.rating *
        player.rating *
        900;

    const potentialBonus =
        Math.max(
            0,
            player.potential - player.rating
        ) * 100000;

    const reputationBonus =
        player.reputation * 25000;

    return Math.max(
        1000000,
        Math.floor(
            (base +
            potentialBonus +
            reputationBonus) *
            ageFactor
        )
    );
}

function openContract() {

    if (!player) return;

    player.salary =
        2500 + player.rating * 120;

    player.contractYears = 3;

    player.transferValue =
        calculateTransferValue();

    $("contractClubName").textContent =
        "PROJECT XI FC";

    $("contractSalary").textContent =
        money(player.salary);

    $("contractYears").textContent =
        `${player.contractYears} YEARS`;

    $("contractValue").textContent =
        money(player.transferValue);

    showScreen(screens.contract);
}

function offerProfessionalContract() {

    if (
        player.age < 17 ||
        player.rating < 64 ||
        player.clubStatus !== "Youth Player"
    ) {
        return;
    }

    openContract();
}

if ($("signContractButton")) {

    $("signContractButton").addEventListener(
        "click",
        () => {

            player.club =
                "PROJECT XI FC";

            player.clubStatus =
                "Professional Player";

            player.salary =
                2500 + player.rating * 120;

            player.contractYears = 3;

            player.transferValue =
                calculateTransferValue();

            player.money += 5000;

            addLog(`
                <strong>PROFESSIONAL CONTRACT.</strong><br>
                ${player.name} has officially become a professional footballer.<br>
                Salary: ${money(player.salary)} per season.
            `);

            saveGame();
            updateUI();

            playCutscene(
                "PROJECT XI FC",
                "THE FIRST CONTRACT",
                `${player.name} is officially a professional footballer.`,
                () => showScreen(screens.career)
            );
        }
    );
}


/* =========================================================
   CAREER PROGRESSION
========================================================= */

function careerProgression() {

    if (
        player.age >= 17 &&
        player.rating >= 64 &&
        player.clubStatus === "Youth Player"
    ) {

        offerProfessionalContract();

        return;
    }

    if (
        player.age >= 20 &&
        player.rating >= 72 &&
        player.clubStatus === "Professional Player"
    ) {

        player.clubStatus =
            "First Team Player";

        player.salary =
            Math.max(
                player.salary,
                9000
            );

        player.contractYears = 4;

        addLog(`
            <strong>FIRST TEAM BREAKTHROUGH.</strong><br>
            ${player.name} is now a regular first-team player.
        `);

        playCutscene(
            player.club,
            "FIRST TEAM",
            `${player.name} has earned a permanent place in the first team.`
        );

        return;
    }

    if (
        player.age >= 24 &&
        player.rating >= 80 &&
        player.clubStatus === "First Team Player"
    ) {

        player.clubStatus =
            "Star Player";

        player.salary =
            Math.max(
                player.salary,
                30000
            );

        addLog(`
            <strong>STAR PLAYER.</strong><br>
            You have become one of the club's most important players.
        `);
    }

    if (
        player.age >= 28 &&
        player.rating >= 86 &&
        player.reputation >= 60 &&
        player.clubStatus === "Star Player"
    ) {

        player.clubStatus =
            "World-Class Player";

        player.salary =
            Math.max(
                player.salary,
                75000
            );

        addLog(`
            <strong>WORLD CLASS.</strong><br>
            Your name is now known around the football world.
        `);

        playCutscene(
            "THE FOOTBALL WORLD",
            "WORLD CLASS",
            `${player.name} has reached the elite level.`
        );
    }
}


/* =========================================================
   TRANSFERS
========================================================= */

function generateTransferOffers() {

    if (!player) return;

    const clubs =
        TEAMS.filter(
            team =>
                team.name !== player.club &&
                team.rating >= player.rating - 12
        );

    player.transferOffers =
        clubs
            .sort(() => Math.random() - 0.5)
            .slice(0, 4)
            .map(team => {

                const baseValue =
                    calculateTransferValue();

                const offer =
                    Math.floor(
                        baseValue *
                        (random(75, 115) / 100)
                    );

                return {
                    club: team.name,
                    rating: team.rating,
                    offer
                };
            });
}

function renderTransferOffers() {

    const container =
        $("transferOffers");

    if (!container) return;

    container.innerHTML = "";

    if (
        !player.transferOffers ||
        !player.transferOffers.length
    ) {

        container.innerHTML =
            `<div class="feed-item">
                No clubs are currently interested.
            </div>`;

        return;
    }

    player.transferOffers.forEach(offer => {

        const item =
            document.createElement("button");

        item.type = "button";
        item.className = "transfer-offer";

        item.innerHTML = `
            <span>
                <strong>${offer.club}</strong><br>
                OVR ${offer.rating}
            </span>

            <strong>${money(offer.offer)}</strong>
        `;

        item.addEventListener("click", () => {

            openNegotiation(offer);
        });

        container.appendChild(item);
    });
}

if ($("transferButton")) {

    $("transferButton").addEventListener(
        "click",
        () => {

            if (
                !player ||
                player.retired ||
                player.clubStatus === "Youth Player"
            ) {

                toast(
                    "You need to become a professional first."
                );

                return;
            }

            generateTransferOffers();
            renderTransferOffers();

            showScreen(screens.transfer);
        }
    );
}


/* =========================================================
   NEGOTIATION
========================================================= */

let currentTransfer = null;

function openNegotiation(offer) {

    currentTransfer = offer;

    $("negotiationClub").textContent =
        offer.club;

    $("negotiationOffer").textContent =
        money(offer.offer);

    $("negotiationCurrentValue").textContent =
        money(calculateTransferValue());

    $("transferCounter").value =
        "";

    $("negotiationMessage").textContent =
        "The club is waiting for your response.";

    showScreen(screens.negotiation);
}

function completeTransfer(fee) {

    if (!currentTransfer) return;

    const oldClub =
        player.club;

    player.club =
        currentTransfer.club;

    player.clubStatus =
        player.rating >= 86
            ? "World-Class Player"
            : player.rating >= 80
                ? "Star Player"
                : "First Team Player";

    player.salary =
        Math.max(
            player.salary,
            currentTransfer.rating * 500
        );

    player.contractYears = 4;

    player.transferValue =
        calculateTransferValue();

    player.transferOffers = [];

    player.money +=
        Math.floor(
            fee * 0.03
        );

    addLog(`
        <strong>TRANSFER COMPLETED.</strong><br>
        ${player.name} has moved from ${oldClub} to ${currentTransfer.club}.<br>
        Transfer fee: ${money(fee)}.
    `);

    saveGame();
    updateUI();

    playCutscene(
        "TRANSFER WINDOW",
        "DEAL COMPLETED",
        `${player.name} is officially a ${currentTransfer.club} player.`,
        () => showScreen(screens.career)
    );

    currentTransfer = null;
}

if ($("acceptTransferButton")) {

    $("acceptTransferButton").addEventListener(
        "click",
        () => {

            if (!currentTransfer) return;

            completeTransfer(
                currentTransfer.offer
            );
        }
    );
}

if ($("counterOfferButton")) {

    $("counterOfferButton").addEventListener(
        "click",
        () => {

            if (!currentTransfer) return;

            const input =
                Number(
                    $("transferCounter").value
                );

            if (!input || input <= 0) {

                toast(
                    "Enter a valid transfer fee."
                );

                return;
            }

            const value =
                calculateTransferValue();

            const ratio =
                input / currentTransfer.offer;

            if (ratio <= 1.15) {

                $("negotiationMessage").textContent =
                    `They accept your counter offer of ${money(input)}.`;

                completeTransfer(input);

            } else if (ratio <= 1.45) {

                const counter =
                    Math.floor(
                        input * 0.85
                    );

                $("negotiationMessage").textContent =
                    `${currentTransfer.club} counter with ${money(counter)}.`;

                if (confirm(
                    `${currentTransfer.club} counter with ${money(counter)}.\n\nAccept?`
                )) {

                    completeTransfer(counter);
                }

            } else {

                $("negotiationMessage").textContent =
                    `${currentTransfer.club} have rejected the demand.`;

                toast(
                    "Negotiation collapsed."
                );

                addLog(`
                    <strong>TRANSFER COLLAPSED.</strong><br>
                    ${currentTransfer.club} walked away from the negotiation.
                `);
            }

            saveGame();
        }
    );
}

if ($("rejectTransferButton")) {

    $("rejectTransferButton").addEventListener(
        "click",
        () => {

            $("negotiationMessage").textContent =
                "You rejected the transfer.";

            currentTransfer = null;

            setTimeout(() => {

                showScreen(screens.transfer);

            }, 500);
        }
    );
}

if ($("transferBackButton")) {

    $("transferBackButton").addEventListener(
        "click",
        () => showScreen(screens.career)
    );
}


/* =========================================================
   AWARDS
========================================================= */

function updateAwardsUI() {

    if (!player) return;

    if ($("playerOfYearStatus"))
        $("playerOfYearStatus").textContent =
            player.playerOfYear > 0
                ? `${player.playerOfYear}x`
                : "Not won";

    if ($("goldenBootStatus"))
        $("goldenBootStatus").textContent =
            player.goldenBoots > 0
                ? `${player.goldenBoots}x`
                : "Not won";

    if ($("ballonDorStatus"))
        $("ballonDorStatus").textContent =
            player.ballonDor > 0
                ? `${player.ballonDor}x`
                : "Not won";

    if ($("teamTrophiesStatus"))
        $("teamTrophiesStatus").textContent =
            player.trophies;
}

if ($("careerAwardsButton")) {

    $("careerAwardsButton").addEventListener(
        "click",
        () => {

            updateAwardsUI();

            showScreen(screens.awards);
        }
    );
}

if ($("awardsBackButton")) {

    $("awardsBackButton").addEventListener(
        "click",
        () => showScreen(screens.career)
    );
}


/* =========================================================
   SEASON END
========================================================= */

function finishSeason() {

    addLog(`
        <strong>SEASON ${player.season} COMPLETE.</strong><br>
        ${player.seasonGoals} goals •
        ${player.seasonAssists} assists •
        ${player.seasonWins} wins
    `);

    /* League title */

    if (player.seasonPoints >= 25) {

        player.trophies++;
        player.leagueTitles++;

        player.achievements.push(
            `League Champion — Season ${player.season}`
        );

        playCutscene(
            "SEASON FINALE",
            "LEAGUE CHAMPIONS",
            `${player.name} has helped the club lift the league trophy.`
        );
    }

    /* Golden Boot */

    if (player.seasonGoals >= 10) {

        player.goldenBoots++;
        player.trophies++;

        player.achievements.push(
            `Golden Boot — Season ${player.season}`
        );

        addLog(`
            <strong>GOLDEN BOOT.</strong><br>
            ${player.name} finished the season as the leading scorer.
        `);
    }

    /* Player of Year */

    if (
        player.seasonGoals >= 12 &&
        player.seasonAssists >= 6 &&
        player.seasonPoints >= 25 &&
        player.rating >= 78
    ) {

        player.playerOfYear++;
        player.trophies++;

        player.achievements.push(
            `Player of the Year — Season ${player.season}`
        );

        addLog(`
            <strong>PLAYER OF THE YEAR.</strong><br>
            ${player.name} has been named Player of the Year.
        `);
    }

    /* Ballon d'Or */

    if (
        player.rating >= 91 &&
        player.seasonGoals >= 20 &&
        player.seasonAssists >= 10 &&
        player.trophies >= 5 &&
        player.reputation >= 85 &&
        random(1, 100) <= 35
    ) {

        player.ballonDor++;
        player.trophies++;

        player.achievements.push(
            `Ballon d'Or — Season ${player.season}`
        );

        playCutscene(
            "THE FOOTBALL WORLD",
            "BALLON D'OR",
            `${player.name} has won the Ballon d'Or.`
        );
    }

    player.season++;

    player.seasonGoals = 0;
    player.seasonAssists = 0;
    player.seasonMatches = 0;
    player.seasonWins = 0;
    player.seasonPoints = 0;

    player.week = 1;
    player.day = 1;
    player.dayIndex = 0;

    yearlyDevelopment();

    careerProgression();

    nationalTeamCheck();

    generateTransferOffers();

    scheduleNextMatch();

    saveGame();
}


/* =========================================================
   DEVELOPMENT
========================================================= */

function yearlyDevelopment() {

    if (
        player.age <= 25 &&
        player.rating < player.potential
    ) {

        if (random(1, 100) <= 60) {

            player.rating =
                Math.min(
                    player.rating + random(0, 1),
                    player.potential
                );
        }
    }

    if (player.age >= 30) {

        if (random(1, 100) <= 20) {

            player.rating =
                Math.max(
                    60,
                    player.rating - 1
                );
        }
    }

    player.fitness =
        clamp(
            player.fitness + random(5, 15),
            0,
            100
        );

    player.age++;

    addLog(`
        <strong>NEW SEASON.</strong><br>
        Age ${player.age}. OVR ${player.rating}.
    `);
}


/* =========================================================
   NATIONAL TEAM
========================================================= */

function nationalTeamCheck() {

    if (
        player.rating >= 72 &&
        player.reputation >= 20 &&
        !player.nationalTeam
    ) {

        player.nationalTeam = true;
        player.nationalCaps = 1;

        addLog(`
            <strong>NATIONAL TEAM DEBUT.</strong><br>
            ${player.name} has been called up by ${player.country}.
        `);

        playCutscene(
            player.country,
            "NATIONAL TEAM DEBUT",
            `${player.name} has received the call to represent ${player.country}.`
        );

        return;
    }

    if (player.nationalTeam) {

        if (random(1, 100) <= 45) {

            player.nationalCaps++;

            if (random(1, 100) <= 30) {

                player.nationalGoals++;
                player.goals++;

                addLog(`
                    <strong>INTERNATIONAL GOAL.</strong><br>
                    ${player.name} scored for ${player.country}.
                `);
            }
        }
    }
}


/* =========================================================
   ADVANCE DAY
========================================================= */

if ($("advanceDayButton")) {

    $("advanceDayButton").addEventListener(
        "click",
        advanceDay
    );
}

function advanceDay() {

    if (!player || player.retired) return;

    player.day++;
    player.dayIndex++;

    const day =
        player.dayIndex % 7;

    if (day === 5) {

        if (!player.matchScheduled) {
            scheduleNextMatch();
        }

        addLog(`
            <strong>MATCHDAY.</strong><br>
            ${player.club} vs ${player.currentOpponent}.
        `);

    } else if (
        day === 0 ||
        day === 2 ||
        day === 6
    ) {

        player.fitness =
            clamp(
                player.fitness + random(8, 15),
                0,
                100
            );

        addLog(`
            <strong>RECOVERY DAY.</strong><br>
            Fitness recovered naturally.
        `);

    } else {

        addLog(`
            <strong>${getDayName(day)}.</strong><br>
            The football week continues.
        `);
    }

    /* Weekly world update */

    if (day === 6) {

        renderWorldNews();

        player.week++;

        if (player.salary > 0) {

            const weeklySalary =
                Math.floor(
                    player.salary / 52
                );

            player.money += weeklySalary;
            player.careerEarnings += weeklySalary;
        }

        if (player.injured) {

            player.injuryWeeks--;

            if (player.injuryWeeks <= 0) {

                player.injured = false;
                player.injuryWeeks = 0;

                addLog(`
                    <strong>INJURY RECOVERY.</strong><br>
                    Medical staff have cleared you to play.
                `);
            }
        }
    }

    /* Random injury */

    if (
        !player.injured &&
        random(1, 100) <= 3
    ) {

        player.injured = true;
        player.injuryWeeks = random(1, 3);

        addLog(`
            <strong>INJURY SETBACK.</strong><br>
            Recovery time: ${player.injuryWeeks} week(s).
        `);
    }

    /* 52 weeks = one season */

    if (
        player.day > 0 &&
        player.day % 52 === 0
    ) {

        finishSeason();

        if (player.age >= 40) {

            retirePlayer();

            return;
        }
    }

    /* Professional contract */

    if (
        player.age >= 17 &&
        player.clubStatus === "Youth Player" &&
        player.rating >= 64
    ) {

        offerProfessionalContract();
    }

    updateUI();
    saveGame();
}


/* =========================================================
   RETIREMENT
========================================================= */

if ($("retireButton")) {

    $("retireButton").addEventListener(
        "click",
        () => {

            if (!player || player.retired) return;

            if (!confirm(
                "Are you sure you want to retire from professional football?"
            )) {
                return;
            }

            retirePlayer();
        }
    );
}

function retirePlayer() {

    if (!player || player.retired) return;

    player.retired = true;

    addLog(`
        <strong>RETIREMENT.</strong><br>
        ${player.name}'s playing career has ended.
    `);

    updateUI();

    saveGame();

    showScreen(screens.retirement);

    playCutscene(
        "THE FINAL WHISTLE",
        "YOUR PLAYING CAREER IS OVER",
        `${player.name} has retired from professional football.`,
        () => showScreen(screens.retirement)
    );
}


/* =========================================================
   LEGACY
========================================================= */

if ($("beginLegacyButton")) {

    $("beginLegacyButton").addEventListener(
        "click",
        () => {

            if (!player) return;

            showScreen(screens.legacy);
        }
    );
}

if ($("createClubButton")) {

    $("createClubButton").addEventListener(
        "click",
        () => {

            if (!player || !player.retired) return;

            showScreen(screens.clubCreate);
        }
    );
}

if ($("legacyInvestButton")) {

    $("legacyInvestButton").addEventListener(
        "click",
        () => {

            if (!player) return;

            const amount = 25000;

            if (player.money < amount) {

                toast(
                    `You need ${money(amount)} to invest.`
                );

                return;
            }

            player.money -= amount;

            player.reputation =
                clamp(
                    player.reputation + 5,
                    0,
                    100
                );

            addLog(`
                <strong>FOOTBALL INVESTMENT.</strong><br>
                You invested ${money(amount)} into the football world.
            `);

            toast("Investment completed.");

            saveGame();
            updateUI();
        }
    );
}


/* =========================================================
   CLUB CREATION
========================================================= */

if ($("newClubName")) {

    $("newClubName").addEventListener(
        "input",
        () => {

            $("clubPreviewName").textContent =
                $("newClubName").value.trim() ||
                "YOUR CLUB";
        }
    );
}

if ($("newClubCity")) {

    $("newClubCity").addEventListener(
        "input",
        () => {

            $("clubPreviewCity").textContent =
                $("newClubCity").value.trim() ||
                "YOUR CITY";
        }
    );
}

if ($("foundClubButton")) {

    $("foundClubButton").addEventListener(
        "click",
        () => {

            if (!player || !player.retired) return;

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
                    "Complete every club field."
                );

                return;
            }

            const cost = 100000;

            if (player.money < cost) {

                toast(
                    `You need ${money(cost)} to found your club.`
                );

                return;
            }

            player.money -= cost;

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

                squad: [],
                startingXI: [],

                wins: 0,
                draws: 0,
                losses: 0,

                trophies: 0
            };

            generateInitialSquad();

            player.club = name;
            player.clubStatus = "Owner";

            addLog(`
                <strong>CLUB FOUNDED.</strong><br>
                ${name} has officially entered world football.
            `);

            updateOwnerUI();
            updateUI();

            saveGame();

            showScreen(screens.owner);

            playCutscene(
                name,
                "A NEW CLUB IS BORN",
                `From player to owner. ${name} begins its journey.`,
                () => showScreen(screens.owner)
            );
        }
    );
}


/* =========================================================
   OWNER SQUAD
========================================================= */

function randomPlayerName() {

    const first = [
        "Luca",
        "Kai",
        "Mateo",
        "Noah",
        "Elias",
        "Arjun",
        "Leo",
        "Rafael",
        "Kenji",
        "Min",
        "Adam",
        "Daniel"
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
        "Khan",
        "Nakamura"
    ];

    return (
        first[random(0, first.length - 1)] +
        " " +
        last[random(0, last.length - 1)]
    );
}

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

    club.squad = [];

    positions.forEach((position, index) => {

        club.squad.push({

            id:
                Date.now() + index,

            name:
                randomPlayerName(),

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
        });
    });

    club.startingXI =
        club.squad.map(
            p => p.id
        );
}


/* =========================================================
   OWNER UI
========================================================= */

function updateOwnerUI() {

    if (!club) return;

    const set = (id, value) => {

        if ($(id))
            $(id).textContent = value;
    };

    set("ownerClubName", club.name);
    set("ownerClubMotto", `"${club.motto}"`);

    set(
        "ownerFunds",
        money(club.funds)
    );

    set(
        "ownerRating",
        club.rating
    );

    set(
        "ownerReputation",
        club.reputation
    );

    set(
        "ownerStadiumLevel",
        club.stadiumLevel
    );

    set(
        "ownerYouthLevel",
        club.youthLevel
    );

    set(
        "stadiumUpgradeCost",
        money(25000 * club.stadiumLevel)
    );

    set(
        "youthUpgradeCost",
        money(20000 * club.youthLevel)
    );

    set(
        "trainingUpgradeCost",
        money(30000 * club.trainingLevel)
    );

    set(
        "staffUpgradeCost",
        money(15000 * club.staffLevel)
    );

    renderOwnerSquad();
}

function renderOwnerSquad() {

    const squad =
        $("ownerSquad");

    const xi =
        $("startingXI");

    if (!club) return;

    if (squad) {

        squad.innerHTML = "";

        club.squad.forEach(playerData => {

            const item =
                document.createElement("div");

            item.className = "squad-player";

            item.innerHTML = `
                <span>
                    <strong>${playerData.name}</strong><br>
                    ${playerData.position} • Age ${playerData.age}
                </span>

                <strong>
                    ${playerData.rating}
                </strong>
            `;

            squad.appendChild(item);
        });
    }

    if (xi) {

        xi.innerHTML = "";

        club.startingXI.forEach(id => {

            const p =
                club.squad.find(
                    playerData =>
                        playerData.id === id
                );

            if (!p) return;

            const item =
                document.createElement("div");

            item.className = "xi-player";

            item.textContent =
                `${p.position} — ${p.name} (${p.rating})`;

            xi.appendChild(item);
        });
    }
}


/* =========================================================
   OWNER UPGRADES
========================================================= */

function upgradeOwner(type) {

    if (!club) return;

    const data = {

        stadium: {
            level: club.stadiumLevel,
            cost: 25000 * club.stadiumLevel,
            label: "Stadium"
        },

        youth: {
            level: club.youthLevel,
            cost: 20000 * club.youthLevel,
            label: "Youth Academy"
        },

        training: {
            level: club.trainingLevel,
            cost: 30000 * club.trainingLevel,
            label: "Training Centre"
        },

        staff: {
            level: club.staffLevel,
            cost: 15000 * club.staffLevel,
            label: "Staff"
        }
    };

    const item = data[type];

    if (!item) return;

    if (club.funds < item.cost) {

        toast(
            `Not enough funds — ${money(item.cost)} required.`
        );

        return;
    }

    club.funds -= item.cost;

    if (type === "stadium")
        club.stadiumLevel++;

    if (type === "youth")
        club.youthLevel++;

    if (type === "training")
        club.trainingLevel++;

    if (type === "staff")
        club.staffLevel++;

    club.rating =
        clamp(
            club.rating + 2,
            1,
            99
        );

    addLog(`
        <strong>CLUB DEVELOPMENT.</strong><br>
        ${item.label} upgraded to level ${item.level + 1}.
    `);

    toast(
        `${item.label} upgraded.`
    );

    updateOwnerUI();
    saveGame();
}

if ($("upgradeStadiumButton")) {

    $("upgradeStadiumButton").addEventListener(
        "click",
        () => upgradeOwner("stadium")
    );
}

if ($("upgradeYouthButton")) {

    $("upgradeYouthButton").addEventListener(
        "click",
        () => upgradeOwner("youth")
    );
}

if ($("upgradeTrainingButton")) {

    $("upgradeTrainingButton").addEventListener(
        "click",
        () => upgradeOwner("training")
    );
}

if ($("hireStaffButton")) {

    $("hireStaffButton").addEventListener(
        "click",
        () => upgradeOwner("staff")
    );
}


/* =========================================================
   SCOUTING
========================================================= */

if ($("scoutButton")) {

    $("scoutButton").addEventListener(
        "click",
        () => {

            if (!club) return;

            const cost =
                5000 * club.youthLevel;

            if (club.funds < cost) {

                toast(
                    `Scouting costs ${money(cost)}.`
                );

                return;
            }

            club.funds -= cost;

            const prospect = {

                id: Date.now(),

                name:
                    randomPlayerName(),

                age:
                    random(16, 21),

                position:
                    [
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
                        55 + club.youthLevel,
                        68 + club.youthLevel
                    ),

                potential:
                    random(
                        74 + club.youthLevel,
                        88 + club.youthLevel
                    ),

                salary:
                    random(300, 1200),

                contract: 3
            };

            club.squad.push(prospect);

            addLog(`
                <strong>SCOUTING REPORT.</strong><br>
                ${prospect.name}, age ${prospect.age}, ${prospect.position}.<br>
                Rating ${prospect.rating} • Potential ${prospect.potential}.
            `);

            renderScoutResults();

            updateOwnerUI();
            saveGame();

            showScreen(screens.scout);
        }
    );
}

function renderScoutResults() {

    const results =
        $("scoutResults");

    if (!results || !club) return;

    results.innerHTML = "";

    const prospects =
        club.squad
            .filter(
                p =>
                    p.age <= 21 &&
                    p.potential >= 74
            )
            .slice(-8);

    prospects.forEach(p => {

        const item =
            document.createElement("div");

        item.className = "scout-result";

        item.innerHTML = `
            <strong>${p.name}</strong>
            <span>
                ${p.position} • Age ${p.age} •
                OVR ${p.rating} • POT ${p.potential}
            </span>
        `;

        results.appendChild(item);
    });
}

if ($("scoutBackButton")) {

    $("scoutBackButton").addEventListener(
        "click",
        () => showScreen(screens.owner)
    );
}

if ($("youthAcademyButton")) {

    $("youthAcademyButton").addEventListener(
        "click",
        () => {

            if (!club) return;

            toast(
                `Youth Academy Level ${club.youthLevel}`
            );

            showScreen(screens.scout);

            renderScoutResults();
        }
    );
}


/* =========================================================
   OWNER MATCHDAY
========================================================= */

if ($("ownerMatchButton")) {

    $("ownerMatchButton").addEventListener(
        "click",
        () => {

            if (!club) return;

            const strength =
                club.rating +
                random(-10, 10);

            const opponent =
                random(55, 85);

            if (strength > opponent + 5) {

                club.wins++;
                club.funds +=
                    10000 +
                    club.stadiumLevel * 2000;

                club.reputation =
                    clamp(
                        club.reputation + 2,
                        0,
                        100
                    );

                toast("CLUB WIN.");

            } else if (strength < opponent - 5) {

                club.losses++;

                club.reputation =
                    clamp(
                        club.reputation - 1,
                        0,
                        100
                    );

                toast("CLUB LOSS.");

            } else {

                club.draws++;

                club.funds += 4000;

                toast("CLUB DRAW.");
            }

            ownerWeeklyUpdate();

            updateOwnerUI();
            saveGame();
        }
    );
}


/* =========================================================
   OWNER FINANCES
========================================================= */

function ownerWeeklyUpdate() {

    if (!club) return;

    const attendance =
        club.stadiumLevel * 3500;

    const ticketIncome =
        attendance * 8;

    const sponsorIncome =
        club.reputation * 250;

    let wages = 0;

    club.squad.forEach(p => {

        wages +=
            Math.floor(
                p.salary / 52
            );
    });

    club.funds +=
        ticketIncome +
        sponsorIncome -
        wages;

    club.funds =
        Math.max(
            0,
            club.funds
        );
}

if ($("ownerFinanceButton")) {

    $("ownerFinanceButton").addEventListener(
        "click",
        () => {

            if (!club) return;

            const revenue =
                club.stadiumLevel * 3500 * 8 +
                club.reputation * 250;

            let wages = 0;

            club.squad.forEach(p => {

                wages +=
                    Math.floor(
                        p.salary / 52
                    );
            });

            $("financeFunds").textContent =
                money(club.funds);

            $("financeRevenue").textContent =
                money(revenue);

            $("financeWages").textContent =
                money(wages);

            $("financeBalance").textContent =
                money(revenue - wages);

            $("financeLog").innerHTML = `
                <div class="log-entry">
                    <strong>WEEKLY FINANCIAL REPORT.</strong><br>
                    Revenue: ${money(revenue)}<br>
                    Wages: ${money(wages)}<br>
                    Net: ${money(revenue - wages)}
                </div>
            `;

            showScreen(screens.finance);
        }
    );
}

if ($("financeBackButton")) {

    $("financeBackButton").addEventListener(
        "click",
        () => showScreen(screens.owner)
    );
}


/* =========================================================
   MENU NAVIGATION
========================================================= */

if ($("logoButton")) {

    $("logoButton").addEventListener(
        "click",
        () => showScreen(screens.menu)
    );
}

if ($("legacyMenuButton")) {

    $("legacyMenuButton").addEventListener(
        "click",
        () => {

            if (!player) {

                toast("Start a career first.");

                return;
            }

            if (player.retired) {

                showScreen(
                    club
                        ? screens.owner
                        : screens.legacy
                );

            } else {

                toast(
                    "Legacy mode unlocks after retirement."
                );
            }
        }
    );
}

if ($("continueButton")) {

    $("continueButton").addEventListener(
        "click",
        () => {

            if (!player) {

                showScreen(screens.create);

                return;
            }

            if (player.retired && club) {

                updateOwnerUI();
                showScreen(screens.owner);

            } else if (player.retired) {

                showScreen(screens.legacy);

            } else {

                updateUI();
                showScreen(screens.career);
            }
        }
    );
}


/* =========================================================
   SAVE / SETTINGS
========================================================= */

function saveGame() {

    if (!player) return;

    localStorage.setItem(
        SAVE_KEY,
        JSON.stringify({
            player,
            club
        })
    );
}

function loadGame() {

    const saved =
        localStorage.getItem(
            SAVE_KEY
        );

    if (!saved) return;

    try {

        const data =
            JSON.parse(saved);

        player =
            data.player || null;

        club =
            data.club || null;

        if (!player) return;

        updateUI();

        if (club) {
            updateOwnerUI();
        }

    } catch (error) {

        console.error(
            "Save loading failed:",
            error
        );

        localStorage.removeItem(SAVE_KEY);
    }
}

if ($("saveGameButton")) {

    $("saveGameButton").addEventListener(
        "click",
        () => {

            saveGame();

            toast(
                "GAME SAVED."
            );
        }
    );
}

if ($("resetGameButton")) {

    $("resetGameButton").addEventListener(
        "click",
        () => {

            if (!confirm(
                "RESET YOUR ENTIRE PROJECT XI LIFE?"
            )) {
                return;
            }

            localStorage.removeItem(
                SAVE_KEY
            );

            player = null;
            club = null;

            location.reload();
        }
    );
}


/* =========================================================
   INITIALIZE
========================================================= */

renderAcademies();

loadGame();

if (player) {

    updateUI();

    if (club) {
        updateOwnerUI();
    }

} else {

    showScreen(screens.menu);
}

renderWorldNews();

console.log(
    "PROJECT XI | FOOTBALL LIFE loaded successfully."
);
