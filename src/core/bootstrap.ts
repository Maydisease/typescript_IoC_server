import Koa from 'koa';

export default (app: Koa, appModule: any, port: number) => {
    app.use(async ctx => {

        const requestMethodType = ctx.request.method;
        const requestPath = ctx.request.path;
        ctx.params = JSON.parse(JSON.stringify(ctx.request.body)) || {};
        ctx.query = JSON.parse(JSON.stringify(ctx.request.query)) || {};
        let routeParams = [];
        let message = '路由地址不存在...';

        console.log(';ctx.params;', ctx.params);

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

        // 判断url path长度
        if (urlPathArr.length > 1) {
            controllerName = urlPathArr[1]
            controllerMethodName = urlPathArr[2]
        }

        // 判断url中是否有控制名，或者控制器方法名
        if (!(controllerName && controllerMethodName)) {
            ctx.body = message;
            return;
        }

        appModule.$routerConf.some((routeRule: string) => {
            const key = `${requestMethodType.toLowerCase()}/${controllerName.toLowerCase()}/${controllerMethodName.toLowerCase()}`;
            if (routeRule.indexOf(key) > -1) {
                message = '路由地址存在...';
                console.log(' ----', routeRule);
                const controllerArr = routeRule.split('|')[1].split('/');
                readyRunControllerName = controllerArr[0];
                readyRunControllerMethodName = controllerArr[1];
                readyRunControllerMethodParams = routeRule.split('|')[2] || ''
                return
            }
        });

        console.log('readyRunControllerMethodParams:', readyRunControllerMethodParams);

        if (readyRunControllerName && readyRunControllerMethodName) {
            const params: any = [];
            if (readyRunControllerMethodParams) {
                const tempArr = readyRunControllerMethodParams.split('/');
                console.log(1111, tempArr);
                if (tempArr.length > 0) {
                    tempArr.forEach((item) => {
                        const p = item.split(':');
                        const k = p[0];
                        const v = p[1];
                        console.log('item:', item, 'p:', p);
                        switch (v) {
                            case 'params':
                                params[k] = ctx.params;
                                break;
                            case 'query':
                                params[k] = ctx.query;
                                break;
                            case 'headers':
                                params[k] = ctx.headers;
                                break;
                        }
                    })
                }
            }

            console.log('-x-x-', params);

            message = appModule[readyRunControllerName][readyRunControllerMethodName](...params);
        }

        ctx.body = message;

    });

    app.listen(port);
}