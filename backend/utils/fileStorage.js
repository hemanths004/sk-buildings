const multer = require("multer");
const path = require("path");

// storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = "uploads/";

    if (
      file.fieldname === "aadhaar" ||
      req.originalUrl.includes("/aadhaar") ||
      req.body.type === "aadhaar"
    ) {
      folder += "aadhaar/";
    } else if (
      file.fieldname === "agreement" ||
      req.originalUrl.includes("/agreement") ||
      req.body.type === "agreement"
    ) {
      folder += "agreements/";
    } else {
      folder += "documents/";
    }

    cb(null, folder);
  },

  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9) + ext;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });
module.exports = upload;
