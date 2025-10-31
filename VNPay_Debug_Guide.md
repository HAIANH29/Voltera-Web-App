## Test VNPay URL Generator

### Test Parameters:
```
vnp_Version=2.1.0
vnp_Command=pay
vnp_TmnCode=U81KACPS
vnp_Amount=100000000 (1,000,000 VND)
vnp_CurrCode=VND
vnp_TxnRef=12345678
vnp_OrderInfo=Test payment
vnp_OrderType=other
vnp_Locale=vn
vnp_ReturnUrl=http://192.168.1.13:8080/api/vnpay/return/1
vnp_IpAddr=192.168.1.13
vnp_CreateDate=20241031120000
```

### Hash Data (không encode):
```
vnp_Amount=100000000&vnp_Command=pay&vnp_CreateDate=20241031120000&vnp_CurrCode=VND&vnp_IpAddr=192.168.1.13&vnp_Locale=vn&vnp_OrderInfo=Test payment&vnp_OrderType=other&vnp_ReturnUrl=http://192.168.1.13:8080/api/vnpay/return/1&vnp_TmnCode=U81KACPS&vnp_TxnRef=12345678&vnp_Version=2.1.0
```

### Cách test:
1. Restart backend
2. Thử tạo payment
3. Kiểm tra log console backend
4. So sánh với format trên

### Nếu vẫn lỗi:
- Kiểm tra firewall có block port 8080 không
- Thử dùng ngrok để tạo public URL
- Hoặc deploy lên server có domain thật