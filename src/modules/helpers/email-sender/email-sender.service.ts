// TODO: This file is under development, the code is commented for now, will be uncommented once the development is done.
// import { Injectable } from '@nestjs/common';
// import Handlebars from 'handlebars';
// import moment from 'moment-timezone';
// import nodemailer from 'nodemailer';
// import type SMTPTransport from 'nodemailer/lib/smtp-transport';
// import { Resend } from 'resend';
// import { ApiConfigService } from '@/shared/services/api-config.service';
// import {
//   emailTemplatePath,
//   readFileAsString,
// } from './static/email-sender-utils';
// @Injectable()
// export class EmailSenderService {
//   private readonly nodeMailerConfig: nodemailer.Transporter<
//     SMTPTransport.SentMessageInfo,
//     SMTPTransport.Options
//   >;
//   private readonly resendClient: Resend;
//   constructor(private readonly configService: ApiConfigService) {
//     this.nodeMailerConfig = nodemailer.createTransport({
//       service: 'gmail',
//       host: process.env.MAILER_HOST,
//       //   port: process.env.MAILER_PORT!,
//       auth: {
//         user: process.env.MAILER_USER,
//         pass: process.env.MAILER_PASS,
//       },
//     });
//     this.resendClient = new Resend(this.configService.resendConfig.apiKey);
//   }
//   private async convertToHtml(templateString: string, templateData: any) {
//     try {
//       const template = Handlebars.compile(templateString); // Compile the main template
//       const dataToSend = template(templateData); // Render the template with the provided data
//       return dataToSend;
//     } catch (error) {
//       console.log('Error in convertToHtml:', error);
//       return null;
//     }
//   }
//   private async sendMailFromResend(
//     convertedHtml: string,
//     toMail: string,
//     subject: string,
//   ) {
//     const response = await this.resendClient.emails.send({
//       from: 'NestJs Mail <onboarding@resend.dev>',
//       to: [toMail],
//       subject: subject,
//       html: convertedHtml,
//     });
//     return response;
//   }
//   async sendMailFromNodeMailer(toMail: string, subject: string, body: string) {
//     const response = await this.nodeMailerConfig.sendMail({
//       from: process.env.MAILER_EMAIL_ID,
//       to: toMail,
//       subject: subject,
//       text: 'This is a Test Mail from NodeJs',
//       html: body,
//     });
//     return response;
//   }
//   // * All Email Sending Templates Below
//   async sendWelcomeMail(
//     data: {
//       email: string;
//       password: string;
//       fullName: string;
//     },
//     config: {
//       toMail: string;
//       subject: string;
//     },
//   ) {
//     const fileContent = await readFileAsString(emailTemplatePath.welcomeUser);
//     const templateData = {
//       current_date: moment().format('D MMM, YYYY'),
//       full_name: data.fullName,
//       user_email: data.email,
//       encrypted_password: data.password,
//       base_url: `${process.env.APP_URL}/login`,
//     };
//     const convertedHtml = await this.convertToHtml(fileContent, templateData);
//     if (!convertedHtml) throw new Error('Error to get email Template');
//     const response = await this.sendMailFromResend(
//       convertedHtml,
//       config.toMail,
//       config.subject,
//     );
//     return response;
//   }
// }
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailSenderService {}
