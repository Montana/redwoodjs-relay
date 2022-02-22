import { db } from 'src/lib/db'
import { requireAuth } from 'src/lib/auth'

// Used when the environment variable REDWOOD_SECURE_SERVICES=1
/*
export const beforeResolver = (rules) => {
  rules.add(requireAuth)
}
*/
export const newsItems = () => {
  return db.newsItem.findMany()
}

export const newsItem = ({ id }) => {
  return db.newsItem.findUnique({
    where: { id },
  })
}

export const createNewsItem = ({ input }) => {
  return db.newsItem.create({
    data: input,
  })
}

export const updateNewsItem = ({ id, input }) => {
  return db.newsItem.update({
    data: input,
    where: { id },
  })
}

export const deleteNewsItem = ({ id }) => {
  return db.newsItem.delete({
    where: { id },
  })
}
