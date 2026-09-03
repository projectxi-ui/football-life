const SAVE_KEY = "projectXI_football_life_v2";

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


/* ---------------- UTILITIES ---------------- */

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
    Object.values(screens).forEach(s => s.classList.add("hidden"));
    screen.classList.remove("hidden");
}

function addLog(text) {
    if (!player) return;

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


/* ---------------- CUTSCENES ---------------- */

let currentCutscene = null;

function playCutscene(location, title, text, callback) {

    currentCutscene = callback || null;

    $("cutsceneLocation").textContent = location;
    $("cutsceneTitle").textContent = title;
    $("cutsceneText").textContent = text;

    $("cutscene").classList.remove("hidden");
}

$("cutsceneNext").addEventListener("click", () => {

    $("cutscene").classList.add("hidden");

    if (currentCutscene) {
        const callback = currentCutscene;
        currentCutscene = null;
        callback();
    }
});


/* ---------------- UI ---------------- */

function updateUI() {

    if (!player) return;

    $("displayName").textContent = player.name;

    $("displayDetails").textContent =
        `${player.age} • ${getPositionName(player.position)} • ${player.country}`;

    $("seasonDisplay").textContent = player.season;

    $("ageStat").textContent = player.age;
    $("ratingStat").textContent = player.rating;
    $("fitnessStat").textContent = player.fitness;
    $("happinessStat").textContent = player.happiness;
    $("moneyStat").textContent = money(player.money);
    $("reputationStat").textContent = player.reputation;

    $("clubName").textContent = player.club;
    $("clubStatus").textContent = player.clubStatus;

    $("playerAvatar").textContent =
        player.name.substring(0, 2).toUpperCase();

    $("topStatus").textContent =
        player.retired ? "OWNER MODE" : "CAREER MODE";
}


/* ---------------- PLAYER CREATION ---------------- */

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

        rating: 58,
        potential: random(70, 86),

        fitness: 76,
        happiness: 80,

        money: 2000,
        reputation: 5,

        club: "PROJECT XI Academy",
        clubStatus: "Youth Player",

        goals: 0,
        assists: 0,

        trophies: 0,

        leagueTitles: 0,
        goldenBoots: 0,
        playerOfYear: 0,
        ballonDor: 0,

        careerEarnings: 0,

        injured: false,
        injuryWeeks: 0,

        retired: false,

        achievements: []
    };

    $("careerLog").innerHTML = "";

    addLog(
        `<strong>Age ${player.age}</strong> — Your football journey begins at PROJECT XI Academy.`
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
                "Your first season starts now. Nothing is guaranteed.";
        }
    );
});


/* ---------------- TRAINING ---------------- */

$("trainBtn").addEventListener("click", () => {

    if (!player || player.retired) return;

    if (player.injured) {
        $("eventText").textContent =
            `You are recovering. ${player.injuryWeeks} week(s) remaining.`;
        return;
    }

    if (player.fitness < 25) {
        $("eventText").textContent =
            "You're too exhausted to train effectively.";
        return;
    }

    const difficulty = random(1, 100);

    player.fitness -= random(5, 10);

    if (difficulty <= 45) {

        if (player.rating < player.potential) {
            player.rating += 1;
            player.rating = Math.min(player.rating, player.potential);
            player.happiness = clamp(player.happiness + 2, 0, 100);

            addLog(
                `<strong>Training breakthrough.</strong> Your rating increased to ${player.rating}.`
            );

            $("eventText").textContent =
                "A difficult training session paid off.";

        } else {

            player.happiness = clamp(player.happiness + 1, 0, 100);

            addLog(
                `<strong>Training.</strong> You maintained your level.`
            );

            $("eventText").textContent =
                "You trained hard, but there was little room for improvement.";
        }

    } else if (difficulty <= 90) {

        addLog(
            `<strong>Training session.</strong> You worked hard but made no major breakthrough.`
        );

        $("eventText").textContent =
            "Solid session. Keep working.";

    } else {

        player.fitness -= 8;

        addLog(
            `<strong>Bad training day.</strong> Fatigue caught up with you.`
        );

        $("eventText").textContent =
            "The session was rough. You need recovery.";
    }

    player.fitness = clamp(player.fitness, 0, 100);

    updateUI();
    saveGame();
});


/* ---------------- MATCH ---------------- */

$("matchBtn").addEventListener("click", () => {

    if (!player || player.retired) return;

    if (player.injured) {
        $("eventText").textContent =
            "You cannot play while injured.";
        return;
    }

    if (player.fitness < 30) {
        $("eventText").textContent =
            "Your fitness is too low for a match.";
        return;
    }

    player.fitness -= random(10, 18);

    const performance = random(1, 100);

    let goals = 0;
    let assists = 0;

    if (performance >= 92) {
        goals = random(2, 3);
        assists = random(0, 2);
        player.reputation += 4;

        addLog(
            `<strong>Outstanding performance.</strong> ${goals} goal(s), ${assists} assist(s).`
        );

        player.happiness = clamp(player.happiness + 5, 0, 100);

    } else if (performance >= 70) {

        goals = random(0, 1);
        assists = random(0, 1);
        player.reputation += 1;

        addLog(
            `<strong>Good match.</strong> ${goals} goal(s), ${assists} assist(s).`
        );

    } else if (performance <= 20) {

        player.reputation = clamp(player.reputation - 2, 0, 100);
        player.happiness = clamp(player.happiness - 3, 0, 100);

        addLog(
            `<strong>Difficult match.</strong> You struggled to make an impact.`
        );

    } else {

        addLog(
            `<strong>Match completed.</strong> A quiet performance.`
        );
    }

    player.goals += goals;
    player.assists += assists;

    const pay = random(150, 500);

    player.money += pay;
    player.careerEarnings += pay;

    $("eventText").textContent =
        `Match complete. +${goals} goal(s), +${assists} assist(s).`;

    checkAchievements();

    updateUI();
    saveGame();
});


/* ---------------- LIFE ---------------- */

$("lifeBtn").addEventListener("click", () => {

    if (!player || player.retired) return;

    const choice = random(1, 4);

    if (choice === 1) {

        player.happiness = clamp(player.happiness + 8, 0, 100);

        addLog(
            `<strong>Family time.</strong> You spent the day with people close to you.`
        );

        $("eventText").textContent =
            "A good day away from football.";

    } else if (choice === 2) {

        player.fitness = clamp(player.fitness + 12, 0, 100);

        addLog(
            `<strong>Rest day.</strong> You focused on recovery.`
        );

        $("eventText").textContent =
            "You recovered and feel refreshed.";

    } else if (choice === 3) {

        player.happiness = clamp(player.happiness + 4, 0, 100);
        player.reputation += 2;

        addLog(
            `<strong>Community event.</strong> Your reputation improved.`
        );

        $("eventText").textContent =
            "People around you noticed your positive attitude.";

    } else {

        player.happiness = clamp(player.happiness - 3, 0, 100);
        player.fitness = clamp(player.fitness + 5, 0, 100);

        addLog(
            `<strong>Quiet day.</strong> You stayed away from the spotlight.`
        );

        $("eventText").textContent =
            "A peaceful day.";
    }

    updateUI();
    saveGame();
});


/* ---------------- YEAR END ---------------- */

$("ageUpBtn").addEventListener("click", () => {

    if (!player || player.retired) return;

    if (player.injured) {

        player.injuryWeeks--;

        if (player.injuryWeeks <= 0) {

            player.injured = false;
            player.injuryWeeks = 0;

            addLog(
                `<strong>Recovery complete.</strong> You are ready to return.`
            );

        } else {

            addLog(
                `<strong>Recovery.</strong> ${player.injuryWeeks} week(s) remain.`
            );
        }

    }

    player.age++;
    player.season++;

    yearlyIncome();
    yearlyDevelopment();
    randomYearEvent();
    careerProgression();
    checkAchievements();

    if (player.age >= 40) {
        retirePlayer();
        return;
    }

    updateUI();
    saveGame();

    playCutscene(
        `SEASON ${player.season}`,
        `AGE ${player.age}`,
        `Another year begins. Your choices will decide where your career goes next.`,
        () => {
            updateUI();
        }
    );
});


function yearlyIncome() {

    let income = 300;

    if (player.clubStatus === "Professional Player") income = 700;
    if (player.clubStatus === "First Team Player") income = 1800;
    if (player.clubStatus === "Star Player") income = 3500;
    if (player.clubStatus === "World-Class Player") income = 8000;

    player.money += income;
    player.careerEarnings += income;

    addLog(
        `<strong>Season earnings.</strong> You earned ${money(income)}.`
    );
}


function yearlyDevelopment() {

    if (player.age <= 23 && player.rating < player.potential) {

        const chance = random(1, 100);

        if (chance <= 40) {
            player.rating++;
        }
    }

    if (player.age >= 30) {

        if (random(1, 100) <= 30) {
            player.rating = Math.max(60, player.rating - 1);
        }
    }

    player.fitness = clamp(
        player.fitness + random(-5, 8),
        20,
        100
    );
}


/* ---------------- RANDOM EVENTS ---------------- */

function randomYearEvent() {

    const event = random(1, 8);

    if (event === 1) {

        player.reputation += 3;

        addLog(
            `<strong>Scout attention.</strong> A professional scout watched your performances.`
        );

        $("eventText").textContent =
            "A professional scout has started following your career.";

    } else if (event === 2) {

        player.money += 1000;

        addLog(
            `<strong>Sponsorship opportunity.</strong> You earned €1,000.`
        );

        $("eventText").textContent =
            "A small sponsorship deal has arrived.";

    } else if (event === 3) {

        player.happiness = clamp(player.happiness - 8, 0, 100);

        addLog(
            `<strong>Difficult season.</strong> Pressure has increased.`
        );

        $("eventText").textContent =
            "The pressure around your career is growing.";

    } else if (event === 4) {

        player.injured = true;
        player.injuryWeeks = random(1, 3);

        addLog(
            `<strong>Injury setback.</strong> You need ${player.injuryWeeks} week(s) to recover.`
        );

        $("eventText").textContent =
            `You picked up an injury. Recovery: ${player.injuryWeeks} week(s).`;

    } else if (event === 5) {

        player.happiness = clamp(player.happiness + 7, 0, 100);

        addLog(
            `<strong>Teammates noticed.</strong> Your leadership is growing.`
        );

        $("eventText").textContent =
            "Your teammates are starting to respect you.";

    } else if (event === 6) {

        if (player.rating < player.potential) {
            player.rating++;
        }

        addLog(
            `<strong>Breakthrough season.</strong> Your development continues.`
        );

        $("eventText").textContent =
            "Something clicked this season.";

    } else if (event === 7) {

        player.money += 2000;

        addLog(
            `<strong>Performance bonus.</strong> You received €2,000.`
        );

        $("eventText").textContent =
            "Your club rewarded your performances.";

    } else {

        addLog(
            `<strong>Quiet season.</strong> Nothing major changed.`
        );

        $("eventText").textContent =
            "A quiet year. Sometimes that's part of football.";
    }

    player.reputation = clamp(player.reputation, 0, 100);
}


/* ---------------- CAREER PROGRESSION ---------------- */

function careerProgression() {

    if (
        player.age >= 18 &&
        player.rating >= 64 &&
        player.clubStatus === "Youth Player"
    ) {

        player.club = "PROJECT XI FC";
        player.clubStatus = "Professional Player";
        player.money += 5000;

        addLog(
            `<strong>PROFESSIONAL CONTRACT.</strong> You have officially become a professional footballer.`
        );

        playCutscene(
            "PROJECT XI FC",
            "THE FIRST CONTRACT",
            "Years of work have finally paid off. You are officially a professional footballer.",
            () => {
                updateUI();
            }
        );

        return;
    }


    if (
        player.age >= 21 &&
        player.rating >= 72 &&
        player.clubStatus === "Professional Player"
    ) {

        player.club = "PROJECT XI UNITED";
        player.clubStatus = "First Team Player";
        player.money += 15000;

        addLog(
            `<strong>FIRST TEAM.</strong> You earned a place at PROJECT XI United.`
        );

        playCutscene(
            "PROJECT XI UNITED",
            "THE BIG STEP",
            "You're no longer just a prospect. You're ready for the first team.",
            () => {
                updateUI();
            }
        );

        return;
    }


    if (
        player.age >= 25 &&
        player.rating >= 80 &&
        player.clubStatus === "First Team Player"
    ) {

        player.clubStatus = "Star Player";

        addLog(
            `<strong>STAR STATUS.</strong> You have become one of the club's most important players.`
        );

        $("eventText").textContent =
            "You are now considered a star.";
    }


    if (
        player.age >= 29 &&
        player.rating >= 85 &&
        player.reputation >= 60 &&
        player.clubStatus === "Star Player"
    ) {

        player.clubStatus = "World-Class Player";

        addLog(
            `<strong>WORLD CLASS.</strong> You have reached the highest level of your generation.`
        );

        playCutscene(
            "THE FOOTBALL WORLD",
            "WORLD CLASS",
            "Your name is now known around the football world.",
            () => updateUI()
        );
    }
}


/* ---------------- ACHIEVEMENTS ---------------- */

function checkAchievements() {

    if (!player) return;

    if (player.goals >= 25 && !player.achievements.includes("Golden Boot")) {

        player.achievements.push("Golden Boot");
        player.goldenBoots++;

        addLog(
            `<strong>🏆 GOLDEN BOOT.</strong> You reached 25 career goals.`
        );
    }


    if (
        player.rating >= 80 &&
        player.goals >= 40 &&
        player.trophies >= 2 &&
        !player.achievements.includes("Player of the Year")
    ) {

        player.achievements.push("Player of the Year");
        player.playerOfYear++;

        addLog(
            `<strong>🏆 PLAYER OF THE YEAR.</strong> Your career has reached another level.`
        );
    }


    if (
        player.rating >= 90 &&
        player.goals >= 100 &&
        player.trophies >= 5 &&
        player.reputation >= 80 &&
        !player.achievements.includes("Ballon d'Or")
    ) {

        player.achievements.push("Ballon d'Or");
        player.ballonDor++;

        addLog(
            `<strong>🏆 BALLON D'OR.</strong> You have become one of the greatest players in the world.`
        );
    }
}


/* ---------------- RETIREMENT ---------------- */

function retirePlayer() {

    player.retired = true;

    addLog(
        `<strong>RETIREMENT.</strong> After ${player.season} seasons, your playing career has ended.`
    );

    $("legacyGoals").textContent = player.goals;
    $("legacyAssists").textContent = player.assists;
    $("legacyTrophies").textContent = player.trophies;
    $("legacyMoney").textContent = money(player.money);

    renderAchievements();

    saveGame();

    showScreen(screens.legacy);

    playCutscene(
        "THE FINAL WHISTLE",
        "YOUR PLAYING CAREER IS OVER",
        "The boots are hanging up. But this isn't the end of your football story.",
        () => {
            showScreen(screens.legacy);
        }
    );
}


function renderAchievements() {

    const list = $("achievementList");
    list.innerHTML = "";

    if (!player.achievements.length) {

        list.innerHTML =
            `<div class="achievement">No major individual awards yet.</div>`;

        return;
    }

    player.achievements.forEach(achievement => {

        const div = document.createElement("div");

        div.className = "achievement";
        div.textContent = "🏆 " + achievement;

        list.appendChild(div);
    });
}


/* ---------------- CLUB CREATION ---------------- */

$("createClubBtn").addEventListener("click", () => {

    if (!player || !player.retired) return;

    showScreen(screens.club);
});


$("confirmClubBtn").addEventListener("click", () => {

    const name = $("newClubName").value.trim();
    const city = $("newClubCity").value.trim();
    const stadium = $("newStadiumName").value.trim();
    const motto = $("newClubMotto").value.trim();

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

        academy: 1,
        training: 1,
        scouting: 1,
        stadiumLevel: 1
    };

    player.club = name;
    player.clubStatus = "Owner";

    addLog(
        `<strong>CLUB FOUNDED.</strong> You created ${name}.`
    );

    updateOwnerUI();

    saveGame();

    showScreen(screens.owner);

    playCutscene(
        name,
        "A NEW CLUB IS BORN",
        `From player to owner. Your new club begins with one mission: build something that lasts.`,
        () => {
            showScreen(screens.owner);
        }
    );
});


/* ---------------- OWNER MODE ---------------- */

function updateOwnerUI() {

    if (!club) return;

    $("ownerClubName").textContent = club.name;
    $("ownerClubInfo").textContent =
        `${club.city} • ${club.stadium}`;

    $("ownerMotto").textContent =
        `"${club.motto}"`;

    $("clubMoney").textContent =
        money(club.funds);

    $("academyLevel").textContent =
        club.academy;

    $("trainingLevel").textContent =
        club.training;

    $("scoutLevel").textContent =
        club.scouting;

    $("stadiumLevel").textContent =
        club.stadiumLevel;
}


function upgradeClub(type) {

    if (!club) return;

    const costs = {
        academy: 15000,
        training: 20000,
        scouting: 25000,
        stadium: 30000
    };

    const cost = costs[type];

    if (club.funds < cost) {

        alert("Your club doesn't have enough funds.");

        return;
    }

    club.funds -= cost;

    club[type === "stadium" ? "stadiumLevel" : type]++;

    const names = {
        academy: "Youth Academy",
        training: "Training Ground",
        scouting: "Scouting Network",
        stadium: "Stadium"
    };

    addLog(
        `<strong>CLUB UPGRADE.</strong> ${names[type]} reached level ${club[type === "stadium" ? "stadiumLevel" : type]}.`
    );

    updateOwnerUI();
    saveGame();
}


$("upgradeAcademyBtn").addEventListener("click", () =>
    upgradeClub("academy")
);

$("upgradeTrainingBtn").addEventListener("click", () =>
    upgradeClub("training")
);

$("upgradeScoutBtn").addEventListener("click", () =>
    upgradeClub("scouting")
);

$("upgradeStadiumBtn").addEventListener("click", () =>
    upgradeClub("stadium")
);


/* ---------------- SAVE ---------------- */

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


$("saveBtn").addEventListener("click", () => {

    saveGame();

    $("eventText").textContent =
        "Career saved successfully.";
});


function loadGame() {

    const saved = localStorage.getItem(SAVE_KEY);

    if (!saved) return;

    try {

        const data = JSON.parse(saved);

        player = data.player || null;
        club = data.club || null;

        if (player) {

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
        }

    } catch {

        localStorage.removeItem(SAVE_KEY);
    }
}


/* ---------------- MENU ---------------- */

$("logoBtn").addEventListener("click", () => {

    showScreen(screens.menu);
});


$("menuBtn").addEventListener("click", () => {

    showScreen(screens.menu);
});


$("legacyMenuBtn").addEventListener("click", () => {

    showScreen(screens.menu);
});


$("ownerMenuBtn").addEventListener("click", () => {

    showScreen(screens.menu);
});


$("continueBtn").addEventListener("click", () => {

    if (!player) {

        showScreen(screens.start);
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
});


$("newGameBtn").addEventListener("click", () => {

    if (confirm("Start a completely new life? Your current career will be replaced.")) {

        localStorage.removeItem(SAVE_KEY);

        player = null;
        club = null;

        $("playerName").value = "";
        $("playerCountry").value = "";

        showScreen(screens.start);
    }
});


/* ---------------- START ---------------- */

loadGame();

if (!player) {
    showScreen(screens.menu);
}
