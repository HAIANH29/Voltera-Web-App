package com.g_wuy.swp391.voltera.service;

import com.g_wuy.swp391.voltera.entity.Contract;
import com.g_wuy.swp391.voltera.entity.Fee;
import com.g_wuy.swp391.voltera.entity.User;
import com.g_wuy.swp391.voltera.repository.FeeRepository;
import com.g_wuy.swp391.voltera.repository.UserRepository;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class EmailService {
    @Autowired
    private  JavaMailSender mailSender;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FeeRepository feeRepository;


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
    public void sendContractEmailWithAttachment(Contract contract, MultipartFile file) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(new String[]{
                    contract.getBuyerid().getEmail(),
                    contract.getSellerid().getEmail()
            });
            helper.setSubject("Contract Signed - #" + contract.getId());
            helper.setText("""
                Dear users,

                Your contract has been signed by both parties.
                Please find the attached PDF copy for your reference.

                Best regards,
                Voltera Team
            """);

            helper.addAttachment("Contract_" + contract.getId() + ".pdf",
                    new ByteArrayResource(file.getBytes()));

            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Failed to send contract email", e);
        }
    }

    public void sendEmailFee(String email, Integer postId) {
        SimpleMailMessage message = new SimpleMailMessage();
        User user = userRepository.findUserByUsername(email);

        message.setTo(email);
        message.setSubject("Notification of Post Fee Payment");
        message.setText("Dear " + user.getFullname() + ",\n\n"
                + "Your post has been created successfully, but it's not yet visible because the posting fee has not been paid.\n"
                + "Please complete the payment to activate your post.\n\n"
                + "You can pay here:\n"
                + "🔗 http://localhost:8080/api/fee/create-payment/" + postId + "\n\n"
                + "Thank you for using Voltera!\n\n"
                + "Best regards,\n"
                + "Voltera Support Team");
        message.setFrom("voltera.global@gmail.com");
        System.out.println("đã gửi email đến: " + email);
        mailSender.send(message);
    }

    public void sendEmailRenewalFee(String email, Integer feeId) {
        SimpleMailMessage message = new SimpleMailMessage();

        // Lấy thông tin user và fee
        User user = userRepository.findUserByUsername(email);
        Fee fee = feeRepository.findById(feeId)
                .orElseThrow(() -> new RuntimeException("Fee not found"));

        // Thiết lập nội dung email
        message.setTo(email);
        message.setSubject("Notice of Post Renewal Fee");

        String content = String.format(
                "Dear %s,\n\n" +
                        "Your post’s listing fee is about to expire.\n" +
                        "Please renew your payment before %s to keep your post active on our platform.\n\n" +
                        "You can quickly renew at:\n" +
                        "http://localhost:8080/api/fee/renewal-payment/%d\n\n" +
                        "If you have already made the payment, please disregard this message.\n\n" +
                        "Thank you for continuing to use our service!\n\n" +
                        "Best regards,\n" +
                        "Customer Support Team\n" +
                        "Voltera",
                user.getFullname(),
                fee.getExpiredAt() != null ? fee.getExpiredAt().toString() : "[expiration date]",
                fee.getPost().getId()
        );

        message.setText(content);
        message.setFrom("voltera.global@gmail.com");

        // Gửi email
        System.out.println("đã gửi mail đến " + email);
        mailSender.send(message);
    }
}
