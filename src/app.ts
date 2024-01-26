import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';

import * as middleware from './middleware';
import api from './api';

require('dotenv').config();

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api', api);

app.use(middleware.notFound);
app.use(middleware.errorHandler);

app.disable('etag');

export default app;
