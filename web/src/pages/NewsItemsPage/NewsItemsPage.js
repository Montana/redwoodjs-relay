import { Link, routes } from '@redwoodjs/router'
import NewsItemsCell from 'src/components/NewsItemsCell'
import { useState } from 'react'
import './NewsItems.css'
import AddNewsDialog from "src/components/AddNewsDialog"

const NewsItemsPage = () => {
  const [showModal, setShowModal] = useState(false)

  return (
    <div className="container">
      <head>
        <title>News Pro</title>
        <link rel="icon" href="/favicon.ico" />
      </head>

      <main className="main">
        <div className="newslist">
          <div className="newslistbreadcrumb">
            <div className="newslisttitle">
              <h3>Breaking News</h3>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ marginRight: '4px' }}>
                <button onClick={() => setShowModal(true)}>Add News</button>
              </div>
            </div>
          </div>
          <div style={{display: "flex", flexWrap: "wrap"}}>
            <NewsItemsCell />
          </div>
          {showModal ? (
            <AddNewsDialog closeModal={() => setShowModal(false)} />
          ) : null}
        </div>
      </main>
    </div>
  )
}

export default NewsItemsPage
