// Payment utilities
export const navigateToPayment = (navigate, { postId, amount, contractId, orderInfo }) => {
  const params = new URLSearchParams();
  
  if (postId) params.append('postId', postId);
  if (amount) params.append('amount', amount);
  if (contractId) params.append('contractId', contractId);
  if (orderInfo) params.append('orderInfo', orderInfo);
  
  navigate(`/payment?${params.toString()}`);
};

export const formatVNDCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

export const getVNPayErrorMessage = (code) => {
  const errorMessages = {
    "07": "Transaction is being processed. Please wait.",
    "09": "Your card/account is not registered for Internet Banking service.",
    "10": "Card/account authentication failed 3 times.",
    "11": "Transaction timeout. Please try again.",
    "12": "Card/account is locked.",
    "13": "Invalid OTP.",
    "24": "User cancelled the transaction.",
    "51": "Insufficient account balance.",
    "65": "Account has exceeded daily transaction limit.",
    "75": "Payment bank is under maintenance.",
    "79": "Transaction amount exceeds limit for the transaction.",
    "99": "Unknown error. Please try again."
  };
  
  return errorMessages[code] || `Transaction failed with code: ${code}`;
};