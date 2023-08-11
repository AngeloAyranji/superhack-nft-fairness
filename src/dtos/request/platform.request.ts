import { Property } from "@tsed/schema";

export class PlatformRequest {
  @Property()
  name: string;

  @Property()
  contractAddress: string;

  @Property()
  fair: boolean;

  @Property()
  chainId: number;
}