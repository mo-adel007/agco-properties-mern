// routes/pageMetaRoutes.js

import express from "express";
import {
  getPageMetas,
  getPageMeta,
  upsertPageMeta,
} from "../controllers/page.controller.js";

const router = express.Router();

router.get("/", getPageMetas);
router.get("/:slug", getPageMeta);
router.put("/:slug", upsertPageMeta);

export default router;
