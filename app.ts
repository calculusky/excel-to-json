import { config } from 'dotenv';
config();
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import configs from './config/config';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import errorMiddleware from './middlewares/error.middleware';
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
            const ControllerRoute = require(`${routePath}/${route}`);
            const ctrlRoute = new ControllerRoute();
            this.app.use('/api', ctrlRoute.router)
        })

    }

    //initialize telegram webhook url
    private async initializeTelegramWebhook() {



        bot.start((ctx) => ctx.reply(`
            Hello ${ctx.message.from.first_name}! I will help you transform your data in spreadsheet (excel document) into a JSON payload document`
        ));
        bot.on('document', bot.readDocument)


        bot.launch()
    }


    //initialize swagger
    initializeSwagger() {
        const options = {
            swaggerDefinition: {
                info: {
                    title: 'JSON PAYLOAD GENERATOR SERVICE',
                    version: '2.0.0',
                    description: 'Generates a JSON payload data from uploaded file (spreadsheet) data',
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