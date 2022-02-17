import { config } from 'dotenv';
config();
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import configs from './config/config';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import errorMiddleware from './middlewares/error';
import bot from './libs/bot'



class App {
    public app: express.Application
    constructor() {
        this.app = express();


        this.initializeMiddlewares();
        this.initializeRoutes();
        this.initializeSwagger();
        this.initializeErrorHandling();
    }

    //initialize middlewares
    private initializeMiddlewares() {
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
    }

    public listen() {
        this.app.listen(configs.connection.port, () => {
            //if (err) console.log(err)
            console.log(`> Ready on ${configs.connection.port}`);
            this.initializeTelegramWebhook()
        })
    }

    public getServer() {
        return this.app;
    }

    //register routes
    private initializeRoutes() {
        const routePath = './routes';
        fs.readdirSync(routePath).forEach(route => {
            const theRoute = route.split('.')[0];
            const ControllerRoute = require(`${routePath}/${theRoute}`);
            const ctrlRoute = new ControllerRoute();
            this.app.use('/api', ctrlRoute.router)
        })

    }

    //initialize telegram webhook url
    private async initializeTelegramWebhook() {
        bot.start((ctx) => ctx.reply(`Hello ${ctx.message.from.first_name}! Upload your spreadsheet (microsoft excel) file let me generate the corresponding JSON file data from it. You can start by typing the command "/upload" to see a sample of excel file format you would be uploading. Then type "/generated" to see the generated JSON sample file`));
        bot.on('document', bot.readDocument);
        bot.command('upload', bot.uploadSample);
        bot.command('generated', bot.generatedSample);

        bot.launch()
    }


    //initialize swagger
    initializeSwagger() {
        const options = {
            swaggerDefinition: {
                info: {
                    title: 'SPREADSHEET TO JSON',
                    version: '2.0.0',
                    description: 'Generates a JSON data from uploaded spreadsheet (excel) file',
                },
                host: configs.connection.host,
                basePath: '/api',
                swagger: '2.0'
            },
            apis: ['swagger.yaml'],
        };

        const specs = swaggerJSDoc(options);
        this.app.use('/api/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
    }

    //error handling
    initializeErrorHandling() {
        this.app.use(errorMiddleware);
    }
}



export default App;