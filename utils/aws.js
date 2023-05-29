import aws from "aws-sdk";

aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const ses = new aws.SES({ apiVersion: "2010-12-01", region: "ap-south-1" });
export const createEmailTemplate = async () => {
  try {
    const params = {
      Template: {
        TemplateName: 'sample-template',
        SubjectPart: 'Welcome to my website',
        HtmlPart: '<h1>Hello %NAME%!</h1><p>Welcome to my website.</p>',
        TextPart: 'Hello %NAME%! Welcome to my website.'
      }
    };

    const response = await ses.createTemplate(params).promise();
    console.log('Email template created:', response);
  } catch (error) {
    console.error('Error creating email template:', error);
  }
};


export const sendOTPMail = async (email, otp) => {
  try {
    const params = {
      Destination: {
        ToAddresses: [email] // Replace with the recipient email address
      },
      Message: {
        Body: {
          Text: {
            Data: `Hello, this is your otp: ${otp}` // Replace with the email body
          }
        },
        Subject: {
          Data: 'Test Email' // Replace with the email subject
        }
      },
      Source: 'ravi20930@gmail.com' // Replace with the sender email address
    };
    const response = await ses.sendEmail(params).promise();
    console.log('Email sent successfully:', response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

