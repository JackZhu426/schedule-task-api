import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { PrismaClientExceptionFilter } from "./prisma-client-exception/prisma-client-exception.filter";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new PrismaClientExceptionFilter());
  const config = new DocumentBuilder()
    .setTitle("Schedule Task API")
    .setDescription("Schedule Task CRUD API")
    .setVersion("1.0")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  await app.listen(3000);
}

bootstrap();
