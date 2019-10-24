'use strict'

import express from 'express'
import exchangeRouter from './exchange/routes'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use('/api', exchangeRouter)

app.use((err, req, res, next) => {
  res.status(500).send('Something broke!')
})

export default app
