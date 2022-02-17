import multer from 'multer';



const uploader = () => {
    const uploadPath = 'downloads/'

    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, uploadPath)
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


