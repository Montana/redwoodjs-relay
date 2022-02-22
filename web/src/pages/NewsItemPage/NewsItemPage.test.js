import { render } from '@redwoodjs/testing'

import NewsItemPage from './NewsItemPage'

describe('NewsItemPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<NewsItemPage id="42" />)
    }).not.toThrow()
  })
})
