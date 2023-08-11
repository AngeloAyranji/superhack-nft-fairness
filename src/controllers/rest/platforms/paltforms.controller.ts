import { Controller, Inject } from "@tsed/di";
import { Exception } from "@tsed/exceptions";
import { QueryParams } from "@tsed/platform-params";
import { Get, Post, Delete, Returns, Tags } from "@tsed/schema";
import { PlatformService } from "../../../app-services/platform/platform.service";
import { PlatformResponse } from "../../../dtos/response/platform.response";
import { PlatformRequest } from "../../../dtos/request/platform.request";

@Controller("/platforms")
@Tags("Platform")
export class PlatformController {

    @Inject(PlatformService)
    protected service: PlatformService;

    @Get("/")
    @Returns(200, Array).Of(PlatformResponse)
    public async getPlatforms(@QueryParams("filter") filter?: string): Promise<Array<PlatformResponse>> {
        try {
            return filter
                ? await this.service.getPlatforms(JSON.parse(filter))
                : await this.service.getPlatforms();
        } catch (err) {
            throw new Exception(err.status, err.message);
        }
    }

    @Post("/")
    @Returns(200, Boolean)
    public async createPlatform(@QueryParams("payload") payload: PlatformRequest): Promise<PlatformResponse> {
        try {
            return await this.service.createPlatform(payload);
        } catch (err) {
            throw new Exception(err.status, err.message);
        }
    }

    @Delete("/")
    @Returns(200, Boolean)
    public async removePlatform(@QueryParams("platformId") platformId: string): Promise<boolean> {
        try {
            return await this.service.removePlatform(platformId)
        } catch (err) {
            throw new Exception(err.status, err.message);
        }
    }
}