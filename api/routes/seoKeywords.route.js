import express from 'express'
import {getProjectsData} from '../controllers/seoKeywords.controller.js'
const router = express.Router();

//router.get('/data', (req, res) => {
//  const projectsData = {
//    "Projects by Developer": ["emanar", "sobha", "nakheel", "damac", "danube", "samana", "miras", "ellington", "binghatti", "aidar", "majid al futtaim", "dubai properties", "dubai south properties", "omniyat", "nshama", "reportage", "deyaar", "mag", "azizi", "wast", "imtiaz", "arada", "tiger", "select group", "expo city", "object 1"],
//    "Projects by Area": ["dubai south", "arjan", "motor city", "meydan city", "al furjan", "arabian ranches", "jumeirah village triangle", "jumeirah golf estate", "town square", "dubai investment park", "dubai islands", "jbr", "dubai production city", "al barari", "damac lagoons", "tilal al ghaf", "emanar south", "dubai canal", "city walk", "the valley", "sobha hartland 2", "expo city dubai", "emirates hills", "majan", "bluewaters island", "jumeirah park"],
//    "Most Searched Areas": ["jumeirah village circle", "dubai land", "mohammed bin rashid city", "business bay", "meydan", "dubai south", "al furjan", "dubai hills estate", "arjan", "jumeirah village triangle", "palm jumeirah", "dubai creek harbour", "the valley", "town square", "downtown dubai", "palm jebel ali", "damac lagoons", "dubai investment park", "studio city", "motor city", "emirates hills", "media city", "jumeirah lake towers", "damac hills", "jumeirah beach residence", "marina"],
//  };

 // res.json(projectsData);
//});
router.get('/projects-data', getProjectsData)

export default router;
