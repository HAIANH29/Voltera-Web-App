package com.g_wuy.swp391.voltera.model.request;

import jakarta.validation.constraints.Email;
import lombok.Data;

@Data
public class RegisterRequest {
    @Email
    private String email;
    private String password;
}
