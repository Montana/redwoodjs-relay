import {
  newsItems,
  newsItem,
  createNewsItem,
  updateNewsItem,
  deleteNewsItem,
} from './newsItems'

describe('newsItems', () => {
  scenario('returns all newsItems', async (scenario) => {
    const result = await newsItems()

    expect(result.length).toEqual(Object.keys(scenario.newsItem).length)
  })

  scenario('returns a single newsItem', async (scenario) => {
    const result = await newsItem({ id: scenario.newsItem.one.id })

    expect(result).toEqual(scenario.newsItem.one)
  })

  scenario('creates a newsItem', async () => {
    const result = await createNewsItem({
      input: {
        title: 'String',
        body: 'String',
        writtenBy: 'String',
        imageUrl: 'String',
      },
    })

    expect(result.title).toEqual('String')
    expect(result.body).toEqual('String')
    expect(result.writtenBy).toEqual('String')
    expect(result.imageUrl).toEqual('String')
  })

  scenario('updates a newsItem', async (scenario) => {
    const original = await newsItem({ id: scenario.newsItem.one.id })
    const result = await updateNewsItem({
      id: original.id,
      input: { title: 'String2' },
    })

    expect(result.title).toEqual('String2')
  })

  scenario('deletes a newsItem', async (scenario) => {
    const original = await deleteNewsItem({ id: scenario.newsItem.one.id })
    const result = await newsItem({ id: original.id })

    expect(result).toEqual(null)
  })
})
