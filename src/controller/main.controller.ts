import {Decorator, Controller, Inject, Get, Post} from '../decorator/Decorator'
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
    public getSystemRunState() {
        return {cpuNum: 4, memory: 2048}
    }

    @Post('CONFIG_LIST')
    public updateConfigList() {
        
    }

    @Post('SYSTEM_RUN_STATE')
    public updateSystemRunState() {

    }
}

export {Main}