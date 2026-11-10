import { Router } from 'express'
import { taxonomyController } from './taxonomy.controller.js'

export const taxonomyRouter = Router()

taxonomyRouter.get('/languages', taxonomyController.getLanguages)
taxonomyRouter.get('/categories', taxonomyController.getCategories)
taxonomyRouter.get('/states', taxonomyController.getStates)
taxonomyRouter.get('/districts', taxonomyController.getDistricts)
taxonomyRouter.get('/tags', taxonomyController.getTags)
