import fs from 'fs';
import multer from 'multer';
import path from 'path';



const uploader = () => {

    const downloadPath = path.join(__dirname, '../downloads');
    if (!fs.existsSync(downloadPath)) fs.mkdirSync(downloadPath);

    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, downloadPath)
        },
        filename: (req, file, cb) => {
            if (file.mimetype == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
                const fileName = `${file.fieldname}-${Date.now()}.xlsx`;
                return cb(null, fileName)
            }

            const ext = file.mimetype.split('/')[1]
            cb(null, `${file.fieldname}-${Date.now()}.${ext}`)

        }
    })

    const fileFilter = (req, file, cb) => {
        if (!(file.mimetype == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            //|| file.mimetype == 'image.jpg'
        )) {
            return cb(null, false)
        }
        cb(null, true)
    }



    const upload = multer({ storage, fileFilter });
    return upload.single('uploadFile')

}

export default uploader;


