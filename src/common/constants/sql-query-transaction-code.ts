export const sqlTransactionalQueryData = {
  createAutoPeOrder: {
    name: 'create-auto-pe-order',
    transactionalName: 'initiate-digi-auto-pe-transaction',
    description:
      'SQL transactional query to create an AutoPe order with table entries in Transaction and Transaction Metadata Tables',
  },
  createRzPayOrder: {
    name: 'create-rz-pay-order',
    transactionalName: 'initiate-digi-rz-pay-transaction',
    description:
      'SQL transactional query to create a RzPay order with table entries in Transaction and Transaction Metadata Tables',
  },
  handleRzCallbackData: {
    name: 'handle-rz-pay-order-callback',
    transactionalName: 'handle-rz-pay-order-callback-transaction',
    description:
      'SQL transactional query to update a RzPay order with table update entries in Transaction and Transaction Metadata Tables',
  },
  createEaseBuzzOrder: {
    name: 'create-ease-buzz-order',
    transactionalName: 'initiate-digi-ease-buzz-transaction',
    description:
      'SQL transactional query to create an EaseBuzz order with table entries in Transaction and Transaction Metadata Tables',
  },
  handleEaseBuzzCallbackData: {
    name: 'handle-ease-buzz-order-callback',
    transactionalName: 'handle-ease-buzz-order-callback-transaction',
    description:
      'SQL transactional query to update an EaseBuzz order with table update entries in Transaction and Transaction Metadata Tables',
  },
  createOpenMoneyOrder: {
    name: 'create-open-money-order',
    transactionalName: 'initiate-digi-open-money-transaction',
    description:
      'SQL transactional query to create an OpenMoney order with table entries in Transaction and Transaction Metadata Tables',
  },
  manageWalletFunds: {
    name: 'manage-wallet-funds',
    transactionalName: 'manage-wallet-funds-transaction',
    description:
      'SQL transactional query to manage wallet funds. The Entries will be created in wallet-ledger and wallet table will be updated.',
  },
  initiateOmPayOrder: {
    name: 'initiate-om-pay-order',
    transactionalName: 'initiate-om-pay-transaction',
    description:
      'SQL transactional query to create a OM Pay order with table entries in Transaction and Transaction Metadata Tables and also update the wallet and new entry in wallet ledger table.',
  },
  initiateDgPayoutOrder: {
    name: 'initiate-dg-payout-order',
    transactionalName: 'initiate-dg-payout-transaction',
    description:
      'SQL transactional query to create a DG Payout order with table entries in Transaction and Transaction Metadata Tables and also update the wallet and new entry in wallet ledger table.',
  },
  initiateBxPayoutOrder: {
    name: 'initiate-bx-payout-order',
    transactionalName: 'initiate-bx-payout-transaction',
    description:
      'SQL transactional query to create a BX Payout order with table entries in Transaction and Transaction Metadata Tables and also update the wallet and new entry in wallet ledger table.',
  },
  initiateDgIpBbpsBillPayment: {
    name: 'initiate-dg-ip-bbps-bill-payment',
    transactionalName: 'initiate-dg-ip-bbps-bill-payment-transaction',
    description:
      'SQL transactional query to create a DG IP BBPS Bill Payment order with table entries in Transaction and Transaction Metadata Tables and also update the wallet and new entry in wallet ledger table.',
  },
  handleBxPayoutCallbackData: {
    name: 'handle-bx-payout-order-callback',
    transactionalName: 'handle-bx-payout-order-callback-transaction',
    description:
      'SQL transactional query to update a BX Payout order with table update entries in Transaction and Transaction Metadata Tables',
  },
  validateBxBankBeneficiary: {
    name: 'validate-bx-bank-beneficiary',
    transactionalName: 'validate-bx-bank-beneficiary-transaction',
    description:
      'SQL transactional query to manage bank beneficiary validation. The Entries will be created in transaction and transaction_metadata table and existing entry of bank beneficiary will be updated.',
  },
  bulkUpdateTransactions: {
    name: 'bulk-update-transactions',
    transactionalName: 'bulk-update-transactions-transaction',
    description:
      'SQL transactional query to bulk update transactions. It Will check all the top_up category transaction with DG Status check api and then update the status accordingly. The table update will be done in transaction and transaction_metadata table.',
  },
  initiateKpIpBbpsBillPayment: {
    name: 'initiate-kp-ip-bbps-bill-payment',
    transactionalName: 'initiate-kp-ip-bbps-bill-payment-transaction',
    description:
      'SQL transactional query to create a KliqPay InstantPay BBPS Bill Payment order with table entries in Transaction and Transaction Metadata Tables and also update the wallet and new entry in wallet ledger table.',
  },
};
