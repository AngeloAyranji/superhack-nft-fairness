import { Controller, Inject } from "@tsed/di";
import { Exception } from "@tsed/exceptions";
import { QueryParams } from "@tsed/platform-params";
import { Get, Returns, Tags } from "@tsed/schema";
import { ClassifierService } from "../../../services/classifier.service";

@Controller("/classifier")
@Tags("Classifier")
export class ClassifierController {
  
  @Inject(ClassifierService)
  protected service: ClassifierService;

  @Get("/score")
  @Returns(200, Number)
  public async getScore(@QueryParams("contractAddress") contractAddress: string, @QueryParams("tokenIds") tokenId: number): Promise<any> {
    try {
      return (await this.service.startClassification(contractAddress, tokenId)).toString();
    } catch (err) {
      // throw new Exception(err.status, err.message);
      console.log(err)
    }
  }
}