import { Inject, Service } from "@tsed/di";
import { Exception, NotFound } from "@tsed/exceptions";
import { PlatformRequest } from "../../dtos/request/platform.request"
import { PlatformResponse } from "../../dtos/response/platform.response";
import { PLATFORM_REPOSITORY } from "../../repositories/platform.repository";


// Service containing functions to communicate with database
@Service()
export class PlatformService {

  @Inject(PLATFORM_REPOSITORY)
  protected repository: PLATFORM_REPOSITORY;

  // fetch platforms from database (filter is optional)
  public async getPlatforms(filter?: any): Promise<Array<PlatformResponse>> {
    try {
      const platforms = filter ? await this.repository.find(filter) : await this.repository.find();
      if (!platforms) return [];
      return platforms;
    } catch (error) {
      throw new NotFound(error.message);
    }
  }

  // add new platform to database
  public async createPlatform(payload: PlatformRequest): Promise<PlatformResponse> {
    try {
      payload.contractAddress = payload.contractAddress.toLocaleLowerCase();
      return await this.repository.save({ ...payload });
    } catch (error) {
      throw new Exception(500, error.message);
    }
  }

  // remove platform from database
  public async removePlatform(id: string): Promise<boolean> {
    try {
      const platform = await this.repository.findOne({ where: { id } });
      if (!platform) throw new NotFound("Platform not found");

      await this.repository.remove(platform);
      return true;
    } catch (error) {
      if (error instanceof NotFound) throw error;
      else throw new Exception(500, error.message);
    }
  }
}