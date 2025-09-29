package com.g_wuy.swp391.voltera.model.dto.response;

import lombok.Data;

@Data
public class LoginResponse {
    private String token;
    private String username;
    private String role;
}
