import { Link, routes } from '@redwoodjs/router'
import NewsItemCell from 'src/components/NewsItemCell'

const NewsItemPage = ({ id }) => {
  return (
    <>
    <NewsItemCell id={parseInt(id)} />
    </>
  )
}

export default NewsItemPage
