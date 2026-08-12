import fs from "fs";
import multer from "multer";
import path from "path";

function uploadFolder(req) {
  if (req.baseUrl.includes("/programs")) {
    return "programs";
  }

  return "staff";
}

function slugifyFilenamePart(value, fallback = "upload") {
  const slug = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || fallback;
}

function uploadedFilename(req, file) {
  const extension = path.extname(file.originalname).toLowerCase();

  if (uploadFolder(req) === "staff") {
    const staffName = slugifyFilenamePart(req.body.name, "staff-photo");
    return `${staffName}.avif`;
  }

  const programName = slugifyFilenamePart(req.body.title, "program");

  if (file.fieldname === "gallery_images") {
    const existingGalleryCount = existingGalleryImageCount(req.body.gallery_images);
    req.galleryPhotoIndex = (req.galleryPhotoIndex || existingGalleryCount) + 1;
    return `gallery-photo-${req.galleryPhotoIndex}.png`;
  }

  return `${programName}${extension || ".png"}`;
}

function existingGalleryImageCount(value) {
  if (!value) return 0;

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.length : 0;
  } catch {
    return 0;
  }
}

function destinationFolder(req, file) {
  const folder = uploadFolder(req);

  if (folder === "programs" && file.fieldname === "gallery_images") {
    const programName = slugifyFilenamePart(req.body.title, "program");
    return path.join("programs", `${programName}-gallery`);
  }

  return folder;
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), "uploads", destinationFolder(req, file));

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    cb(null, uploadedFilename(req, file));
  },
});

const upload = multer({
  storage,
  fileFilter(req, file, cb) {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed."));
    }
  },
});

// const upload = multer({
//   storage,

//   limits: {
//     fileSize: 5 * 1024 * 1024,
//   },

//   fileFilter(req, file, cb) {
//     if (file.mimetype.startsWith("image/")) {
//       cb(null, true);
//     } else {
//       cb(new Error("Only image files are allowed."));
//     }
//   },
// });

export default upload;
