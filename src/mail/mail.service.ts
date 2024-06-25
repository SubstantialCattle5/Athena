import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendUsersOtp(email: string, otp: number) {
    const htmlContent = `
      <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
      <html dir="ltr" lang="en">
      <head>
        <meta content="width=device-width" name="viewport"/>
        <link rel="preload" as="image" href="https://cdn.hashnode.com/res/hashnode/image/upload/v1718688851795/3XEMwsI-a.jpeg?auto=format"/>
        <meta content="text/html; charset=UTF-8" http-equiv="Content-Type"/>
        <meta content="IE=edge" http-equiv="X-UA-Compatible"/>
        <meta name="x-apple-disable-message-reformatting"/>
        <meta content="telephone=no,address=no,email=no,date=no,url=no" name="format-detection"/>
        <meta content="light" name="color-scheme"/>
        <meta content="light" name="supported-color-schemes"/>
        <style>     
          @font-face {       
            font-family: 'Inter';       
            font-style: normal;       
            font-weight: 400;       
            mso-font-alt: 'sans-serif';       
            src: url(https://rsms.me/inter/font-files/Inter-Regular.woff2?v=3.19) format('woff2');     
          }      
          * {       
            font-family: 'Inter', sans-serif;     
          }
          body {
            background-color: #FDFDFD;
            color: #73504B;
          }
          .header {
            background-color: #F3BE33;
            color: #73504B;
            padding: 1rem;
            text-align: center;
            border-radius: 15px 15px 0 0;
          }
          .content {
            padding: 1rem;
            border-radius: 0 0 15px 15px;
            background-color: #FDFDFD;
            border: 2px solid #F3BE33;
          }
          .button {
            background-color: #EB781A;
            color: #FDFDFD;
            padding: 12px 34px;
            text-decoration: none;
            font-size: 14px;
            font-weight: 500;
            border-radius: 9999px;
            display: inline-block;
            margin: 1rem 0;
          }
          .footer {
            text-align: center;
            margin-top: 1rem;
          }
        </style>
      </head>
      <body>
        <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="max-width:600px;min-width:300px;width:100%;margin-left:auto;margin-right:auto;">
          <tbody>
            <tr style="width:100%">
              <td>
                <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation">
                  <tbody style="width:100%">
                    <tr style="width:100%">
                      <td class="header">
                        <h2>Hi there!</h2>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div class="content">
                  <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="margin-bottom:1rem;">
                    <tbody>
                      <tr style="width:100%">
                        <td style="text-align:center;">
                          <img title="Logo" alt="Logo" src="https://cdn.hashnode.com/res/hashnode/image/upload/v1718688851795/3XEMwsI-a.jpeg?auto=format" style="display:block;outline:none;border:none;text-decoration:none;width:100px;height:100px;margin-bottom:10px;border-radius:50%;"/>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <p>Your OTP is: <strong>${otp}</strong></p>
                  <p>Keep it safe.</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
      </html>
    `;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Your OTP for GooglexYug',
      html: htmlContent, 
    });
  }
}
