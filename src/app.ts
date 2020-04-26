import { AppModule } from './appModule';
import bootstrap from './core/bootstrap';
import Koa from 'koa';

const app = new Koa();

bootstrap(app, new AppModule(), 3000);