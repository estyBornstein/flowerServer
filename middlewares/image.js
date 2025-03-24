import multer  from "multer";


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null,'public');
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  });
  
  const upload = multer({ storage: storage }).single('file');

 export const uploadImage = (req, res, next) => {
    upload(req, res, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error uploading image.');
      }
      next(); // אחרי שהעלאת התמונה הצליחה, נמשיך לפונקציה הבאה
    });
  };
  