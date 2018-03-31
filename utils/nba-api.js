import axios from 'axios';

export const fetchPlayers = () => {
  return axios
    .get('http://data.nba.net/10s/prod/v1/2017/players.json')
    .then(response =>
      response.data.league.standard.map(player => ({
        playerId: player.personId,
        ...player,
      }))
    );
};

export const fetchTeams = () => {
  return [];
};
