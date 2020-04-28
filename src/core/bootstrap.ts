import Koa from 'koa';

export default (app: Koa, appModule: any, port: number) => {
    app.use(async ctx => {

        const requestMethodType = ctx.request.method;
        const requestPath = ctx.request.path;
        ctx.params = JSON.parse(JSON.stringify(ctx.request.body)) || {};
        ctx.query = JSON.parse(JSON.stringify(ctx.request.query)) || {};
        let messageObject: any = {message: '路由地址不存在...'};

        // 不处理默认的浏览器发出的favicon.ico请求
        if (requestPath === '/favicon.ico') {
            return;
        }

        let controllerName = '';
        let controllerMethodName = '';
        let readyRunControllerName = '';
        let readyRunControllerMethodName = '';
        let readyRunControllerMethodParams = '';
        const urlPathArr = requestPath.split('/');
        controllerName = urlPathArr[1] || ''
        controllerMethodName = urlPathArr[2] || ''

        // 判断url中是否有控制名，或者控制器方法名
        if (!(controllerName && controllerMethodName)) {
            ctx.body = messageObject;
            return;
        }

        appModule.$routerConf.some((routeRule: string) => {
            const key = `${requestMethodType.toLowerCase()}/${controllerName.toLowerCase()}/${controllerMethodName.toLowerCase()}`;
            if (routeRule.indexOf(key) > -1) {
                const controllerArr = routeRule.split('|')[1].split('/');
                readyRunControllerName = controllerArr[0];
                readyRunControllerMethodName = controllerArr[1];
                readyRunControllerMethodParams = routeRule.split('|')[2] || '';
                return
            }
        });

        if (readyRunControllerName && readyRunControllerMethodName) {
            const params: any = [];
            const medthodParams = readyRunControllerMethodParams.split('/');
            if (medthodParams.length > 0) {
                medthodParams.forEach((item) => {
                    const p = item.split(':');
                    const k = p[0];
                    const v = p[1];
                    params[k] = ctx[v];
                })
            }
            messageObject = appModule[readyRunControllerName][readyRunControllerMethodName](...params);
        } else {
            messageObject = {message: '404'};
        }

        ctx.body = messageObject;

    });

    app.listen(port, 'localhost', () => {
        console.log(`listen http://localhost:${port}`);
        console.log(`route list \n`);
        appModule.$routerConf.forEach((item: string) => {
            console.log(item);
        })
    });
}