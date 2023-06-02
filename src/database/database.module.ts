import { Global, Module } from '@nestjs/common';
import { Pool, createPool } from 'mysql2/promise';


@Global()
@Module({})
export class DatabaseModule {
  static forRoot(): any {
    return {
      module: DatabaseModule,
      providers: [
        {
          provide: 'DATABASE_CONNECTION',
          useFactory: async (): Promise<Pool> => {
            return createPool({
              host: 'localhost',
              user: 'boffew',
              password: 'admin',
              database: 'boffew',
              connectionLimit: 10,
            });
          },
        },
      ],
      exports: ['DATABASE_CONNECTION'],
    };
  }
}
