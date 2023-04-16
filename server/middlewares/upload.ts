import multer from "multer";

const upload = () => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./uploads/userAvatar");
    },
    filename: function (req, file, cb) {
      cb(null, `user-avatar-${Date.now()}-${file.originalname}`);
    },
  });

  const upload = multer({ storage });
  return [upload.single("image"), upload.none()];
};

export default upload;
