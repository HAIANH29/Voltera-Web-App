package com.g_wuy.swp391.voltera.model.dto.request;

import jakarta.validation.constraints.Email;
import lombok.Data;

@Data
public class RegisterRequest {
    private String firstName;
    private String lastName;
    @Email
    private String email;
    private String password;
}
