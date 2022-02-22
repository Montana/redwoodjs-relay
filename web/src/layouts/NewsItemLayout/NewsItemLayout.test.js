import { render } from '@redwoodjs/testing'

import NewsItemLayout from './NewsItemLayout'

describe('NewsItemLayout', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<NewsItemLayout />)
    }).not.toThrow()
  })
})
