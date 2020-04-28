import {Decorator, Controller, Inject, Get, Post, Params, Query, Headers} from '../decorator/decorator'
import {ToolsService} from '../services/tools.service';
import {HttpService} from '../services/http.service';

@Controller("MAIN")
class Main {
    
    constructor(
        @Inject('toolsService') 
        public toolsService: ToolsService,
        @Inject('httpService') 
        public httpService: HttpService
    ) {
    }
    
    @Get('CONFIG_LIST')
    public getConfigList() {
        return {'controller': 'main', 'medthod': 'CONFIG_LIST -> getConfigList'}
    }

    @Get('SYSTEM_RUN_STATE')
    public getSystemRunState(@Params() params: Object, @Query() query: Object, @Headers() headers: Object) {
        return {cpuNum: 4, memory: 2048, ...this.httpService.get()}
    }

    @Post('CONFIG_LIST')
    public updateConfigList() {
        return {'controller': 'main', 'medthod': 'CONFIG_LIST -> getConfigList'}
    }

    @Post('SYSTEM_RUN_STATE')
    public updateSystemRunState(@Params() params: Object, @Query() query: Object, @Headers() headers: Object) {
        return {cpuNum: 4, memory: 2048, ...this.httpService.get()}
    }
}

export {Main}