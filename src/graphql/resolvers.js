import axios from 'axios';
import transformResponse from '../../utils/nba-api-response-transformer';
import pubsub from './subscriptions';

export default {
  Query: {
    players: async (parent, args, context) => {
      const players = await context.playerLoader.load(1);

      if (args.ids)
        return players.filter(player => args.ids.includes(player.playerId));
      return players;
    },
    games: (parent, args) => {
      return axios
        .get(
          `http://stats.nba.com/stats/videoStatus?LeagueID=00&GameDate=${
            args.gameDate
          }`
        )
        .then(response => transformResponse(response.data));
    },
  },
  Subscription: {
    plays: { subscribe: () => pubsub.asyncIterator('newPlay') },
  },

  Game: {
    visitorTeam: obj => ({
      teamId: obj.visitorTeamId,
      teamLogo: `http://i.cdn.turner.com/nba/nba/assets/logos/teams/primary/web/${
        obj.visitorTeamAbbreviation
      }.svg`,
      city: obj.visitorTeamCity,
      name: obj.visitorTeamName,
      abbreviation: obj.visitorTeamAbbreviation,
    }),
    homeTeam: obj => ({
      teamId: obj.homeTeamId,
      teamLogo: `http://i.cdn.turner.com/nba/nba/assets/logos/teams/primary/web/${
        obj.homeTeamAbbreviation
      }.svg`,
      city: obj.homeTeamCity,
      name: obj.homeTeamName,
      abbreviation: obj.homeTeamAbbreviation,
    }),
    plays: obj => {
      return axios
        .get(
          `http://stats.nba.com/stats/playbyplayv2?GameId=${
            obj.gameId
          }&StartPeriod=0&EndPeriod=10`
        )
        .then(response => transformResponse(response.data));
    },
  },
  Play: {
    involvedPlayers: async (obj, args, context) => {
      const players = await context.playerLoader.load(1);

      const filters = [obj.player1Id, obj.player2Id, obj.player3Id].filter(
        Boolean
      );

      return filters.length > 0
        ? players.filter(player => filters.includes(parseInt(player.playerId)))
        : [];
    },
  },
  Player: {
    image: obj =>
      `https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/${
        obj.playerId
      }.png`,
  },
};
