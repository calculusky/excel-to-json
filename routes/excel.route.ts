import { Router } from 'express';
import ExcelController from '../controllers/excel.controller';
import uploader from '../libs/multer';
import config from '../config/config';

class ExcelRoute {
    public excelController = new ExcelController();
    router = Router();

    constructor() {
        this.initializeRoute();
    }

    private initializeRoute() {
        this.router.post('/read-file', uploader(), this.excelController.processFile);
    }
}


module.exports = ExcelRoute;