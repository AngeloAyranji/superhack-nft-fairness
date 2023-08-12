import { Property } from "@tsed/schema";
import { Platform } from "../../models/platforms";

// Data strucute that represent the response from the platform table
export class PlatformResponse implements Platform {
  @Property()
  id: string;

  @Property()
  name!: string;

  @Property()
  contractAddress!: string;

  @Property()
  fair!: boolean;

  @Property()
  chainId!: number;
}