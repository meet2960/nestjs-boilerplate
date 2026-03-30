export const digiSevaServiceCodes = {
  digiSevaRazorPay: {
    code: 'DIGI_RZ_PAY',
    serviceType: 'pg',
    title: 'Digi Seva Razor Pay',
    description: 'Payment service for Digi Seva using Razor Pay',
  },
  digiSevaEaseBuzz: {
    code: 'DIGI_EZ_PAY',
    serviceType: 'pg',
    title: 'Digi Seva Ease Buzz',
    description: 'Payment service for Digi Seva using Ease Buzz',
  },
  digiSevaAutoPe: {
    code: 'DIGI_AP_PAY',
    serviceType: 'pg',
    title: 'Digiseva AutoPe',
    description: 'Digi Seva Auto Pe PG',
  },
  digiSevaWorldline: {
    code: 'DIGI_WL_PAY',
    serviceType: 'pg',
    title: 'Digiseva Worldline',
    description: 'Digi Seva Worldline PG',
  },
  digiSevaCashfree: {
    code: 'DIGI_CF_PAY',
    serviceType: 'pg',
    title: 'Digiseva Cashfree',
    description: 'Digi Seva Cashfree PG',
  },
  digiSevaBankPayout: {
    code: 'DIGI_PAYOUT',
    serviceType: 'pg',
    title: 'Digiseva Payout',
    description: 'Digi Seva Payout Service',
  },
  digiInstantPayBbps: {
    code: 'DIGI_INS_PAY_BBPS',
    serviceType: 'bbps',
    title: 'Digiseva Instant Pay BBPS',
    description: 'Digi Seva Instant Pay BBPS for Bill Payments',
  },
  digiSevaEasebuzzThree: {
    code: 'DIGI_EZ_PAY_THREE',
    serviceType: 'pg',
    title: 'Digiseva Easebuzz Three',
    description: 'Digi Seva Easebuzz Three PG',
  },
  digiSevaEasebuzzEdu: {
    code: 'DIGI_EZ_PAY_EDU',
    serviceType: 'pg',
    title: 'Digiseva Easebuzz Edu',
    description: 'Digi Seva Easebuzz Edu PG',
  },
} as const;

export const branchXServiceCodes = {
  bxBankPayout: {
    code: 'BX_BANK_PAYOUT',
    serviceType: 'payout',
    title: 'BX Bank Payout',
    description: 'Branch-X Payout Service',
  },
  bxBankVerification: {
    code: 'BX_BANK_VERIFICATION',
    serviceType: 'payout',
    title: 'BX Bank Bank Verification',
    description: 'Branch-X Bank Verification Service',
  },
} as const;

export const kpInstantPayServiceCodes = {
  instantPayBbps: {
    code: 'INS_PAY_BBPS',
    serviceType: 'bbps',
    title: 'Instant Pay BBPS',
    description: 'Instant Pay BBPS Service',
  },
  instantPayBalance: {
    code: 'INS_PAY_BALANCE',
    serviceType: 'other',
    title: 'Instant Pay Balance Check',
    description: 'Instant Pay Service for Balance Check',
  },
  instantPayMerchantOnboarding: {
    code: 'INS_PAY_MERCHANT_ONBOARDING',
    serviceType: 'other',
    title: 'Instant Pay Merchant On-Boarding',
    description: 'Instant Pay Merchant On-Boarding Service',
  },
  instantPayTransactionStatus: {
    code: 'INS_PAY_TRANSACTION_STATUS',
    serviceType: 'other',
    title: 'Instant Pay Transaction Status',
    description: 'Instant Pay Transaction Status Service',
  },
} as const;

export const servicesCodeConstants = {
  ...digiSevaServiceCodes,
  ...branchXServiceCodes,
  ...kpInstantPayServiceCodes,
} as const;
