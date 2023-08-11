import { Service, Inject } from "@tsed/di";
import { PlatformService } from "../app-services/platform/platform.service";
import { PlatformResponse } from "../dtos/response/platform.response";
import axios from "axios";

@Service()
export class ClassifierService {
    
    @Inject(PlatformService)
    protected platformService: PlatformService;

    public async startClassification(contractAddress: string, tokenId: number) {
        const fairPlatformsAddresses: string[] = await this.getPlatformsAddresses(true)
        const unfairPlatformsAddresses: string[] = await this.getPlatformsAddresses(false)

        const fairCount: number = await this.fairnessCount(true, fairPlatformsAddresses, tokenId)
        const unfairCount: number = await this.fairnessCount(false, unfairPlatformsAddresses, tokenId)

        return this.calculateScore(fairCount, unfairCount)
    }

    private async getPlatformsAddresses(fair: boolean = true): Promise<string[]> {
        const platforms: PlatformResponse[] = await this.platformService.getPlatforms({ where: { fair }})

        const platformsAddresses: string[] = platforms.map((platform: PlatformResponse) => platform.contractAddress)
        return platformsAddresses
    }


    private async fairnessCount(fair: boolean = true, platformAddresses: string[], tokenId: number): Promise<number> {
        const query = this.buildQuery(platformAddresses, tokenId)

        const res = await axios.post(process.env.SUBGRAPH_URL ? process.env.SUBGRAPH_URL : "", {
            query: query
        })

        console.log(res.data.data.transfers)
        
        return res.data.data.transfers.length
    }

    private buildQuery(platformAddresses: string[], tokenId: number): string {
        return `query ExampleQuery {
            transfers (where: { to_in: ${JSON.stringify(platformAddresses)}, tokenId: "${tokenId}"}) {
              to
              tokenId
            }
          }`
    }

    private calculateScore(fairCount: number, unfairCount: number): number {
        return fairCount / (fairCount + unfairCount)
    }
}