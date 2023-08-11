import { Property } from "@tsed/schema";
import { Platform } from "../../models/platforms";

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