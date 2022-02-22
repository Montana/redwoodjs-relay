import './NewsItem.css'

import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'
import { navigate, routes } from '@redwoodjs/router'

const UPDATE_NEWS_MUTATION = gql`
  mutation UpdateNewsMutation($input: UpdateNewsItemInput!) {
    updateNewsItem(input: $input) {
      id
      title
      body
      writtenBy
      imageUrl
    }
  }
`
const DELETE_NEWS_MUTATION = gql`
  mutation DeleteNewsMutation($id: Int!) {
    deleteNewsItem(id: $id) {
      id
      title
      body
      writtenBy
      imageUrl
    }
  }
`

const NewsItem = ({ news }) => {
  const [deleteNewsItem, { loading, error }] = useMutation(
    DELETE_NEWS_MUTATION,
    {
      onCompleted: () => {
        toast.success('News item deleted')
        navigate(routes.newsItems())
      },
    }
  )

  function deleteNews() {
    if (window.confirm('Do you want to delete this news item?')) {
      deleteNewsItem({
        variables: {
          id: news?.id,
        },
      })
    }
  }
  return (
    <div className="container">
      <head>
        <title>News Pro</title>
        <link rel="icon" href="/favicon.ico" />
      </head>

      <main className="main">
        <div className="newsview">
          <div>
            <div className="newsviewtitlesection">
              <div className="newsviewtitle">
                <h1>{news?.title}</h1>
              </div>
              <div className="newsviewdetails">
                <span style={{ flex: '1', color: 'rgb(99 98 98)' }}>
                  Written By: <span>{news?.writtenBy}</span>
                </span>
                <span style={{ flex: '1', color: 'rgb(99 98 98)' }}>
                  Date: <span>{news?.created_at}</span>
                </span>
                <span>
                  <button className="btn-danger" onClick={deleteNews}>
                    Delete
                  </button>
                </span>
              </div>
            </div>

            <div
            className="newsviewimg"
            style={{ backgroundImage: `url(${news?.imageUrl})` }}
          ></div>

            <div className="newsviewbody">{news?.body}</div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default NewsItem
