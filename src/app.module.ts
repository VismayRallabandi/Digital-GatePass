import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RedisCacheModule } from './database/redis/redis-cache.module';
import { MongoModule } from './database/mongo/mongo.module';
import { DatabaseModule } from './database/postgres/postgres.module';
import { RequestMiddleware } from './common/middlewares/logger/request-logger.middleware';
import { ApplicationModule } from './modules/application/application.module';
import { KafkaModule } from './providers/infra/kafka/kafka.module';
import { EventConsumerModule } from './events/consumers/consumer.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      envFilePath: getEnvFilePath(),
    }),
    MongoModule,
    RedisCacheModule,
    DatabaseModule,
    ApplicationModule,
    EventConsumerModule,
  ],
  controllers: [],
  providers: [
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}

function getEnvFilePath() {
  return process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
}
