import { Request, Response, NextFunction } from 'express';
import readXlsxFile from 'read-excel-file/node';
import path from 'path';

class ExcelController {

    public readExcel = async (req: Request, res: Response, next: NextFunction) => {

        try {
            const filepath = path.join(__dirname, '../files/Book.xlsx');


            const rows = await readXlsxFile(filepath);
            const [firstRow, ...rest] = rows;


            const data = rest.map((dev) => {
                return dev.reduce((acc, val, idx) => {
                    const key: any = firstRow[idx];
                    return {
                        ...acc,
                        [key]: val
                    }
                }, {})

            })


            res.json({
                data
            })

        } catch (error) {
            next(error)
        }
    }
}

export default ExcelController