import express from 'express';
import statusRouter from './status.js';
import helloRouter from './hello.js';
import crudRouter from './crud.js';

const router = express.Router();

router.use(statusRouter);
router.use(helloRouter);
router.use(crudRouter);

export default router; 