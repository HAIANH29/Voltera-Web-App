package com.g_wuy.swp391.voltera.model.response;

import java.time.Instant;

public class ApproveResponse {
    private Integer accountId;      // ID của account được approve
    private String username;        // Username của account
    private String status;          // Trạng thái hiện tại, ví dụ: "approved"
    private Instant approvedAt;     // Thời gian approve
    private Integer userId;         // ID của User profile liên kết (nếu có)
    private String fullname;
}
