import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './config/envs';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const logger = new Logger('Main');
  
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      // Objeto de configuración del microservicio
      transport: Transport.NATS,
      options: {
        servers: envs.natsServers,
      }
    }
  );

  // Configuración global de pipes
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  })
  );

  await app.listen();
  logger.log(`Products Microservice running on port ${envs.port}`);
}
bootstrap();
