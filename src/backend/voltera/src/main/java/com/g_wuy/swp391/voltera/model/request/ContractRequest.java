package com.g_wuy.swp391.voltera.model.request;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class ContractRequest {
    private Integer postId;
    private Integer buyerId;
    private Integer sellerId;
    private String terms;
}
