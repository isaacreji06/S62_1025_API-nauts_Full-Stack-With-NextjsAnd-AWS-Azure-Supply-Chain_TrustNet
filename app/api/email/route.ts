import { NextResponse } from "next/server";
import sendGrid from "@sendgrid/mail";
sendGrid.setApiKey(process.env.SENDGRID_API_KEY!);
export async function POST(req: Request) {
    try{
        const {to,subject,message}=await req.json();
        const emailData={
            to:"isaacreji2006@gmail.com",
            from:process.env.SENDGRID_SENDER!,
            subject,
            html:message,
        }
        const response=await sendGrid.send(emailData);
        console.log("Email send",response[0].headers);
        return NextResponse.json({success:true});
    }
    catch(error){
        console.error("Email send failed:",error);
        return NextResponse.json({success:false, error: "Failed to send email",status:500});
    }
}

export const welcomeTemplate = (userName: string) => `
  <h2>Welcome to TrustNet, ${userName}!</h2>
  <p>We’re thrilled to have you onboard 🎉</p>
  <p>Start exploring your dashboard at <a href="">Kalvium Portal</a>.</p>http://localhost:3000
  <hr/>
  <small>This is an automated email. Please do not reply.</small>
`;