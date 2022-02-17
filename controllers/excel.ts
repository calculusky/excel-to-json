import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import { getFileData } from '../libs/fileReader';

class ExcelController {

    public processFile = async (req: Request, res: Response, next: NextFunction) => {


        if (!req.file) return res.status(400).json({ message: 'Invalid file' })

        try {
            const filepath = path.join(__dirname, `../downloads/${req.file.filename}`);

            const data = await getFileData(filepath);

            // delete the file
            fs.unlinkSync(filepath)
            res.json({ data })

        } catch (error) {
            next(error)
        }
    }


}

export default ExcelController