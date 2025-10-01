package com.g_wuy.swp391.voltera.model.request;

import com.g_wuy.swp391.voltera.entity.Account.AccountStatus;
import com.g_wuy.swp391.voltera.entity.Post.PostStatus;

import lombok.Data;

@Data
public class ModerationRequest {
    private Integer postId;
    private PostStatus status;
    private String reason;

}
