package com.g_wuy.swp391.voltera.model.request;

import lombok.Data;

@Data
public class RefundRequest {
    private String orderId;       // vnp_TxnRef
    private String transDate;     // vnp_TransactionDate (yyyyMMddHHmmss)
    private String tranType;      // 02: Hoàn toàn, 03: Một phần
    private Long amount;          // số tiền hoàn (VNĐ)
    private String user;          // người thực hiện hoàn
}