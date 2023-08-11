import { registerProvider } from "@tsed/di";
import { PostgresDataSource } from "../datasources/PostgresDatasource";
import { Platform } from "../models/platforms";

export const PlatformRepository = PostgresDataSource.getRepository(Platform);

export const PLATFORM_REPOSITORY = Symbol.for("PlatformRepository");
export type PLATFORM_REPOSITORY = typeof PlatformRepository;

registerProvider({
  provide: PLATFORM_REPOSITORY,
  useValue: PlatformRepository,
});