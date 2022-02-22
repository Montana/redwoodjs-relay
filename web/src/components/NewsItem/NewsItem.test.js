import { render } from '@redwoodjs/testing'

import NewsItem from './NewsItem'

describe('NewsItem', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<NewsItem />)
    }).not.toThrow()
  })
})
