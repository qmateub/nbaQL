import axios from 'axios';
import pubsub from './subscriptions';

export default {
  Query: {
    players: async (obj, args, context) => {
      const players = await context.playerLoader.load(1);

      if (args.ids)
        return players.filter(player => args.ids.includes(player.playerId));
      return players;
    },
    games: (obj, args) => {
      const gameDate = args.gameDate.split('-').join('');
      return axios
        .get(`http://data.nba.net/prod/v2/${gameDate}/scoreboard.json`)
        .then(response => response.data.games);
    },
  },
  Subscription: {
    plays: { subscribe: () => pubsub.asyncIterator('newPlay') },
  },

  Game: {
    visitorTeam: async (obj, args, context) => {
      const teams = await context.teamLoader.load(1);
      const team = teams.find(team => team.teamId === obj.vTeam.teamId);

      return {
        ...team,
        teamLogo: `http://i.cdn.turner.com/nba/nba/assets/logos/teams/primary/web/${
          team.tricode
        }.svg`,
      };
    },
    homeTeam: async (obj, args, context) => {
      const teams = await context.teamLoader.load(1);
      const team = teams.find(team => team.teamId === obj.hTeam.teamId);

      return {
        ...team,
        teamLogo: `http://i.cdn.turner.com/nba/nba/assets/logos/teams/primary/web/${
          team.tricode
        }.svg`,
      };
    },
    plays: obj => {
      const playsQuarter1 = axios.get(
        `http://data.nba.net/prod/v1/${obj.startDateEastern}/${
          obj.gameId
        }_pbp_1.json`
      );
      const playsQuarter2 = axios.get(
        `http://data.nba.net/prod/v1/${obj.startDateEastern}/${
          obj.gameId
        }_pbp_2.json`
      );
      const playsQuarter3 = axios.get(
        `http://data.nba.net/prod/v1/${obj.startDateEastern}/${
          obj.gameId
        }_pbp_3.json`
      );
      const playsQuarter4 = axios.get(
        `http://data.nba.net/prod/v1/${obj.startDateEastern}/${
          obj.gameId
        }_pbp_4.json`
      );

      let playId = 0;

      return Promise.all([
        playsQuarter1,
        playsQuarter2,
        playsQuarter3,
        playsQuarter4,
      ]).then(responses =>
        responses.reduce(
          (plays, response, index) => [
            ...plays,
            ...response.data.plays.map(play => ({
              ...play,
              playId: String(playId++),
              quarter: index + 1,
              visitorTeamScore: play.vTeamScore,
              homeTeamScore: play.hTeamScore,
            })),
          ],
          []
        )
      );
    },
  },
  Play: {
    player: async (obj, args, context) => {
      const players = await context.playerLoader.load(1);

      return players.find(player => player.playerId === obj.personId);
    },
    team: async (obj, args, context) => {
      const teams = await context.teamLoader.load(1);

      return teams.find(team => team.teamId === obj.teamId);
    },
  },
  Player: {
    image: obj =>
      axios
        .get(
          `https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/${
            obj.playerId
          }.png`
        )
        .then(
          () =>
            `https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/${
              obj.playerId
            }.png`,
          () =>
            'http://i.cdn.turner.com/nba/nba/.element/img/2.0/sect/statscube/players/large/default_nba_headshot_v2.png'
        ),
  },
};
