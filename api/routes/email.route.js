import express from 'express';
import { sendJobApplicationCairo,sendJobApplicationDubai,sendContactEmail,listYourProperty,registerInterest } from '../controllers/email.controller.js';
import multer from 'multer';

const router = express.Router();

// Configure Multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/send-application/cairo', upload.single('cv'), sendJobApplicationCairo);
router.post('/send-application/dubai', upload.single('cv'), sendJobApplicationDubai);
router.post('/contact-us', sendContactEmail);
router.post('/list-your-property', listYourProperty);
router.post("/register-interest", registerInterest);

export default router;
