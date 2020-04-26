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
                                injectServiceList.push(item.provider);
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

    public static controller(controlName: string) {

        return <T extends { new(...args: any[]): {} }>(target: T) => {

            let className = new target().constructor.name;
            const tempControllerRouterMap = Decorator.TempRouterMap.get(className);
            const tempRoute: any = {};

            if (tempControllerRouterMap) {
                for (let key in tempControllerRouterMap) {
                    const route = tempControllerRouterMap[key];
                    const methodName = key.split('/')[0];
                    const methodType = key.split('/')[1];
                    Decorator.NewRouterList.push(`${methodType.toLowerCase()}/${controlName.toLowerCase()}/${route.path.toLowerCase()}|${className}/${methodName}`);
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
}

const Inject = Decorator.inject
const Module = Decorator.module
const Controller = Decorator.controller
const Get =  Decorator.get
const Post = Decorator.post

export {Decorator, Inject, Module, Controller, Get, Post}