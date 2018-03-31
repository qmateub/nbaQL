import axios from 'axios';

export const fetchPlayers = () => {
  return axios
    .get('http://data.nba.net/10s/prod/v1/2017/players.json')
    .then(response =>
      response.data.league.standard
        .filter(player => player.teams.length > 0)
        .filter(
          player => player.teams[player.teams.length - 1].seasonEnd === '2017'
        )
        .map(player => ({
          playerId: player.personId,
          image: `https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/${
            player.personId
          }.png`,
          ...player,
        }))
    );
};

export const fetchTeams = () => {
  return axios
    .get('http://data.nba.net/prod/v1/2017/teams.json')
    .then(response =>
      response.data.league.standard.filter(team => team.isNBAFranchise)
    );
};
