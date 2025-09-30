package com.g_wuy.swp391.voltera.model.request;

import jakarta.validation.constraints.Email;

public class RegisterRequest {
    private String firstName;
    private String lastName;
    @Email
    private String email;
    private String password;
}
