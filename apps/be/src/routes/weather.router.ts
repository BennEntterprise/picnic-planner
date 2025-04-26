import express from 'express';
import { zipCodeToCoords } from '../controllers/weather.controller';

const router = express.Router();

router.post('/zip-to-coords', zipCodeToCoords);

export default router;
