package com.g_wuy.swp391.voltera.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Random;
import java.util.concurrent.TimeUnit;

@Service
public class OtpService {
    @Autowired
    private RedisTemplate<String, String> redisTemplate;


    public String generateOtp(String email) {
        String otp = String.valueOf(new Random().nextInt(899999) + 100000); // OTP 6 số
        String key = "OTP:" + email;

        redisTemplate.opsForValue().set(key, otp, 5, TimeUnit.MINUTES);


        System.out.println("OTP for " + email + " is: " + otp);

        return otp;
    }


    public boolean verifyOtp(String email, String otp) {
        String key = "OTP:" + email;
        String value = redisTemplate.opsForValue().get(key);

        if (value != null && value.equals(otp)) {
            redisTemplate.delete(key); // Xóa sau khi dùng
            return true;
        }
        return false;
    }
    public void resendOtp(String email) {
        String newOtp = generateOtp(email);
        System.out.println("Resent OTP for " + email + ": " + newOtp);
    }
}
