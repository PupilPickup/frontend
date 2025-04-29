import { Resend } from 'resend';

const apiKey = process.env.RESEND_API_KEY || "abc";

export function forgotPasswordEmail(email: string, subject: string, body: string){
    const resend = new Resend(apiKey);
    resend.emails.send({
        from: 'no-reply@weshare.dev',
        to: email,
        subject: subject,
        html: body
    });
}
