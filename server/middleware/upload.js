const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "image") {
      cb(null, "./public/uploads/images/");
    } else if (file.fieldname === "video") {
      cb(null, "./public/uploads/videos/");
    } else if (file.fieldname === "music") {
      cb(null, "./public/uploads/musics/");
    } else if (file.fieldname === "tv") {
      cb(null, "./public/uploads/tv/");
    } else if (file.fieldname === "radio") {
      cb(null, "./public/uploads/radio/");
    } else {
      const error = new Error("Unknown field name");
      error.status = 400;
      cb(error, false);
    }
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.originalname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === "image") {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, true);
    } else {
      const error = new Error("Unsupported image file type");
      error.status = 415;
      cb(error, false);
    }
  } else if (file.fieldname === "video" || file.fieldname === "tv") {
    if (file.mimetype === "video/mp4" || file.mimetype === "video/ogg") {
      cb(null, true);
    } else {
      const error = new Error("Unsupported video file type");
      error.status = 415;
      cb(error, false);
    }
  } else if (file.fieldname === "music" || file.fieldname === "radio") {
    if (file.mimetype.split("/")[1].match(/(mpeg)/)) {
      cb(null, true);
    } else {
      const error = new Error("Unsupported file type");
      error.status = 415;
      cb(error, false);
    }
  } else if (file.mimetype === "video/mp4" || file.mimetype === "video/ogg") {
    cb(null, true);
  } else {
    const error = new Error("Unsupported video file type");
    error.status = 415;
    cb(error, false);
  }
};

module.exports = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 15,
  },
  fileFilter: fileFilter,
});
