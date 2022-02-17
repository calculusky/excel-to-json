import readXlsxFile from 'read-excel-file/node';


export const getFileData = async (filePath: string) => {
    const rows = await readXlsxFile(filePath);
    const [firstRow, ...rest] = rows;

    return rest.map((dev) => {
        return dev.reduce((acc, val, idx) => {
            const key: any = firstRow[idx];
            return {
                ...acc,
                [key]: val
            }
        }, {})

    })
}


