import { Decorator, Module } from './decorator/Decorator';
import { Main } from './controller/main.controller';
import { User } from './controller/user.controller';
import { ToolsService } from './services/tools.service';
import { HttpService } from './services/http.service';

@Module({
    controllers: [Main, User],
    providers: [
        { useClass: 'toolsService', provider: ToolsService },
        { useClass: 'httpService', provider: HttpService }
    ]
})

export class AppModule {

}