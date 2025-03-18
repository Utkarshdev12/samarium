import { Hono } from 'hono'
import prisma from './prisma.js'
import { serve } from '@hono/node-server'

const app = new Hono()

app.get('/countries', async (c) => {
  const countries = await prisma.country.findMany()
  return c.json(countries)
})

app.post('/countries', async (c) => {
  const { name, countryCode } = await c.req.json()
  const country = await prisma.country.create({
    data: {
      name,
      countryCode: countryCode,
    },
  })
  return c.json(country, 201)
})

app.get
app.patch('/countries/:countryCode', async (c) => {
  const countryCode = c.req.param('countryCode')
  const { name } = await c.req.json()

  const country = await prisma.country.update({
    where: { countryCode: countryCode },
    data: { name },
  })

  return c.json(country)
})

app.delete('/countries/:countryCode', async (c) => {
  const countryCode = c.req.param('countryCode')

  await prisma.country.delete({
    where: { countryCode: countryCode },
  })

  return c.json({ message: 'Country deleted successfully' })
})


serve({
  fetch: app.fetch,
  port: 3000,
}, (info) => {
  console.log(`✅ Server is running on http://localhost:${info.port}`)
})
