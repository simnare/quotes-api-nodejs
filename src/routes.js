import express from 'express'

const router = express.Router()

router.get('/', function (req, res) {
  res.json("ola");
})

export default router
