export const PAYMENT_CONFIG = {
  // ─── UPI ───────────────────────────────────────────────────────────────────
  upi: {
    id: "8015929891@cnrb", // Canara Bank VPA
    name: "SRIBALAJI AQUA WATER",
    hint: "Works with GPay, PhonePe, Paytm, BHIM & all UPI apps",
    qrImagePath: "/images/bank-qr.jpeg",
  },

  // ─── Bank Transfer ─────────────────────────────────────────────────────────
  bank: {
    bankName: "Canara Bank",
    accountHolder: "SRIBALAJI AQUA WATER",
    accountNumber: "64943070000322",
    ifscCode: "CNRB0016494",
    accountType: "Current",
    mobileLinked: "+91 80159 29891",
  },

  // ─── Cash ──────────────────────────────────────────────────────────────────
  cash: {
    hint: "Collect cash and mark the payment after receiving",
  },

  // ─── Credit ────────────────────────────────────────────────────────────────
  credit: {
    defaultDueDays: 30,
    hint: "Amount will be added to customer outstanding balance",
  },
} as const;

// ─── Convenience helpers ──────────────────────────────────────────────────────

/** Returns a UPI deep-link URL that opens any UPI app directly */
export const getUpiPaymentUrl = (amount: number, note?: string) =>
  `upi://pay?pa=${PAYMENT_CONFIG.upi.id}&pn=${encodeURIComponent(
    PAYMENT_CONFIG.upi.name
  )}&am=${amount}&cu=INR${note ? `&tn=${encodeURIComponent(note)}` : ""}`;

/** Masked account number for display: ****0322 */
export const getMaskedAccount = () =>
  `****${PAYMENT_CONFIG.bank.accountNumber.slice(-4)}`;
