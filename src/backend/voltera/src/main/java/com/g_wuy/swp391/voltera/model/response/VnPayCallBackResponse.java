package com.g_wuy.swp391.voltera.model.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VnPayCallBackResponse {
    private String vnpTmnCode;
    private Long vnpAmount;
    private String vnpBankCode;
    private String vnpBankTranNo;
    private String vnpCardType;
    private String vnpPayDate;
    private String vnpOrderInfo;
    private String vnpTransactionNo;
    private String vnpResponseCode;
    private String vnpTransactionStatus;
    private String vnpTxnRef;
    private String vnpSecureHash;
}
