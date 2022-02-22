import { render } from '@redwoodjs/testing'

import NewsItemsPage from './NewsItemsPage'

describe('NewsItemsPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<NewsItemsPage />)
    }).not.toThrow()
  })
})
