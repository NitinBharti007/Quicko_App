const verifyEmailTemplate = ({ name, url }) => {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; padding: 20px;">
      <p style="font-size: 16px;">Dear ${name},</p>
      <p style="font-size: 16px;">Thank you for registering with Quicko.</p>
      <a href="${url}" 
         style="
           display: inline-block;
           background-color: #28A745;
           color: white;
           text-decoration: none;
           padding: 12px 20px;
           margin-top: 10px;
           border-radius: 5px;
           font-size: 16px;
           font-weight: bold;
           text-align: center;
         ">
        Verify Email
      </a>
    </div>
  `;
};

export default verifyEmailTemplate;
