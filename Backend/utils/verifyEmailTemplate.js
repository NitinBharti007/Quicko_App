const verifyEmailTemplate = ({ name, url }) => {
  return `
    <div style="
      font-family: Arial, sans-serif; 
      line-height: 1.6; 
      color: #333; 
      padding: 20px; 
      border: 1px solid #ddd; 
      border-radius: 10px; 
      background-color: #f9f9f9; 
      max-width: 600px; 
      margin: auto;">
      
      <h2 style="
        color: #444; 
        text-align: center; 
        font-size: 20px; 
        margin-bottom: 20px;">
        Welcome to Quicko, ${name}!
      </h2>
      
      <p style="
        font-size: 16px; 
        text-align: center; 
        margin-bottom: 20px;">
        Thank you for registering with <strong>Quicko</strong>. To complete your registration, please verify your email address by clicking the button below.
      </p>
      
      <div style="text-align: center; margin-top: 20px;">
        <a href="${url}" 
           style="
             display: inline-block;
             background-color: #28A745;
             color: white;
             text-decoration: none;
             padding: 12px 20px;
             border-radius: 5px;
             font-size: 16px;
             font-weight: bold;
             border: 1px solid #28A745;">
          Verify Email
        </a>
      </div>
      
      <p style="
        font-size: 14px; 
        color: #666; 
        margin-top: 20px; 
        text-align: center;">
        If you did not create an account with Quicko, please ignore this email.
      </p>
      
      <footer style="
        font-size: 12px; 
        color: #aaa; 
        margin-top: 30px; 
        text-align: center;">
        &copy; ${new Date().getFullYear()} Quicko. All rights reserved. Visit us at 
        <a href="https://quicko.vercel.app" style="color: #007BFF; text-decoration: none;">quicko.vercel.app</a>.
      </footer>
    </div>
  `;
};

export default verifyEmailTemplate;
