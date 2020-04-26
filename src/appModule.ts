import { Decorator, Module } from './decorator/Decorator';
import { Main } from './controller/main.controller';
import { User } from './controller/user.controller';
import { ToolsService } from './services/tools.service';

@Module({
    controllers: [Main, User],
    providers: [
        { useClass: 'toolsService', provider: ToolsService }
    ]
})

export class AppModule {

}