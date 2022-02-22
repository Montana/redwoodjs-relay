export const schema = gql`
  type NewsItem {
    id: Int!
    title: String!
    body: String!
    writtenBy: String!
    imageUrl: String!
  }

  type Query {
    newsItems: [NewsItem!]!
    newsItem(id: Int!): NewsItem
  }

  input CreateNewsItemInput {
    title: String!
    body: String!
    writtenBy: String!
    imageUrl: String!
  }

  input UpdateNewsItemInput {
    title: String
    body: String
    writtenBy: String
    imageUrl: String
  }

  type Mutation {
    createNewsItem(input: CreateNewsItemInput!): NewsItem!
    updateNewsItem(id: Int!, input: UpdateNewsItemInput!): NewsItem!
    deleteNewsItem(id: Int!): NewsItem!
  }
`
