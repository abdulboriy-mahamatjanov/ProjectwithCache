import { BadRequestException, Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS,
      },
    });
  }

  async sendMail(to: string, subject: string, message: string) {
    try {
      const data = await this.transporter.sendMail({
        from: process.env.NODEMAILER_USER,
        to,
        subject,
        html: message,
      });

      return { data };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
