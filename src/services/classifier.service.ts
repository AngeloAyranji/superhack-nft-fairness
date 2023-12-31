import { Service, Inject } from "@tsed/di";
import { PlatformService } from "../app-services/platform/platform.service";
import { PlatformResponse } from "../dtos/response/platform.response";
import axios from "axios";

// Service that handles the communication with the subgraph AND calculates the score
@Service()
export class ClassifierService {
    
    // Injecting the Platform service
    @Inject(PlatformService)
    protected platformService: PlatformService;

    // Function that fetches all the transactions and calculate the score based on a tokenId and contract address
    public async startClassification(contractAddress: string, tokenId: number): Promise<any> {
        const fairPlatformsAddresses: string[] = await this.getPlatformsAddresses(true)
        const unfairPlatformsAddresses: string[] = await this.getPlatformsAddresses(false)
        
        const fairTransactions: any[] = await this.fetchTransactions(fairPlatformsAddresses, tokenId, false)
        const unfairTransactions: any[] = await this.fetchTransactions(unfairPlatformsAddresses, tokenId, false)
        const unknowTransactions: any[] = await this.fetchTransactions([...unfairPlatformsAddresses, ...fairPlatformsAddresses], tokenId, true)
        console.log(fairTransactions.length, unfairTransactions.length)
        const score = fairTransactions.length === 0 && unfairTransactions.length === 0 ? 0 : this.calculateScore(fairTransactions.length, unfairTransactions.length)

        return {
            score,
            fairTransactions,
            unfairTransactions,
            unknowTransactions
        }
    }

    // Function that fetches the paltforms from the database filtered by fairness
    private async getPlatformsAddresses(fair: boolean = true): Promise<string[]> {
        const platforms: PlatformResponse[] = await this.platformService.getPlatforms({ where: { fair }})

        const platformsAddresses: string[] = platforms.map((platform: PlatformResponse) => platform.contractAddress)
        return platformsAddresses
    }

    // Function that fetches the transactions from the subgraph (unknow variable is true when we need to fetch transfers where fairness is unknown)
    private async fetchTransactions(platformAddresses: string[], tokenId: number, unknown: boolean = false): Promise<any[]> {
        const query = this.buildQuery(platformAddresses, tokenId, unknown)

        const res = await axios.post(process.env.SUBGRAPH_URL || "", {
            query: query
        })
        
        console.log(res.data.data.transfers)
        
        return res.data.data.transfers
    }

    // Function that builds the query sent to the graphql subgraph
    private buildQuery(platformAddresses: string[], tokenId: number, unknown: boolean): string {
        return `query ExampleQuery {
            transfers (where: { interacted_with_${unknown === false ? "in" : "not_in"}: ${JSON.stringify(platformAddresses)}, tokenId: "${tokenId}"}) {
              interacted_with
              tokenId
              blockTimestamp
            }
          }`
    }

    // Functio that calculates the score
    private calculateScore(fairCount: number, unfairCount: number): number {
        return fairCount / (fairCount + unfairCount)
    }
}