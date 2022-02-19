import { Telegraf, Context } from "telegraf";
import config from '../config/config';
import Downloader from 'nodejs-file-downloader';
import { getFileData } from "./fileReader";
import path from "path";
import fs from 'fs';






class TelegramBot extends Telegraf {
    constructor(token: string) {
        super(token)
    }

    private samplePath = path.join(__dirname, '../sample');
    private downloader = async (fileUrl: string, dirPath: string) => {
        //download the file
        const downloader = new Downloader({
            url: fileUrl,
            directory: dirPath
        })
        return await downloader.download()
    }

    private mimeTypes = {
        excel: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    }


    public readDocument = async (ctx) => {
        try {
            const fileInfo = ctx.update.message.document;

            const fileUrl = await ctx.telegram.getFileLink(fileInfo.file_id);

            //is the file mime-type acceptable?
            if (!(fileInfo.mime_type == this.mimeTypes.excel)) {
                return ctx.reply('Please try uploading a spreadsheet file');
            }

            //download the file
            await this.downloader(fileUrl.href, path.join(__dirname, '../downloads'));


            //read the downloaded file and analyse the data
            const urlDet = new URL(fileUrl.href);
            const urlPaths = urlDet.pathname.split('/');
            const fileName = urlPaths[urlPaths.length - 1]
            const filepath = path.join(__dirname, `../downloads/${fileName}`);
            const data = await getFileData(filepath);
            fs.unlinkSync(filepath);

            //save the json file to contain the payload to be returned
            const originalFileName = fileInfo.file_name.split('.')[0].toLowerCase();

            //set up dir for upload
            const uploadDir = path.join(__dirname, `../uploads`);
            if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir)

            const payloadPath = path.join(__dirname, `../uploads/${originalFileName}.json`)
            fs.writeFileSync(payloadPath, JSON.stringify(data, null, 2))
            await ctx.telegram.sendDocument(ctx.chat.id, { source: payloadPath })
            fs.unlinkSync(payloadPath);

        } catch (error) {
            return ctx.reply('Sorry, unable to send file')
        }
    }



    public uploadSample = async (ctx: Context) => {
        const sampleExcelUrl = 'https://storage.googleapis.com/nedu_bucket/excel_to_json/sample-upload.xlsx';
        try {
            await this.downloader(sampleExcelUrl, this.samplePath);
            const sampleExcel = path.join(__dirname, '../sample/sample-upload.xlsx');
            await ctx.telegram.sendChatAction(ctx.chat.id, 'upload_document');
            await ctx.telegram.sendDocument(ctx.chat.id, { source: sampleExcel })
            if (fs.existsSync(sampleExcel)) fs.unlinkSync(sampleExcel);
        } catch (error) {
            return ctx.reply('Sorry, unable to send file')
        }
    }



    public generatedSample = async (ctx: Context) => {
        const sampleJsonUrl = 'https://storage.googleapis.com/nedu_bucket/excel_to_json/generated-json.json';

        try {
            await this.downloader(sampleJsonUrl, this.samplePath);
            const sampleJson = path.join(__dirname, '../sample/generated-json.json');
            await ctx.telegram.sendChatAction(ctx.chat.id, 'upload_document');
            await ctx.telegram.sendDocument(ctx.chat.id, { source: sampleJson });
            if (fs.existsSync(sampleJson)) fs.unlinkSync(sampleJson);

        } catch (error) {
            console.log(error)
            return ctx.reply('Sorry, unable to send file')
        }
    }


}


export default new TelegramBot(config.botToken);