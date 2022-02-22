// In this file, all Page components from 'src/pages` are auto-imported. Nested
// directories are supported, and should be uppercase. Each subdirectory will be
// prepended onto the component name.
//
// Examples:
//
// 'src/pages/HomePage/HomePage.js'         -> HomePage
// 'src/pages/Admin/BooksPage/BooksPage.js' -> AdminBooksPage

import { Set, Router, Route } from '@redwoodjs/router'
import NewsItemLayout from 'src/layouts/NewsItemLayout'

const Routes = () => {
  return (
    <Router>
      <Set wrap={NewsItemLayout}>
        <Route path="/news/{id}" page={NewsItemPage} name="newsItem" />
        <Route path="/news" page={NewsItemsPage} name="newsItems" />
      </Set>
      <Route notfound page={NotFoundPage} />
    </Router>
  )
}

export default Routes
