const verifyOtpTemplate = ({ name, otp }) => {
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
          Hello, ${name}!
        </h2>
        
        <p style="
          font-size: 16px; 
          text-align: center; 
          margin-bottom: 20px;">
          Thank you for using <strong>Quicko</strong>. Use the OTP below to verify your account. 
          This OTP is valid for the next 15 minutes.
        </p>
        
        <div style="
          text-align: center; 
          margin: 20px auto;">
          <div style="
            font-size: 24px; 
            font-weight: bold; 
            color: #28A745; 
            border: 1px dashed #28A745; 
            padding: 10px 20px; 
            display: inline-block;">
            ${otp}
          </div>
        </div>
        
        <p style="
          font-size: 14px; 
          color: #666; 
          margin-top: 20px; 
          text-align: center;">
          If you did not request this OTP, please ignore this email.
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
  
  export default verifyOtpTemplate;
  