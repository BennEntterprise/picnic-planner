import express from 'express';
import {
  getForecast,
  zipCodeToCoords,
} from '../controllers/weather.controller';

const router = express.Router();

router.post('/zip-to-coords', zipCodeToCoords);
router.get('/forecast', getForecast);

export default router;
