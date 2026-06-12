const express = require("express");
const router = express.Router();

const upload = require("../utils/fileStorage");
const { uploadAadhaar, uploadAgreement, uploadPropertyDocument, uploadFounderImage, uploadImage } = require("../controllers/uploadController");

// Tenant ID is passed in URL
router.post("/aadhaar/:tenantId", upload.single("aadhaar"), uploadAadhaar);
router.post("/agreement/:tenantId", upload.single("agreement"), uploadAgreement);

// General property document upload (returns URL only)
router.post("/property-document", upload.single("document"), uploadPropertyDocument);

// Founder image upload
router.post("/founder-image", upload.single("image"), uploadFounderImage);

// Generic image upload
router.post("/image", upload.single("image"), uploadImage);

module.exports = router;