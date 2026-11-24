import {Controller, Get} from '@nestjs/common';
import {HealthService} from "./health.service.js";
import {HealthCheck} from "@nestjs/terminus";

@Controller('health')
export class HealthController {
    constructor(private healthService: HealthService) {
    }

    @Get('')
    @HealthCheck()
    live(){
        return this.healthService.check();
    }
}
