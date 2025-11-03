function generateVerificationOtpEmailTemplate(otpCode){
    return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width" />
  <title>Verify Your Email</title>
  <style>
    @media only screen and (max-width: 600px) {
      .container { width: 100% !important; padding: 16px !important; }
      .content { padding: 20px !important; }
      .otp { font-size: 28px !important; letter-spacing: 4px !important; }
      .button { width: 100% !important; display: block !important; }
    }
  </style>
</head>
<body style="margin:0; padding:0; background-color:#f4f6f8; font-family:'Segoe UI', Roboto, Arial, sans-serif;">

  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f4f6f8; padding:32px 0;">
    <tr>
      <td align="center">

        <table role="presentation" class="container" cellpadding="0" cellspacing="0" width="600" style="width:600px; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 6px 24px rgba(16,24,40,0.08);">
          
          <tr>
            <td style="background:linear-gradient(90deg,#4f46e5,#06b6d4); padding:22px;">
              <h1 style="margin:0; color:#ffffff; font-size:20px;">GoodLIB</h1>
            </td>
          </tr>

          <tr>
            <td class="content" style="padding:32px; color:#0f172a;">
              <h2 style="margin:0 0 10px; font-size:20px;">Your Verification Code</h2>
              <p style="margin:0 0 20px; color:#475569; line-height:1.6;">
                Use the code below to verify your email. This code is valid for <strong>15 minutes</strong>.
              </p>

              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:14px 0 22px 0;">
                <tr>
                  <td align="center">
                    <div class="otp" style="display:inline-block; padding:18px 28px; border-radius:10px; background:linear-gradient(180deg, #f8fafc, #ffffff); border:1px solid #e6eef8;">
                      <span style="font-family: 'Courier New', Courier, monospace; font-size:32px; font-weight:700; color:#0b1220; letter-spacing:6px;">
                        ${otpCode}
                      </span>
                    </div>
                  </td>
                </tr>
              </table>

              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:18px;">
                <tr>
                  <td align="center">
                    <a class="button" href="#" style="text-decoration:none; display:inline-block; padding:12px 20px; border-radius:10px; background:#0ea5a4; color:#ffffff; font-weight:600; box-shadow:0 6px 18px rgba(14,165,164,0.18);">
                      Verify Now
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0; color:#64748b; font-size:13px; line-height:1.5;">
                If the button doesn't work, copy and paste the code above. If you didn't request this, ignore this email.
              </p>

              <hr style="border:none; border-top:1px solid #eef2f7; margin:16px 0;">

              <p style="margin:0; color:#94a3b8; font-size:12px;">
                Need help? Reply to this email or visit our <a href="#" style="color:#4f46e5; text-decoration:none;">support center</a>.
              </p>
            </td>
          </tr>

          <tr>
            <td style="background:#fbfdff; padding:18px 24px; text-align:center; color:#78909c; font-size:12px;">
              <p style="margin:0;">© ${new Date().getFullYear()} GoodLIB . All rights reserved.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;
}

module.exports = generateVerificationOtpEmailTemplate;
