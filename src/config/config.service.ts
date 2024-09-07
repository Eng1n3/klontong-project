import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { EnvConfig } from './interfaces';

@Injectable()
export class ConfigService {
  private readonly envConfig: EnvConfig;

  constructor() {
    const env: string | undefined = process.env.NODE_ENV;
    const filename: string = env ? `.${env}.env` : '.env';
    const pathEnv = path.join(process.cwd(), filename);
    this.envConfig = dotenv.parse(fs.readFileSync(pathEnv));
    type NodeEnvironment = 'development' | 'staging' | 'production' | 'rc';
    this.envConfig.NODE_ENV =
      (process.env.NODE_ENV as NodeEnvironment) ?? 'development';
  }

  get<T>(key: string): T {
    return this.envConfig[key] as T;
  }
}
