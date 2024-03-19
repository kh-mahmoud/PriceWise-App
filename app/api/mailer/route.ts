import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer"



export const POST= async(req:NextRequest)=>
{
  try {
    const {email,emailContent} = await req.json() 

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
           user: 'generea055@gmail.com',
           pass: process.env.GMAIL_ACCESS_PASSWORD
        }
      });

    const mailOptions = {
            from: '"PriceWise"',
            to: email,
            subject: emailContent.subject,
            html: emailContent.body
        };
    
     const info = transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
                return info;
            }
        });

      return NextResponse.json({message:"email was sent succefully"})


  } catch (error) {
     console.log(error)
  }
}