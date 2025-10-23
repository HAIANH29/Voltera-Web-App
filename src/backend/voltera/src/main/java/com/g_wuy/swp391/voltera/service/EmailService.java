package com.g_wuy.swp391.voltera.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    @Autowired
    private  JavaMailSender mailSender;


    public void sendOtpEmail(String to, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Your OTP Code");
        message.setText(
                "Dear user,\n\n" +
                        "Your OTP code is: " + otp + "\n" +
                        "It is valid for 5 minutes.\n\n" +
                        "If you did not request this code, please ignore this email.\n\n" +
                        "Best regards,\n" +
                        "Your Company"
        );
        message.setFrom("voltera.global@gmail.com");
        mailSender.send(message);
        System.out.println("Sent OTP to " + to + ": " + otp);
    }
}
