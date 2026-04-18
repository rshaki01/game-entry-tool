async function loadData() {
    const playersResponse = await fetch('data/players.json');
    const players = await playersResponse.json();
    const gamesResponse = await fetch('data/scheduledGames.json');
    const games = await gamesResponse.json();
    const teamsResponse = await fetch('data/teams.json');
    const teams = await teamsResponse.json();
    console.log(players);
    console.log(games);
    console.log(teams);

    gameSelect = document.getElementById("game-select");
    // load each game into the select dropdown
    games.forEach(function(game) {
    element = document.createElement('option');
    element.textContent = element.textContent = game.homeTeamId + ' vs ' + game.awayTeamId + ' Week ' + game.week;
    element.value = game.id;
    gameSelect.append(element);
    });

    // display data for the first team in the select dropdown
    updateGameInfo(games[0])
    renderPlayerRows(players, games[0].homeTeamId, 'home-team-body');
    renderPlayerRows(players, games[0].awayTeamId, 'away-team-body');

  
    // runs when the user picks a different option
    gameSelect.addEventListener('change', function() {
        const gameId = gameSelect.value;
        const game = games.find((game) => game.id === gameId);

        updateGameInfo(game);
        renderPlayerRows(players, game.homeTeamId, 'home-team-body');
        renderPlayerRows(players, game.awayTeamId, 'away-team-body');
        
    });

    // export functionality
    const exportButton = document.getElementById('exportButton');
    exportButton.addEventListener('click', function () {
        const gameId = gameSelect.value;
        const game = games.find((game) => game.id === gameId);
        let homeScore = 0;
        let awayScore = 0;

        // calculating homeScore
        const homePlayers = players.filter((p) => p.teamId === game.homeTeamId);

        homePlayers.forEach((p) => {
            const ptsInput = document.getElementById(`${p.id}-pts`);
            homeScore += parseInt(ptsInput.value);
        })

        // calculating awayScore
        const awayPlayers = players.filter((p) => p.teamId === game.awayTeamId);

        awayPlayers.forEach((p) => {
            const ptsInput = document.getElementById(`${p.id}-pts`);
            awayScore += parseInt(ptsInput.value);
        })

        // validating data to ensure each attempt is >= then each make
        const allPlayers = [...homePlayers, ...awayPlayers];
        const isValid = allPlayers.every((p) => {
            const twoPM = parseInt(document.getElementById(`${p.id}-twoPM`).value);
            const twoPA = parseInt(document.getElementById(`${p.id}-twoPA`).value);
            const ftm = parseInt(document.getElementById(`${p.id}-ftm`).value);
            const fta = parseInt(document.getElementById(`${p.id}-fta`).value);
            const tpm = parseInt(document.getElementById(`${p.id}-tpm`).value);
            const tpa = parseInt(document.getElementById(`${p.id}-tpa`).value);
            return twoPA >= twoPM && fta >= ftm && tpa >= tpm;
        });

        if (!isValid) {
            alert("Please ensure attempts are >= makes for all players.");
            return;
        }


        // calculating boxScore
        const homeBoxScore = homePlayers.map((p) => {
            const playerPoints = document.getElementById(`${p.id}-pts`);
            const playerRebounds = document.getElementById(`${p.id}-reb`);
            const playerAssists = document.getElementById(`${p.id}-ast`);
            const playerSteals = document.getElementById(`${p.id}-stl`);
            const playerBlocks = document.getElementById(`${p.id}-blk`);
            const playerTwoPM= document.getElementById(`${p.id}-twoPM`);
            const playerTwoPA = document.getElementById(`${p.id}-twoPA`);
            const playerFTM = document.getElementById(`${p.id}-ftm`);
            const playerFTA = document.getElementById(`${p.id}-fta`);
            const playerTPM = document.getElementById(`${p.id}-tpm`);
            const playerTPA = document.getElementById(`${p.id}-tpa`);

            
            return {
                "playerId": p.id,
                "points": parseInt(playerPoints.value),
                "rebounds": parseInt(playerRebounds.value),
                "assists": parseInt(playerAssists.value),
                "steals": parseInt(playerSteals.value),
                "blocks": parseInt(playerBlocks.value),
                "twoPM": parseInt(playerTwoPM.value),
                "twoPA": parseInt(playerTwoPA.value),
                "ftm": parseInt(playerFTM.value),
                "fta": parseInt(playerFTA.value),
                "tpm": parseInt(playerTPM.value),
                "tpa": parseInt(playerTPA.value),
            }
        })

        const awayBoxScore = awayPlayers.map((p) => {
            const playerPoints = document.getElementById(`${p.id}-pts`);
            const playerRebounds = document.getElementById(`${p.id}-reb`);
            const playerAssists = document.getElementById(`${p.id}-ast`);
            const playerSteals = document.getElementById(`${p.id}-stl`);
            const playerBlocks = document.getElementById(`${p.id}-blk`);
            const playerTwoPM = document.getElementById(`${p.id}-twoPM`);
            const playerTwoPA = document.getElementById(`${p.id}-twoPA`);
            const playerFTM = document.getElementById(`${p.id}-ftm`);
            const playerFTA = document.getElementById(`${p.id}-fta`);
            const playerTPM = document.getElementById(`${p.id}-tpm`);
            const playerTPA = document.getElementById(`${p.id}-tpa`);
            
            return {
                "playerId": p.id,
                "points": parseInt(playerPoints.value),
                "rebounds": parseInt(playerRebounds.value),
                "assists": parseInt(playerAssists.value),
                "steals": parseInt(playerSteals.value),
                "blocks": parseInt(playerBlocks.value),
                "twoPM": parseInt(playerTwoPM.value),
                "twoPA": parseInt(playerTwoPA.value),
                "ftm": parseInt(playerFTM.value),
                "fta": parseInt(playerFTA.value),
                "tpm": parseInt(playerTPM.value),
                "tpa": parseInt(playerTPA.value),
            }
        })


        exportObject = {
            "id": gameId,
            "division": game.division,
            "week": game.week,
            "date": game.date,
            "time": game.time,
            "status": "completed",
            "homeTeamId": game.homeTeamId,
            "awayTeamId": game.awayTeamId,
            "homeScore": homeScore,
            "awayScore": awayScore,
            "boxScore": {
                [game.homeTeamId]: homeBoxScore,
                [game.awayTeamId]: awayBoxScore
            }
        };

        console.log(JSON.stringify(exportObject, null, 2));

        //download JSON

        const jsonString = JSON.stringify(exportObject, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${gameId}.json`;
        a.click();

    })
}

loadData();

function updateGameInfo(game) {
    // all the label updating code goes here
    homeTeamLabel = document.getElementById("home-team-name");
        awayTeamLabel = document.getElementById("away-team-name");
        gameDateLabel = document.getElementById("game-date");
        gameWeekLabel = document.getElementById("game-week");

        homeTeamLabel.textContent = game.homeTeamId;
        awayTeamLabel.textContent = game.awayTeamId;
        gameDateLabel.textContent = game.date;
        gameWeekLabel.textContent = game.week;
}

function renderPlayerRows(players, teamId, tbodyId) {
    playerRows = players.filter((p) => p.teamId === teamId);

    tbodyElement = document.getElementById(tbodyId);
    tbodyElement.innerHTML = '';


    playerRows.forEach(function(player) {
        const row = document.createElement('tr');
        row.innerHTML =`
            <td>${player.number}</td>
            <td>${player.name}</td>
            <td><input readonly type="number" id="${player.id}-pts" value="0" min="0"></td>
            <td><input type="number" id="${player.id}-twoPM" value="0" min="0"></td>
            <td><input type="number" id="${player.id}-twoPA" value="0" min="0"></td>
            <td><input type="number" id="${player.id}-ftm" value="0" min="0"></td>
            <td><input type="number" id="${player.id}-fta" value="0" min="0"></td>
            <td><input type="number" id="${player.id}-tpm" value="0" min="0"></td>
            <td><input type="number" id="${player.id}-tpa" value="0" min="0"></td>
            <td><input type="number" id="${player.id}-reb" value="0" min="0"></td>
            <td><input type="number" id="${player.id}-ast" value="0" min="0"></td>
            <td><input type="number" id="${player.id}-stl" value="0" min="0"></td>
            <td><input type="number" id="${player.id}-blk" value="0" min="0"></td>
        `;

        const ptsInput = row.querySelector(`#${player.id}-pts`);
        const twoPmInput = row.querySelector(`#${player.id}-twoPM`);
        const twoPaInput = row.querySelector(`#${player.id}-twoPA`);
        const ftmInput = row.querySelector(`#${player.id}-ftm`);
        const ftaInput = row.querySelector(`#${player.id}-fta`);
        const tpmInput = row.querySelector(`#${player.id}-tpm`);
        const tpaInput = row.querySelector(`#${player.id}-tpa`);
        const rebInput = row.querySelector(`#${player.id}-reb`);
        const astInput = row.querySelector(`#${player.id}-ast`);
        const stlInput = row.querySelector(`#${player.id}-stl`);
        const blkInput = row.querySelector(`#${player.id}-blk`);
  
        function recalculate() {
            const twoPM = parseInt(twoPmInput.value);
            const tpm = parseInt(tpmInput.value);
            const ftm = parseInt(ftmInput.value)        

            // calculate points
            ptsInput.value = (twoPM * 2) + (tpm * 3) + ftm;
            
        };

        twoPmInput.addEventListener('input', recalculate);
        tpmInput.addEventListener('input', function() {
            recalculate();
        })
        ftmInput.addEventListener('input', recalculate);
        twoPaInput.addEventListener('input', recalculate);
        tpaInput.addEventListener('input', recalculate);
        ftaInput.addEventListener('input', recalculate);

        tbodyElement.append(row);
    });


}



