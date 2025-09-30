package com.g_wuy.swp391.voltera.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ModerationResponse {
    private Integer postId;
    private String status;
    private String reason;
}
