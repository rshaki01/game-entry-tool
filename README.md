# game-entry-tool

<h3>Jungle Game Entry Tool</h3>
An admin tool for entering basketball game scores and player statistics for the Jungle League. Exports a Firestore-ready JSON file that can be uploaded directly to the league's database.

<h3>Usage</h3>
The tool is designed to be run with a local live server (e.g. the Live Server extension in VS Code), or hosted online.

1. Select a scheduled game from the dropdown
2. Enter player statistics for both teams — points, field goals, free throws, three-pointers, rebounds, assists, steals, and blocks
3. Shooting percentages and points are calculated automatically
4. Click Export to download a .json file ready for Firestore

<h3>Data Files</h3>
All league data is stored in the data/ folder:

- scheduledGames.json — list of upcoming games
- players.json — player roster with team assignments
- teams.json — team information
- To add new games or players, update the relevant JSON file directly.
