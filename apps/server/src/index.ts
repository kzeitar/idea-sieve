import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono()

app.use('/*', cors())

app.get('/', (c) => c.text('Idea Sieve API'))

export default app
