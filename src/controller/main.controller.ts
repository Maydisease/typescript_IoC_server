import {Decorator, Controller, Inject, Get, Post, Params, Query, Headers} from '../decorator/Decorator'
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
        
    }

    @Get('SYSTEM_RUN_STATE')
    public getSystemRunState(@Params() params: Object, @Query() query: Object, @Headers() headers: Object) {

        console.log('params:', params);
        console.log('query:', query);
        console.log('headers:', headers);

        return {cpuNum: 4, memory: 2048, ...this.httpService.get()}
    }

    @Post('CONFIG_LIST')
    public updateConfigList() {
        
    }

    @Post('SYSTEM_RUN_STATE')
    public updateSystemRunState(@Params() params: Object, @Query() query: Object, @Headers() headers: Object) {
        
        console.log('params:', params);
        console.log('query:', query);
        console.log('headers:', headers);

        return {cpuNum: 4, memory: 2048, ...this.httpService.get()}
    }
}

export {Main}