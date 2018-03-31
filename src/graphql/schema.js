export default `

type Player {
  playerId: Int!
  lastName: String!
  firstName: String!
  image: String
}

type Team {
  teamId: String!
  teamLogo: String
  tricode: String!
}

type Play {
  playId: Int!
  quarter: Int!
  clock: String!
  eventMsgType: String!
  description: String!
  player: Player
  team: Team
  visitorTeamScore: String!
  homeTeamScore: String!
}

type Game {
  gameId: String!
  startDateEastern: String!
  visitorTeam: Team!
  homeTeam: Team!
  plays: [Play!]
  statusNum: Int!
}

type Subscription {
  plays(gameID: String!): [Play]
}

type Query {
  players(ids: String): [Player!]!
  games(gameDate: String!): [Game]
  subscription: Subscription
}

`;
