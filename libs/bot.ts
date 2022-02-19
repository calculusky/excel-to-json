import { Telegraf, Context } from "telegraf";
import config from '../config/config';
import Downloader from 'nodejs-file-downloader';
import { getFileData } from "./fileReader";
import path from "path";
import fs from 'fs';
import { nextTick } from "process";





class TelegramBot extends Telegraf {
    constructor(token: string) {
        super(token)
    }


    public readDocument = async (ctx) => {
        try {
            const fileInfo = ctx.update.message.document;

            const fileUrl = await ctx.telegram.getFileLink(fileInfo.file_id);


            //is the file mime-type acceptable?
            if (!(fileInfo.mime_type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                //|| file.mimetype == 'image.jpg'
            )) {
                return ctx.reply('Please try uploading a spreadsheet file');
            }


            //download the file
            const downloader = new Downloader({
                url: fileUrl.href,
                directory: "./downloads"
            })
            await downloader.download()


            //read the downloaded file and analyse the data
            const urlDet = new URL(fileUrl.href);
            const urlPaths = urlDet.pathname.split('/');
            const fileName = urlPaths[urlPaths.length - 1]
            const filepath = path.join(__dirname, `../downloads/${fileName}`);
            const data = await getFileData(filepath);
            fs.unlinkSync(filepath);

            //save the json file to contain the payload to be returned
            const originalFileName = fileInfo.file_name.split('.')[0].toLowerCase();
            const payloadPath = path.join(__dirname, `../uploads/${originalFileName}.json`)
            fs.writeFileSync(payloadPath, JSON.stringify(data, null, 2))


            await ctx.telegram.sendDocument(ctx.chat.id, { source: payloadPath })
            fs.unlinkSync(payloadPath);

        } catch (error) {
            return ctx.reply('Sorry, unable to send file')
        }
    }

    public uploadSample = async (ctx) => {
        try {
            const filepath = path.join(__dirname, `../sample/sample-upload.xlsx`);
            await ctx.telegram.sendDocument(ctx.chat.id, { source: filepath })
        } catch (error) {
            return ctx.reply('Sorry, unable to send file')
        }
    }

    public generatedSample = async (ctx) => {
        try {
            const filepath = path.join(__dirname, `../sample/generated-json.json`);

            const pat = await ctx.telegram.sendDocument(ctx.chat.id, { source: filepath })

            console.log(filepath, '----------------')

        } catch (error) {
            return ctx.reply('Sorry, unable to send file')
        }
    }


}


export default new TelegramBot(config.botToken);