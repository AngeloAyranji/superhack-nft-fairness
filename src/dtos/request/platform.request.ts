import { Property } from "@tsed/schema";

// Data strucute that represent the request from the platform table
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