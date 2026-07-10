import express from 'express'
import { getTechnologiesController, postTechnologyController } from '../controllers/projectController.js'

const router = express.Router()
router.get('/', getTechnologiesController)
router.post('/', postTechnologyController)
export { router }