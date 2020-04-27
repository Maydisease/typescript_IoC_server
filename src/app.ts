import { AppModule } from './appModule';
import bootstrap from './core/bootstrap';
import Koa from 'koa';
import BodyParser from 'koa-bodyparser';

const app = new Koa();

app.use(BodyParser());

bootstrap(app, new AppModule(), 3000);