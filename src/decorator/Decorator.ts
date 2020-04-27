import "reflect-metadata";


interface ProviderType {
    useClass: string
    provider: any
}

interface DecoratorModuleOption {
    controllers: any[],
    providers: ProviderType[]

}

class Decorator {

    public static controllerServiceMap = new Map();
    public static TempRouterMap = new Map();
    public static NewRouterList: string[] = [];
    public static ControllerMedthodParams = new Map();

    // 注入装饰器
    public static inject(serivceName: string) {
        console.log('controll fn param');
        return function (target: any, propertyKey: string | symbol, parameterIndex: number) {
            let className = new target().constructor.name;
            let source = Decorator.controllerServiceMap.get(className);
            if (!source) {
                source = { [parameterIndex]: { providerName: serivceName, serivceParamName: '' } };
            } else {
                source[parameterIndex] = { providerName: serivceName, serivceParamName: '' };
            }
            Decorator.controllerServiceMap.set(className, source);
        }
    }

    // 模块装饰器
    public static module(options: DecoratorModuleOption) {

        const controllerList = options.controllers;
        const providerList = options.providers;

        return function <T extends { new(...args: any[]): {} }>(target: T) {

            controllerList.forEach((controller: any) => {
                const className = new controller().constructor.name;
                const classParamMap = Decorator.controllerServiceMap.get(className);
                if (classParamMap) {
                    const injectServiceList: any[] = [];
                    for (let key in classParamMap) {
                        const service = classParamMap[key];
                        providerList.some((item: any, index: number) => {
                            if (service.providerName === item.useClass) {
                                injectServiceList.push(new item.provider());
                                return
                            }
                        })
                    }
                    target.prototype[className] = new controller(...injectServiceList);
                } else {
                    target.prototype[className] = new controller();
                }
            })


            target.prototype.$routerConf = Decorator.NewRouterList;

            return target;
        }
    }

    // 控制器的装饰器
    public static controller(controlName: string) {

        return <T extends { new(...args: any[]): {} }>(target: T) => {

            let className = new target().constructor.name;
            const tempControllerRouterMap = Decorator.TempRouterMap.get(className);
            const tempControllerMedthodParams = Decorator.ControllerMedthodParams.get(className);
            const tempRoute: any = {};

            if (tempControllerRouterMap) {
                for (let key in tempControllerRouterMap) {
                    const route = tempControllerRouterMap[key];
                    const methodName = key.split('/')[0];
                    const methodType = key.split('/')[1];
                    let paramsStr = '';
                    console.log('tempControllerMedthodParams:', tempControllerMedthodParams, 'methodName:', methodName, 'methodType:', methodType);
                    if(tempControllerMedthodParams && tempControllerMedthodParams[methodName]) {
                        for(let key in tempControllerMedthodParams[methodName]){
                            console.log('-----', key, methodName, tempControllerMedthodParams[methodName][key]);
                            console.log('----9', `${key}:${tempControllerMedthodParams[methodName][key]}`);
                            paramsStr += `${key}:${tempControllerMedthodParams[methodName][key]}/`;
                        }
                        paramsStr = paramsStr.substring(0, paramsStr.length - 1);
                    }

                    let routeStr = `${methodType.toLowerCase()}/${controlName.toLowerCase()}/${route.path.toLowerCase()}|${className}/${methodName}`;
                    routeStr += (paramsStr ? `|${paramsStr}` : '');
                    Decorator.NewRouterList.push(routeStr);
                }
            }

            const source = Decorator.controllerServiceMap.get(className);
            const regx = /constructor\((.+?)\)/
            regx.test(target.toString());
            const constructorParams = RegExp.$1.split(',');
            constructorParams.forEach((paramName, index) => {
                if (source && source[index]) {
                    source[index].serivceParamName = paramName;
                }
                Decorator.controllerServiceMap.set(className, source)
            })

            return target;
        }
    }

    // 控制器内POST的方法路径名
    public static post(path: string) {
        return function (target: any, methodName: string, descriptor: PropertyDescriptor) {
            const controllerName = target.constructor.name;
            let source = Decorator.TempRouterMap.get(controllerName);

            if (source) {
                source[`${methodName}/post`] = { path}
            } else {
                source = { [`${methodName}/post`]: { path} };
            }

            Decorator.TempRouterMap.set(controllerName, source)
        }
    }

        // 控制器内GET的方法路径名
    public static get(path: string) {
        return function (target: any, methodName: string, descriptor: PropertyDescriptor) {
            const controllerName = target.constructor.name;
            let source = Decorator.TempRouterMap.get(controllerName);

            if (source) {
                source[`${methodName}/get`] = { path}
            } else {
                source = { [`${methodName}/get`]: { path} };
            }

            Decorator.TempRouterMap.set(controllerName, source)
        }
    }

    // 控制器内方法内的POST参数
    public static params() {
        return function <T extends { new(...args: any[]): {} }>(target: T, methodName: string, paramIndex: number) {
            console.log('$params', target, methodName, paramIndex);
            const controllerName = target.constructor.name;
            let source = Decorator.ControllerMedthodParams.get(controllerName);

            console.log(source);

            if (source) {
                source[methodName] = {...source[methodName], [paramIndex]: 'params'};
            } else {
                source = { [methodName]: { [paramIndex]: 'params'} };
            }

            Decorator.ControllerMedthodParams.set(controllerName, source)
        }
    }

    // 控制器内方法内的GET参数
    public static query() {
        return function <T extends { new(...args: any[]): {} }>(target: T, methodName: string, paramIndex: number) {
            console.log('$query', target, methodName, paramIndex);
            const controllerName = target.constructor.name;
            let source = Decorator.ControllerMedthodParams.get(controllerName);

            console.log(source);

            if (source) {
                source[methodName] = {...source[methodName], [paramIndex]: 'query'};
            } else {
                source = { [methodName]: { [paramIndex]: 'query'} };
            }

            Decorator.ControllerMedthodParams.set(controllerName, source)
        }
    }

    // 控制器内方法内的请求头
    public static headers() {
        return function <T extends { new(...args: any[]): {} }>(target: T, methodName: string, paramIndex: number) {
            console.log('$headers', target, methodName, paramIndex);
            const controllerName = target.constructor.name;
            let source = Decorator.ControllerMedthodParams.get(controllerName);

            console.log(source);

            if (source) {
                source[methodName] = {...source[methodName], [paramIndex]: 'headers'};
            } else {
                source = { [methodName]: {[paramIndex]: 'headers'} };
            }

            Decorator.ControllerMedthodParams.set(controllerName, source)
        }
    }
}

const Inject = Decorator.inject
const Module = Decorator.module
const Controller = Decorator.controller
const Get =  Decorator.get
const Post = Decorator.post
const Params = Decorator.params
const Query = Decorator.query
const Headers = Decorator.headers

export {Decorator, Inject, Module, Controller, Get, Post, Params, Query, Headers}