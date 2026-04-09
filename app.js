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
            <td><input type="number" id="${player.id}-fgm" value="0" min="0"></td>
            <td><input type="number" id="${player.id}-fga" value="0" min="0"></td>
            <td><input type="number" id="${player.id}-ftm" value="0" min="0"></td>
            <td><input type="number" id="${player.id}-fta" value="0" min="0"></td>
            <td><input type="number" id="${player.id}-tpm" value="0" min="0"></td>
            <td><input type="number" id="${player.id}-tpa" value="0" min="0"></td>
            <td><input type="number" id="${player.id}-reb" value="0" min="0"></td>
            <td><input type="number" id="${player.id}-ast" value="0" min="0"></td>
            <td><input type="number" id="${player.id}-stl" value="0" min="0"></td>
            <td><input type="number" id="${player.id}-blk" value="0" min="0"></td>
            <td><input readonly type="number" id="${player.id}-fgPct" value="0" min="0"></td>
            <td><input readonly type="number" id="${player.id}-ftPct" value="0" min="0"></td>
            <td><input readonly type="number" id="${player.id}-tpPct" value="0" min="0"></td>                 
        `;

        tbodyElement.append(row);
    });


}

