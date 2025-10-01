package com.g_wuy.swp391.voltera.model.response;

import com.g_wuy.swp391.voltera.entity.Post.PostStatus;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ModerationResponse {
    private Integer postId;
    private PostStatus status;
    private String reason;
}