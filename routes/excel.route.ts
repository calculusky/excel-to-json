import { Router } from 'express';
import ExcelController from '../controllers/excel.controller';

class ExcelRoute {
    public excelController = new ExcelController();
    router = Router();

    constructor() {
        this.initializeRoute();
    }

    private initializeRoute() {
        this.router.get('/read-excel', this.excelController.readExcel);
    }
}


module.exports = ExcelRoute;