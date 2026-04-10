import express from 'express';
import { addSchool, getSchools } from './controller.js';

const router = express.Router();

router.post('/addSchool',addSchool);
router.get('/listSchools',getSchools);

export default router;