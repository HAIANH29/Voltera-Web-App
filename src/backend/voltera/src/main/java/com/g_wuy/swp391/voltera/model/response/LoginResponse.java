package com.g_wuy.swp391.voltera.model.response;

import lombok.Data;

@Data
public class LoginResponse {
    private Integer userId;
    private String token;
    private String role;

}
