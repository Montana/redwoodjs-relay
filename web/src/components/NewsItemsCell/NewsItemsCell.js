import NewsCard from "src/components/NewsCard"

export const QUERY = gql`
  query NewsItemsQuery {
    newsItems {
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

export const Success = ({ newsItems }) => {
  return (
    <>
      {newsItems.map((item) => {
        return <NewsCard key={item.id} newsItem={item} />
      })}
    </>
  )
}
