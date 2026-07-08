const express = require('express');
const Router = express.Router();
 const mapControllers=require('../controllers/map.controllers');
const authMiddleware=require('../middlewares/auth_middleware')

const {query} = require('express-validator');
Router.get(
  "/get-coordinates",
  query("address").isString().isLength({ min: 3 }),
  authMiddleware.authUser,
  mapControllers.getCoordinates 
);

Router.get('/get-distance-time',query("origin").isString().isLength({min: 3}),
query("destination").isString().isLength({min: 3}),
authMiddleware.authUser,
mapControllers.getDistanceTime

),

Router.get('/get-suggestions',query('input').isString().isLength({min: 3}),authMiddleware.authUser,mapControllers.getAutoCompleteSuggestion)




module.exports = Router;