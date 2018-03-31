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
  city: String!
  name: String!
  abbreviation: String!
}

type Play {
  eventnum: Int!
  homedescription: String
  neutraldescription: String
  visitordescription: String
  involvedPlayers: [Player]
}

type Game {
  gameId: String!
  gameDate: String!
  visitorTeam: Team!
  homeTeam: Team!
  plays: [Play!]
  gameStatus: Int!
  gameStatusText: String!
  isAvailable: Int!
  ptXyzAvailable: Int!
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
