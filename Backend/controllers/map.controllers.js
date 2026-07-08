const { validationResult } = require("express-validator");
const mapServices = require("../services/map.services");

module.exports.getCoordinates = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  const { address } = req.query;

  try {
    const coordinates = await mapServices.getAddressCoordinate(address);

    return res.status(200).json(coordinates);
  } catch (e) {
    return res.status(404).json({
      message: "Coordinates not found",
    });
  }
};

module.exports.getDistanceTime = async (req,res,next) => {
    try {
        const errors=validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }
        const {origin,destination}=req.query;

        const distanceTime = await mapServices.getDistanceTime(origin,destination);
        res.status(200).json(distanceTime);
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message:'Internal server error'});
        
    }
}

module.exports.getAutoCompleteSuggestion = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { input } = req.query;

    const suggestions = await mapServices.getAutoCompleteSuggestion(input);

    return res.status(200).json(suggestions);

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};