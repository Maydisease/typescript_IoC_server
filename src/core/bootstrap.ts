import Koa from 'koa';

export default (app: Koa, appModule: any, port: number) => {
    app.use(async ctx => {

        const requestMethodType = ctx.request.method;
        const requestUrl = ctx.request.url;

        if(requestUrl === '/favicon.ico') {
            return;
        }

        let controllerName = '';
        let controllerMethodName = '';
        let readyRunControllerName = '';
        let readyRunControllerMethodName = '';
        const urlPathArr = requestUrl.split('/');

        if (urlPathArr.length > 0) {
            controllerName = urlPathArr[1]
            controllerMethodName = urlPathArr[2]
        }

        let message      = '路由地址不存在...';
        const routerConf = appModule.$routerConf;

        routerConf.some((routeRule: string) => {
            const key = `${requestMethodType.toLowerCase()}/${controllerName.toLowerCase()}/${controllerMethodName.toLowerCase()}`;
            if(routeRule.indexOf(key) > -1) {
                message = '路由地址存在...';
                const arr = routeRule.split('|')[1].split('/');
                readyRunControllerName = arr[0];
                readyRunControllerMethodName = arr[1];
                return
            }
        });

        if(readyRunControllerName && readyRunControllerMethodName) {
            message = appModule[readyRunControllerName][readyRunControllerMethodName]();
        }

        ctx.body = message;

    });

    app.listen(port);
}