import nodemailer from 'nodemailer';
import { config } from 'dotenv';
config();

export class EmailService {
    private static transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    /**
     * Send an email
     */
    static async sendEmail(to: string, subject: string, html: string, attachments?: { filename: string, content: string | Buffer }[]) {
        try {
            console.log(`📧 Sending email to ${to}...`);

            const info = await this.transporter.sendMail({
                from: process.env.SMTP_FROM || '"MyCodingBuddy" <no-reply@mycodingbuddy.com>', // sender address
                to, // list of receivers
                subject, // Subject line
                html, // html body
                attachments,
            });

            console.log('✅ Email sent: %s', info.messageId);
            return true;
        } catch (error) {
            console.error('❌ Error sending email:', error);
            return false;
        }
    }
}
