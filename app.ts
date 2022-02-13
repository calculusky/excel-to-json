
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import config from './config/config';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import errorMiddleware from './middlewares/error.middleware';
// import ControllerRoute from './routes/excel.route';


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
        this.app.listen(config.connection.port, () => {
            //if (err) console.log(err)
            console.log(`> Ready on ${config.connection.port}`);
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

    //initialize swagger
    initializeSwagger() {
        const options = {
            swaggerDefinition: {
                info: {
                    title: 'EXCEL SERVICE API',
                    version: '1.0.0',
                    description: 'Documentation for excel service API ',
                },
                host: config.connection.host,
                swagger: '2.0'
            },
            apis: ['swagger.yaml'],
        };

        const specs = swaggerJSDoc(options);
        this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
    }

    //error handling
    initializeErrorHandling() {
        this.app.use(errorMiddleware);
    }
}



export default App;