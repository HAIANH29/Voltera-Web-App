package com.g_wuy.swp391.voltera.controller;

import com.g_wuy.swp391.voltera.exception.BusinessException;
import com.g_wuy.swp391.voltera.model.request.OtpRequest;
import com.g_wuy.swp391.voltera.model.request.PasswordResetRequest;
import com.g_wuy.swp391.voltera.service.OtpService;
import com.g_wuy.swp391.voltera.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/otp")
public class OtpController {
    @PostMapping("/forgot/reset")
    public ResponseEntity<?> resetPassword(@RequestBody PasswordResetRequest request) {
        userService.updatePassword(request.getEmail(), request.getNewPassword());
        return ResponseEntity.ok("Password reset successfully");
    }
    @Autowired
    private OtpService otpService;
    @Autowired
    private UserService userService;

    @PostMapping("/request")
    public ResponseEntity<String> requestOtp(@RequestParam String email) {
        otpService.generateOtp(email);
        return ResponseEntity.ok("OTP has been sent to " + email);
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyOtp(@RequestBody OtpRequest request) {
        try {
            userService.verifyRegisterOtp(request.getEmail(), request.getOtp());
            return ResponseEntity.ok("Email verified successfully");
        } catch(BusinessException e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/resend")
    public ResponseEntity<String> resendOtp(@RequestParam String email) {
        otpService.resendOtp(email);
        return ResponseEntity.ok("OTP resent to " + email);
    }


    @PostMapping("/forgot/request")
    public ResponseEntity<String> requestPasswordOtp(@RequestParam String email) {
        userService.checkEmailExists(email);
        otpService.generateOtp(email);
        return ResponseEntity.ok("OTP for password reset sent to " + email);
    }

    @PostMapping("/forgot/verify")
    public ResponseEntity<?> verifyPasswordOtp(@RequestBody PasswordResetRequest request) {
        boolean valid = otpService.verifyOtp(request.getEmail(), request.getOtp());
        if(valid) {
            userService.updatePassword(request.getEmail(), request.getNewPassword());
            return ResponseEntity.ok("Password reset successfully");
        } else {
            return ResponseEntity.badRequest().body("Invalid or expired OTP");
        }
    }
}
