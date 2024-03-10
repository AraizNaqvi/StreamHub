import multer from "multer";


// Destination: where the file will be uploaded
// Filename: here we use the original name of file as the user enters
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/temp')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
  
// this is this.storage = storage but in ES6 we can use this syntax
export const upload = multer({ storage  })