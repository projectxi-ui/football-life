const SAVE_KEY = "projectXI_football_life_v5";

let player = null;
let club = null;

const $ = id => document.getElementById(id);

const screens = {
    menu: $("menuScreen"),
    start: $("startScreen"),
    career: $("careerScreen"),
    legacy: $("legacyScreen"),
    club: $("clubScreen"),
    owner: $("ownerScreen")
};


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
    return "€" + Math.floor(value).toLocaleString();
}

function showScreen(screen) {
    Object.values(screens).forEach(s => {
        if (s) s.classList.add("hidden");
    });

    if (screen) screen.classList.remove("hidden");
}

function addLog(text) {
    if (!player || !$("careerLog")) return;

    const entry = document.createElement("div");
    entry.className = "log-entry";
    entry.innerHTML = text;

    $("careerLog").prepend(entry);
}

function getPositionName(pos) {
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

    return names[pos] || pos;
}

function todayName() {
    const days = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
    ];

    return days[player.dayIndex % 7];
}


/* =========================================================
   CINEMATIC CUTSCENES
========================================================= */

let currentCutscene = null;

function playCutscene(location, title, text, callback) {

    currentCutscene = callback || null;

    if (!$("cutscene")) return;

    $("cutsceneLocation").textContent = location;
    $("cutsceneTitle").textContent = title;
    $("cutsceneText").textContent = text;

    $("cutscene").classList.remove("hidden");
}

if ($("cutsceneNext")) {
    $("cutsceneNext").addEventListener("click", () => {

        $("cutscene").classList.add("hidden");

        if (currentCutscene) {
            const callback = currentCutscene;
            currentCutscene = null;
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

const OPPONENTS = [
    "Club de Aderis",
    "Ravenholm FC",
    "Eastport City",
    "Silvergate Athletic",
    "Westhaven FC",
    "Royal Santoro",
    "Northstar United"
];


/* =========================================================
   WORLD FOOTBALL
========================================================= */

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

function generateWorldNews() {

    const a =
        WORLD_TEAMS[random(0, WORLD_TEAMS.length - 1)];

    let b =
        WORLD_TEAMS[random(0, WORLD_TEAMS.length - 1)];

    while (b === a) {
        b =
            WORLD_TEAMS[random(0, WORLD_TEAMS.length - 1)];
    }

    const events = [
        `${a} defeated ${b} in a dramatic league match.`,
        `${b} have opened talks with a highly-rated young midfielder.`,
        `${a} have announced a new manager.`,
        `${a}'s star striker is expected to miss several weeks.`,
        `${b} have reached the cup semi-final.`,
        `${a} are reportedly preparing a major transfer bid.`,
        `${b} have moved into the top four.`,
        `${a} have extended the contract of their captain.`
    ];

    return events[random(0, events.length - 1)];
}

function addWorldNews(text) {

    addLog(
        `<strong>WORLD FOOTBALL.</strong> ${text}`
    );
}


/* =========================================================
   UI
========================================================= */

function updateUI() {

    if (!player) return;

    if ($("displayName"))
        $("displayName").textContent = player.name;

    if ($("displayDetails"))
        $("displayDetails").textContent =
            `${player.age} • ${getPositionName(player.position)} • ${player.country}`;

    if ($("seasonDisplay"))
        $("seasonDisplay").textContent =
            `Season ${player.season}`;

    if ($("ageStat"))
        $("ageStat").textContent = player.age;

    if ($("ratingStat"))
        $("ratingStat").textContent = player.rating;

    if ($("fitnessStat"))
        $("fitnessStat").textContent = player.fitness;

    if ($("happinessStat"))
        $("happinessStat").textContent = player.happiness;

    if ($("moneyStat"))
        $("moneyStat").textContent = money(player.money);

    if ($("reputationStat"))
        $("reputationStat").textContent = player.reputation;

    if ($("clubName"))
        $("clubName").textContent = player.club;

    if ($("clubStatus"))
        $("clubStatus").textContent =
            player.clubStatus;

    if ($("playerAvatar"))
        $("playerAvatar").textContent =
            player.name.substring(0, 2).toUpperCase();

    if ($("topStatus"))
        $("topStatus").textContent =
            player.retired
                ? "OWNER MODE"
                : "CAREER MODE";

    updateCalendarUI();
}


/* =========================================================
   PLAYER CREATION
========================================================= */

$("startCareerBtn").addEventListener("click", () => {

    const name = $("playerName").value.trim();
    const country = $("playerCountry").value.trim();
    const position = $("playerPosition").value;
    const age = Number($("playerAge").value);

    if (!name || !country) {

        $("startError").textContent =
            "Enter your player name and country.";

        return;
    }

    player = {

        name,
        country,
        position,
        age,

        season: 1,

        day: 1,
        dayIndex: 0,

        rating: 58,
        potential: random(74, 86),

        fitness: 100,
        happiness: 80,

        money: 2000,
        reputation: 5,

        club: "PROJECT XI Academy",
        clubStatus: "Youth Player",

        goals: 0,
        assists: 0,

        seasonGoals: 0,
        seasonAssists: 0,

        trophies: 0,

        leagueTitles: 0,
        cupTitles: 0,

        goldenBoots: 0,
        playerOfYear: 0,
        ballonDor: 0,

        careerEarnings: 0,

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

        seasonMatches: 0,
        seasonWins: 0,
        seasonPoints: 0,

        achievements: [],

        transferInterest: [],

        transferWindow: false
    };

    $("careerLog").innerHTML = "";

    addLog(
        `<strong>AGE ${player.age} — DAY 1</strong><br>
        Your football journey begins at PROJECT XI Academy.`
    );

    updateUI();
    saveGame();

    showScreen(screens.career);

    playCutscene(
        "PROJECT XI ACADEMY",
        "THE JOURNEY BEGINS",
        `At ${player.age}, ${player.name} has one goal: become a professional footballer.`,
        () => {

            $("eventText").textContent =
                "Your first week starts now.";

            scheduleNextMatch();
        }
    );
});


/* =========================================================
   WEEKLY CALENDAR
========================================================= */

function updateCalendarUI() {

    let calendar = document.getElementById("weeklyCalendar");

    if (!calendar || !player) return;

    calendar.innerHTML = "";

    const days = [
        "MON",
        "TUE",
        "WED",
        "THU",
        "FRI",
        "SAT",
        "SUN"
    ];

    days.forEach((day, index) => {

        const div = document.createElement("div");

        div.className = "calendar-day";

        if (index === player.dayIndex % 7) {
            div.classList.add("current");
        }

        let activity = "Rest";

        if (index === 0 || index === 1) {
            activity = "Training";
        }

        if (index === 2) {
            activity = "Recovery";
        }

        if (index === 3) {
            activity = "Training";
        }

        if (index === 4) {
            activity = "Rest";
        }

        if (index === 5) {
            activity = player.matchScheduled
                ? `MATCH vs ${player.currentOpponent}`
                : "Matchday";
        }

        if (index === 6) {
            activity = "Recovery";
        }

        div.innerHTML = `
            <div class="calendar-day-name">${day}</div>
            <div class="calendar-day-event">${activity}</div>
        `;

        calendar.appendChild(div);
    });
}


/* =========================================================
   MATCH SCHEDULING
========================================================= */

function scheduleNextMatch() {

    if (!player || player.retired) return;

    player.currentOpponent =
        OPPONENTS[random(0, OPPONENTS.length - 1)];

    player.matchScheduled = true;

    addLog(
        `<strong>FIXTURE CONFIRMED.</strong><br>
        Saturday — PROJECT XI vs ${player.currentOpponent}.`
    );

    if ($("eventText")) {

        $("eventText").textContent =
            `Next match: PROJECT XI vs ${player.currentOpponent}.`;
    }

    updateCalendarUI();
}


/* =========================================================
   TRAINING
========================================================= */

$("trainBtn").addEventListener("click", () => {

    if (!player || player.retired) return;

    if (player.injured) {

        $("eventText").textContent =
            `You are injured. ${player.injuryWeeks} week(s) remaining.`;

        return;
    }

    /*
       IMPORTANT:
       TRAINING NOW RESTORES FITNESS.
    */

    const fitnessGain = random(3, 8);

    player.fitness =
        clamp(
            player.fitness + fitnessGain,
            0,
            100
        );

    let development = false;

    if (
        player.rating < player.potential &&
        player.age <= 25 &&
        random(1, 100) <= 28
    ) {

        player.rating++;

        development = true;
    }

    if (development) {

        addLog(
            `<strong>TRAINING BREAKTHROUGH.</strong><br>
            Your hard work paid off. Rating increased to ${player.rating}.<br>
            Fitness recovered +${fitnessGain}.`
        );

        $("eventText").textContent =
            `Breakthrough! Rating ${player.rating}. Fitness +${fitnessGain}.`;

    } else {

        addLog(
            `<strong>TRAINING SESSION.</strong><br>
            You worked on your game and recovered ${fitnessGain} fitness.`
        );

        $("eventText").textContent =
            `Training complete. Fitness +${fitnessGain}.`;
    }

    updateUI();
    saveGame();
});


/* =========================================================
   REST / LIFE
========================================================= */

$("lifeBtn").addEventListener("click", () => {

    if (!player || player.retired) return;

    if (player.injured) {

        player.injuryWeeks--;

        player.fitness =
            clamp(player.fitness + 15, 0, 100);

        if (player.injuryWeeks <= 0) {

            player.injured = false;
            player.injuryWeeks = 0;

            addLog(
                `<strong>MEDICAL CLEARANCE.</strong><br>
                You have recovered and can return to football.`
            );

        } else {

            addLog(
                `<strong>RECOVERY DAY.</strong><br>
                ${player.injuryWeeks} week(s) remain.`
            );
        }

    } else {

        const recovery = random(10, 18);

        player.fitness =
            clamp(player.fitness + recovery, 0, 100);

        player.happiness =
            clamp(player.happiness + random(2, 6), 0, 100);

        addLog(
            `<strong>REST DAY.</strong><br>
            You recovered ${recovery} fitness and cleared your mind.`
        );

        $("eventText").textContent =
            `Recovery complete. Fitness +${recovery}.`;
    }

    updateUI();
    saveGame();
});


/* =========================================================
   MATCH
========================================================= */

$("matchBtn").addEventListener("click", () => {

    if (!player || player.retired) return;

    if (player.injured) {

        $("eventText").textContent =
            "You cannot play while injured.";

        return;
    }

    if (!player.matchScheduled) {

        $("eventText").textContent =
            "There is no scheduled match today.";

        return;
    }

    if (player.fitness < 35) {

        $("eventText").textContent =
            "Your fitness is too low to play.";

        return;
    }

    const opponent =
        player.currentOpponent;

    const opponentData =
        TEAMS.find(t => t.name === opponent);

    const opponentRating =
        opponentData
            ? opponentData.rating
            : random(60, 90);

    player.fitness =
        clamp(
            player.fitness - random(8, 12),
            0,
            100
        );

    player.seasonMatches++;

    let performance =
        player.rating +
        random(-15, 15);

    performance +=
        Math.floor(
            (player.fitness - 50) / 8
        );

    let goals = 0;
    let assists = 0;

    if (performance >= 90) {

        goals = random(1, 3);
        assists = random(0, 2);

    } else if (performance >= 75) {

        goals = random(0, 2);
        assists = random(0, 1);

    } else if (performance >= 60) {

        goals = random(0, 1);
        assists = random(0, 1);
    }

    player.goals += goals;
    player.assists += assists;

    player.seasonGoals += goals;
    player.seasonAssists += assists;

    const teamStrength =
        player.rating + random(-8, 8);

    const opponentStrength =
        opponentRating + random(-8, 8);

    let result;

    if (teamStrength > opponentStrength + 5) {

        result = "WIN";
        player.seasonWins++;
        player.seasonPoints += 3;

    } else if (teamStrength < opponentStrength - 5) {

        result = "LOSS";

    } else {

        result = "DRAW";
        player.seasonPoints += 1;
    }

    const rating =
        clamp(
            6 +
            Math.round(
                (performance - 50) / 10
            ) / 10,
            5.0,
            9.8
        );

    const pay =
        player.salary > 0
            ? Math.floor(player.salary / 4)
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

    if (result === "WIN") {

        player.happiness =
            clamp(
                player.happiness + 4,
                0,
                100
            );
    }

    addLog(
        `<strong>FULL TIME — PROJECT XI ${result}</strong><br>
        PROJECT XI vs ${opponent}<br>
        ${goals} goal(s) • ${assists} assist(s) • Match rating ${rating.toFixed(1)}<br>
        Match earnings: ${money(pay)}`
    );

    $("eventText").textContent =
        `${result} vs ${opponent}. ${goals} goal(s), ${assists} assist(s).`;

    player.matchScheduled = false;
    player.currentOpponent = null;

    checkCareerMilestones();

    if (player.seasonMatches >= 12) {
        finishSeason();
    }

    updateUI();
    saveGame();
});


/* =========================================================
   CAREER MILESTONES
========================================================= */

function checkCareerMilestones() {

    if (
        player.goals >= 1 &&
        !player.achievements.includes("First Professional Goal") &&
        player.clubStatus !== "Youth Player"
    ) {

        player.achievements.push(
            "First Professional Goal"
        );

        playCutscene(
            "MATCHDAY",
            "FIRST PROFESSIONAL GOAL",
            `${player.name} has scored the first professional goal of the career.`,
            () => updateUI()
        );
    }
}


/* =========================================================
   SEASON END
========================================================= */

function finishSeason() {

    addLog(
        `<strong>SEASON ${player.season} COMPLETE.</strong><br>
        ${player.seasonGoals} goals •
        ${player.seasonAssists} assists •
        ${player.seasonWins} wins`
    );

    /*
       LEAGUE TITLE
    */

    const titleChance =
        player.seasonPoints >= 25;

    if (titleChance) {

        player.trophies++;
        player.leagueTitles++;

        player.achievements.push(
            `League Champion — Season ${player.season}`
        );

        playCutscene(
            "SEASON FINALE",
            "LEAGUE CHAMPIONS",
            `${player.name} has helped the club lift the league trophy.`,
            () => updateUI()
        );
    }


    /*
       GOLDEN BOOT
    */

    if (player.seasonGoals >= 10) {

        player.goldenBoots++;

        player.trophies++;

        player.achievements.push(
            `Golden Boot — Season ${player.season}`
        );

        addLog(
            `<strong>GOLDEN BOOT.</strong><br>
            ${player.name} finished the season as the league's leading scorer.`
        );

        playCutscene(
            "AWARDS NIGHT",
            "GOLDEN BOOT",
            `${player.name} has won the Golden Boot after leading the scoring charts.`,
            () => updateUI()
        );
    }


    /*
       PLAYER OF THE YEAR
    */

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

        playCutscene(
            "AWARDS NIGHT",
            "PLAYER OF THE YEAR",
            `${player.name} has been named Player of the Year.`,
            () => updateUI()
        );
    }


    /*
       BALLON D'OR
       VERY HARD TO WIN.
    */

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
            `${player.name} has won the most prestigious individual award in football.`,
            () => updateUI()
        );
    }


    /*
       NEW SEASON
    */

    player.season++;

    player.seasonGoals = 0;
    player.seasonAssists = 0;

    player.seasonMatches = 0;
    player.seasonWins = 0;
    player.seasonPoints = 0;

    player.day = 1;
    player.dayIndex = 0;

    yearlyDevelopment();
    transferWindowCheck();
    nationalTeamCheck();

    scheduleNextMatch();
}


/* =========================================================
   SLOW DEVELOPMENT
========================================================= */

function yearlyDevelopment() {

    if (
        player.age <= 24 &&
        player.rating < player.potential
    ) {

        if (random(1, 100) <= 55) {

            player.rating +=
                random(0, 1);

            player.rating =
                Math.min(
                    player.rating,
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

    addLog(
        `<strong>NEW SEASON.</strong><br>
        You are now ${player.age}. Rating: ${player.rating}.`
    );

    careerProgression();
}


/* =========================================================
   CONTRACTS
========================================================= */

function offerProfessionalContract() {

    if (
        player.clubStatus !== "Youth Player" ||
        player.age < 17 ||
        player.rating < 64
    ) {
        return;
    }

    player.clubStatus =
        "Professional Player";

    player.club =
        "PROJECT XI FC";

    player.salary =
        2500 + player.rating * 120;

    player.contractYears = 3;

    player.money += 5000;

    addLog(
        `<strong>PROFESSIONAL CONTRACT.</strong><br>
        PROJECT XI FC have offered you a ${player.contractYears}-year contract.<br>
        Salary: ${money(player.salary)} per season.`
    );

    playCutscene(
        "PROJECT XI FC",
        "THE FIRST CONTRACT",
        `${player.name} is officially a professional footballer.`,
        () => updateUI()
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

        addLog(
            `<strong>FIRST TEAM BREAKTHROUGH.</strong><br>
            You are now a regular first-team player.`
        );

        playCutscene(
            player.club,
            "FIRST TEAM",
            `${player.name} has earned a permanent place in the first team.`,
            () => updateUI()
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

        addLog(
            `<strong>STAR PLAYER.</strong><br>
            You have become one of the club's most important players.`
        );
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

        addLog(
            `<strong>WORLD CLASS.</strong><br>
            Your name is now known around the football world.`
        );

        playCutscene(
            "THE FOOTBALL WORLD",
            "WORLD CLASS",
            `${player.name} has reached the elite level.`,
            () => updateUI()
        );
    }
}


/* =========================================================
   TRANSFER WINDOWS
========================================================= */

function transferWindowCheck() {

    player.transferWindow = true;

    if (
        player.clubStatus === "Youth Player" ||
        player.rating < 65
    ) {
        return;
    }

    const interested =
        TEAMS
            .filter(t =>
                t.name !== player.club &&
                t.rating >= player.rating - 10
            )
            .sort(() => Math.random() - .5)
            .slice(0, 3);

    player.transferInterest =
        interested.map(team => team.name);

    interested.forEach(team => {

        addLog(
            `<strong>TRANSFER NEWS.</strong><br>
            ${team.name} are monitoring ${player.name}.`
        );
    });
}


/* =========================================================
   TRANSFER OFFER
========================================================= */

function transferOffer() {

    if (
        !player ||
        player.retired ||
        player.clubStatus === "Youth Player"
    ) {
        return;
    }

    if (!player.transferInterest.length) {
        transferWindowCheck();
    }

    if (!player.transferInterest.length) {

        $("eventText").textContent =
            "No clubs are currently making offers.";

        return;
    }

    const teamName =
        player.transferInterest[
            random(
                0,
                player.transferInterest.length - 1
            )
        ];

    const team =
        TEAMS.find(t => t.name === teamName);

    const value =
        Math.max(
            1000000,
            player.rating *
            player.rating *
            random(700, 1300)
        );

    showTransferOffer(team, value);
}


/* =========================================================
   TRANSFER NEGOTIATION
========================================================= */

function showTransferOffer(team, value) {

    const response =
        prompt(
            `${team.name} want to sign you.\n\n` +
            `Estimated transfer value: ${money(value)}\n\n` +
            `Enter your requested transfer fee:`
        );

    if (response === null) return;

    const requested =
        Number(
            response
                .replace(/[^\d]/g, "")
        );

    if (!requested || requested <= 0) {

        $("eventText").textContent =
            "Negotiation cancelled.";

        return;
    }

    const difference =
        requested / value;

    if (difference <= 1.25) {

        const oldClub =
            player.club;

        player.club =
            team.name;

        player.money +=
            Math.floor(
                requested * 0.03
            );

        player.salary =
            Math.max(
                player.salary,
                team.rating * 500
            );

        player.contractYears = 4;

        player.transferInterest = [];

        addLog(
            `<strong>TRANSFER COMPLETED.</strong><br>
            ${player.name} has moved from ${oldClub} to ${team.name}.<br>
            Transfer fee agreed: ${money(requested)}.`
        );

        playCutscene(
            "TRANSFER WINDOW",
            "DEAL COMPLETED",
            `${player.name} is officially a ${team.name} player.`,
            () => updateUI()
        );

    } else if (difference <= 1.6) {

        const counter =
            Math.floor(
                requested * 0.85
            );

        const accept =
            confirm(
                `${team.name} rejected the original demand.\n\n` +
                `They counter with ${money(counter)}.\n\n` +
                `Accept?`
            );

        if (accept) {

            player.club =
                team.name;

            player.money +=
                Math.floor(
                    counter * 0.03
                );

            player.salary =
                Math.max(
                    player.salary,
                    team.rating * 500
                );

            player.contractYears = 4;

            addLog(
                `<strong>TRANSFER AGREEMENT.</strong><br>
                Negotiations succeeded after a counter-offer.<br>
                Final fee: ${money(counter)}.`
            );

            playCutscene(
                "TRANSFER WINDOW",
                "NEGOTIATION WON",
                `${player.name} has completed the transfer after tough negotiations.`,
                () => updateUI()
            );
        }

    } else {

        addLog(
            `<strong>TRANSFER COLLAPSED.</strong><br>
            ${team.name} walked away after the requested fee became too high.`
        );

        $("eventText").textContent =
            `${team.name} have ended negotiations.`;
    }

    updateUI();
    saveGame();
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

        addLog(
            `<strong>NATIONAL TEAM DEBUT.</strong><br>
            ${player.name} has been called up by ${player.country}.`
        );

        playCutscene(
            player.country,
            "NATIONAL TEAM DEBUT",
            `${player.name} has received the call to represent the nation.`,
            () => updateUI()
        );
    }

    if (player.nationalTeam) {

        if (random(1, 100) <= 45) {

            player.nationalCaps++;

            if (random(1, 100) <= 30) {

                player.nationalGoals++;

                player.goals++;

                addLog(
                    `<strong>INTERNATIONAL GOAL.</strong><br>
                    ${player.name} scored for ${player.country}.`
                );
            }
        }
    }
}


/* =========================================================
   DAY ADVANCEMENT
========================================================= */

$("ageUpBtn").addEventListener("click", () => {

    if (!player || player.retired) return;

    advanceDay();
});


function advanceDay() {

    player.day++;
    player.dayIndex++;

    const day =
        player.dayIndex % 7;

    /*
       Saturday = matchday
    */

    if (day === 5) {

        if (!player.matchScheduled) {
            scheduleNextMatch();
        }

        addLog(
            `<strong>MATCHDAY.</strong><br>
            Today: PROJECT XI vs ${player.currentOpponent}.`
        );

    } else if (day === 0 || day === 2 || day === 6) {

        player.fitness =
            clamp(
                player.fitness + random(8, 15),
                0,
                100
            );

        addLog(
            `<strong>RECOVERY DAY.</strong><br>
            Your body recovered naturally.`
        );

    } else {

        addLog(
            `<strong>${todayName().toUpperCase()}.</strong><br>
            The football week continues.`
        );
    }

    /*
       Every 7 days = weekly world update.
    */

    if (day === 6) {

        addWorldNews(
            generateWorldNews()
        );

        /*
           Salary paid weekly.
        */

        if (player.salary > 0) {

            const weeklySalary =
                Math.floor(
                    player.salary / 52
                );

            player.money +=
                weeklySalary;

            player.careerEarnings +=
                weeklySalary;
        }

        /*
           Injury recovery.
        */

        if (player.injured) {

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
    }

    /*
       Random injury.
    */

    if (
        !player.injured &&
        random(1, 100) <= 3
    ) {

        player.injured = true;
        player.injuryWeeks =
            random(1, 3);

        addLog(
            `<strong>INJURY SETBACK.</strong><br>
            Recovery time: ${player.injuryWeeks} week(s).`
        );
    }

    /*
       Age after 52 weeks.
    */

    if (
        player.day % 52 === 0
    ) {

        player.season++;

        player.seasonGoals = 0;
        player.seasonAssists = 0;
        player.seasonMatches = 0;
        player.seasonWins = 0;
        player.seasonPoints = 0;

        yearlyDevelopment();

        if (player.age >= 40) {

            retirePlayer();
            return;
        }

        finishSeason();
    }

    updateUI();
    saveGame();
}


/* =========================================================
   RETIREMENT
========================================================= */

function retirePlayer() {

    player.retired = true;

    addLog(
        `<strong>RETIREMENT.</strong><br>
        After ${player.age} years of football, your playing career has ended.`
    );

    if ($("legacyGoals"))
        $("legacyGoals").textContent =
            player.goals;

    if ($("legacyAssists"))
        $("legacyAssists").textContent =
            player.assists;

    if ($("legacyTrophies"))
        $("legacyTrophies").textContent =
            player.trophies;

    if ($("legacyMoney"))
        $("legacyMoney").textContent =
            money(player.money);

    renderAchievements();

    saveGame();

    showScreen(screens.legacy);

    playCutscene(
        "THE FINAL WHISTLE",
        "YOUR PLAYING CAREER IS OVER",
        `${player.name} has retired from professional football.`,
        () => showScreen(screens.legacy)
    );
}


/* =========================================================
   ACHIEVEMENTS
========================================================= */

function renderAchievements() {

    const list =
        $("achievementList");

    if (!list || !player) return;

    list.innerHTML = "";

    if (!player.achievements.length) {

        list.innerHTML =
            `<div class="achievement">
                No major awards yet.
            </div>`;

        return;
    }

    player.achievements
        .forEach(achievement => {

            const div =
                document.createElement("div");

            div.className =
                "achievement";

            div.textContent =
                "🏆 " + achievement;

            list.appendChild(div);
        });
}


/* =========================================================
   OWNER CLUB CREATION
========================================================= */

$("createClubBtn").addEventListener("click", () => {

    if (!player || !player.retired) return;

    showScreen(screens.club);
});


$("confirmClubBtn").addEventListener("click", () => {

    const name =
        $("newClubName").value.trim();

    const city =
        $("newClubCity").value.trim();

    const stadium =
        $("newStadiumName").value.trim();

    const motto =
        $("newClubMotto").value.trim();

    if (!name || !city || !stadium || !motto) {

        $("clubError").textContent =
            "Complete every field before founding your club.";

        return;
    }

    if (player.money < 100000) {

        $("clubError").textContent =
            "You need at least €100,000 to found your club.";

        return;
    }

    player.money -= 100000;

    club = {

        name,
        city,
        stadium,
        motto,

        funds: 100000,

        reputation: 10,

        leagueLevel: 1,

        academy: 1,
        training: 1,
        scouting: 1,
        stadiumLevel: 1,
        medical: 1,

        staff: 1,

        squad: [],

        startingXI: [],

        wins: 0,
        losses: 0,
        draws: 0,

        trophies: 0
    };

    generateInitialSquad();

    player.club =
        name;

    player.clubStatus =
        "Owner";

    addLog(
        `<strong>CLUB FOUNDED.</strong><br>
        ${name} has officially entered world football.`
    );

    updateOwnerUI();

    saveGame();

    showScreen(screens.owner);

    playCutscene(
        name,
        "A NEW CLUB IS BORN",
        `From player to owner. ${name} begins its journey.`,
        () => showScreen(screens.owner)
    );
});


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

    club.squad = [];

    positions.forEach((position, index) => {

        club.squad.push({

            id:
                Date.now() +
                index,

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
        "Min"
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
        "Ricci"
    ];

    return (
        first[random(0, first.length - 1)]
        + " " +
        last[random(0, last.length - 1)]
    );
}


/* =========================================================
   OWNER UI
========================================================= */

function updateOwnerUI() {

    if (!club) return;

    if ($("ownerClubName"))
        $("ownerClubName").textContent =
            club.name;

    if ($("ownerClubInfo"))
        $("ownerClubInfo").textContent =
            `${club.city} • ${club.stadium}`;

    if ($("ownerMotto"))
        $("ownerMotto").textContent =
            `"${club.motto}"`;

    if ($("clubMoney"))
        $("clubMoney").textContent =
            money(club.funds);

    if ($("academyLevel"))
        $("academyLevel").textContent =
            club.academy;

    if ($("trainingLevel"))
        $("trainingLevel").textContent =
            club.training;

    if ($("scoutLevel"))
        $("scoutLevel").textContent =
            club.scouting;

    if ($("stadiumLevel"))
        $("stadiumLevel").textContent =
            club.stadiumLevel;
}


/* =========================================================
   OWNER UPGRADES
========================================================= */

function upgradeClub(type) {

    if (!club) return;

    const costs = {

        academy:
            15000 * club.academy,

        training:
            20000 * club.training,

        scouting:
            25000 * club.scouting,

        stadium:
            30000 * club.stadiumLevel,

        medical:
            18000 * club.medical,

        staff:
            22000 * club.staff
    };

    const cost =
        costs[type];

    if (club.funds < cost) {

        alert(
            `Not enough club funds.\nCost: ${money(cost)}`
        );

        return;
    }

    club.funds -= cost;

    if (type === "stadium") {
        club.stadiumLevel++;
    } else {
        club[type]++;
    }

    const names = {

        academy:
            "Youth Academy",

        training:
            "Training Ground",

        scouting:
            "Scouting Network",

        stadium:
            "Stadium",

        medical:
            "Medical Centre",

        staff:
            "Club Staff"
    };

    addLog(
        `<strong>CLUB DEVELOPMENT.</strong><br>
        ${names[type]} has been upgraded.`
    );

    updateOwnerUI();
    saveGame();
}


if ($("upgradeAcademyBtn"))
    $("upgradeAcademyBtn")
        .addEventListener(
            "click",
            () => upgradeClub("academy")
        );

if ($("upgradeTrainingBtn"))
    $("upgradeTrainingBtn")
        .addEventListener(
            "click",
            () => upgradeClub("training")
        );

if ($("upgradeScoutBtn"))
    $("upgradeScoutBtn")
        .addEventListener(
            "click",
            () => upgradeClub("scouting")
        );

if ($("upgradeStadiumBtn"))
    $("upgradeStadiumBtn")
        .addEventListener(
            "click",
            () => upgradeClub("stadium")
        );


/* =========================================================
   SCOUTING
========================================================= */

function scoutPlayer() {

    if (!club) return;

    const cost =
        5000 * club.scouting;

    if (club.funds < cost) {

        alert(
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
            ][
                random(0, 8)
            ],

        rating:
            random(
                52 + club.scouting * 2,
                68 + club.scouting * 2
            ),

        potential:
            random(
                72 + club.scouting,
                88 + club.scouting
            ),

        salary:
            random(300, 1200),

        contract:
            3
    };

    club.squad.push(prospect);

    addLog(
        `<strong>SCOUTING REPORT.</strong><br>
        ${prospect.name}, age ${prospect.age}, ${prospect.position}.<br>
        Rating ${prospect.rating} • Potential ${prospect.potential}.`
    );

    updateOwnerUI();
    saveGame();
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

    club.squad.forEach(player => {

        wages +=
            Math.floor(
                player.salary / 52
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

    club.reputation =
        clamp(
            club.reputation +
            random(-1, 2),
            0,
            100
        );
}


/* =========================================================
   SAVE / LOAD
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


if ($("saveBtn")) {

    $("saveBtn")
        .addEventListener(
            "click",
            () => {

                saveGame();

                if ($("eventText"))
                    $("eventText").textContent =
                        "Career saved successfully.";
            }
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

        if (player.retired) {

            renderAchievements();

            if (club) {

                updateOwnerUI();
                showScreen(screens.owner);

            } else {

                showScreen(screens.legacy);
            }

        } else {

            showScreen(screens.career);
        }

    } catch (error) {

        console.error(
            "Save load failed:",
            error
        );
    }
}


/* =========================================================
   MENU
========================================================= */

if ($("logoBtn")) {

    $("logoBtn")
        .addEventListener(
            "click",
            () => showScreen(screens.menu)
        );
}

if ($("menuBtn")) {

    $("menuBtn")
        .addEventListener(
            "click",
            () => showScreen(screens.menu)
        );
}

if ($("legacyMenuBtn")) {

    $("legacyMenuBtn")
        .addEventListener(
            "click",
            () => showScreen(screens.menu)
        );
}

if ($("ownerMenuBtn")) {

    $("ownerMenuBtn")
        .addEventListener(
            "click",
            () => showScreen(screens.menu)
        );
}

if ($("continueBtn")) {

    $("continueBtn")
        .addEventListener(
            "click",
            () => {

                if (!player) {

                    showScreen(screens.start);
                    return;
                }

                if (
                    player.retired &&
                    club
                ) {

                    updateOwnerUI();
                    showScreen(screens.owner);

                } else if (
                    player.retired
                ) {

                    showScreen(screens.legacy);

                } else {

                    updateUI();
                    showScreen(screens.career);
                }
            }
        );
}

if ($("newGameBtn")) {

    $("newGameBtn")
        .addEventListener(
            "click",
            () => {

                if (
                    confirm(
                        "Start a completely new life? Your current career will be replaced."
                    )
                ) {

                    localStorage.removeItem(
                        SAVE_KEY
                    );

                    player = null;
                    club = null;

                    $("playerName").value = "";
                    $("playerCountry").value = "";

                    showScreen(screens.start);
                }
            }
        );
}


/* =========================================================
   OPTIONAL DYNAMIC BUTTONS
========================================================= */

/*
   These are created automatically if your HTML
   doesn't already have them.
*/

function createExtraButtons() {

    if (!screens.career) return;

    const actions =
        document.querySelector(".actions");

    if (!actions) return;

    if (!document.getElementById("transferBtn")) {

        const transfer =
            document.createElement("button");

        transfer.id =
            "transferBtn";

        transfer.textContent =
            "TRANSFER MARKET";

        transfer.addEventListener(
            "click",
            transferOffer
        );

        actions.appendChild(
            transfer
        );
    }
}


/* =========================================================
   START
========================================================= */

loadGame();

if (!player) {
    showScreen(screens.menu);
}

createExtraButtons();

updateCalendarUI();
