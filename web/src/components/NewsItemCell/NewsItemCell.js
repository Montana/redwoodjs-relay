import NewsItem from "src/components/NewsItem"

export const QUERY = gql`
  query FindNewsItemQuery($id: Int!) {
    newsItem: newsItem(id: $id) {
      id
      title
      body
      writtenBy
      imageUrl
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }) => (
  <div style={{ color: 'red' }}>Error: {error.message}</div>
)

export const Success = ({ newsItem }) => {
  return <NewsItem news={newsItem} />
}
