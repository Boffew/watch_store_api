// import { Module } from '@nestjs/common';

// import { ConfigModule, ConfigService } from '@nestjs/config';

// @Module({
//   imports: [
//     // Thêm SendGridModule vào module
//     SendGridModule.forRootAsync({
//       imports: [ConfigModule],
//       useFactory: async (configService: ConfigService) => ({
//         apiKey: configService.get<string>('SENDGRID_API_KEY'),
//       }),
//       inject: [ConfigService],
//     }),

//     // Thêm MailerModule vào module
//     MailerModule.forRootAsync({
//       imports: [ConfigModule],
//       useFactory: async (configService: ConfigService) => ({
//         transport: {
//           host: configService.get<string>('MAILER_HOST'),
//           port: configService.get<number>('MAILER_PORT'),
//           secure: false,
//           auth: {
//             user: configService.get<string>('MAILER_AUTH_USER'),
//             pass: configService.get<string>('MAILER_AUTH_PASS'),
//           },
//         },
//         defaults: {
//           from: `"${configService.get<string>('MAILER_FROM_NAME')}" <${configService.get<string>('MAILER_FROM_EMAIL')}>`,
//         },
//       }),
//       inject: [ConfigService],
//     }),
//   ],
// })
// export class AppModule {}