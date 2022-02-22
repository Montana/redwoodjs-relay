import { Link } from '@redwoodjs/router'
import './NewsCard.css'

export default function NewsCard({ newsItem }) {
  const { title, imageUrl, id, writtenBy } = newsItem
  return (
    <Link to={'/news/' + id}>
      <div className="newscard">
        <div
          className="newscardimg"
          style={{ backgroundImage: `url(${imageUrl})`, position: 'relative' }}
        >
          <div
            style={{
              opacity: '0.1',
              width: 'inherit',
              height: '400px',
              backgroundColor: 'white',
              color: 'white',
            }}
          ></div>
          <div
            style={{
              position: 'absolute',
              bottom: '0',
              width: '100%',
              padding: '20px',
              boxSizing: 'border-box',
              paddingBottom: '54px',
              color: 'aliceblue',
            }}
          >
            <div className="newscardtitle">
              <h1 style={{ fontSize: '1.5em' }}>{title}</h1>
            </div>
            <div>
              <span style={{ fontSize: 'small' }}>
                <b>{writtenBy}</b>
              </span>
            </div>
            <div></div>
          </div>
        </div>
      </div>
    </Link>
  )
}

/*


export default function NewsCard({ newsItem }) {
  const { title, body, imageUrl, id } = newsItem;
  const synopsis = body?.slice(0, 150);
  return (
    <Link to={"/news/" + id}>
      <div className="newscard">
        <div
          className="newscardimg"
          style={{ backgroundImage: `url(${imageUrl})` }}
        ></div>
        <div>
          <div className="newscardtitle">
            <h1>{title?.slice(0, 30)}</h1>
          </div>
          <div>
            <span>{synopsis}</span>
          </div>
          <div></div>
        </div>
      </div>
    </Link>
  );
}

*/
