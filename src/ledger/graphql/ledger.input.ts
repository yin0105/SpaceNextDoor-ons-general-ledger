import {
  Field,
  Float,
  InputType,
  Int,
  registerEnumType,
} from '@nestjs/graphql';

export enum AccountType {
  RENT = 'Rent',
  SECURITY_DEPOSITS = 'Security Deposits',
  PREPAID_INSURANCE_LIABILITIES = 'Prepaid Insurance Liabilities',
  LATE_FEES = 'Late Fees',
  ADMIN_FEES = 'Admin Fees',
  ADMINISTRATIVE_FEES = 'Administrative Fees',
  RENTAL_INCOME = 'Rental Income',
  INSURANCE_INCOME = 'Insurance Income',
  INSURANCE = 'Insurance',
  FEES = 'Fees',
  MERCHANDISE = 'Merchandise',
}

export enum TransactionType {
  PAYMENT_RENT,
  PAYMENT_DEPOSIT,
  PAYMENT_INSURANCE,
  PAYMENT_ADMIN_FEE,
  DEPOSIT_REFUND,
  INSURANCE_REFUND,
  RENT_REFUND,
  ADMIN_FEE_REFUND,
  RENT_INVOICING,
  INSURANCE_INVOICING,
  ADMIN_FEE_INVOICING,
  MERCHANDISE_INVOICING,
  MERCHANDISE_PAYMENT,
}

export enum CustomerType {
  GUEST = 'GUEST',
  CUSTOMER = 'CUSTOMER',
}

registerEnumType(AccountType, {
  name: 'AccountType',
});

registerEnumType(TransactionType, {
  name: 'TransactionType',
});

registerEnumType(CustomerType, {
  name: 'CustomerType',
});

@InputType()
export class Metadata {
  @Field((type) => Int, { nullable: false })
  company_id: number;

  @Field((type) => Int, { nullable: true })
  customer_id: number;

  @Field(() => CustomerType, { nullable: false })
  customer_type: CustomerType = CustomerType.CUSTOMER;

  @Field((type) => Int, { nullable: true })
  invoice_id: number;

  @Field((type) => Int, { nullable: false })
  building_id: number;

  @Field((type) => Int, { nullable: true })
  unit_type_id: number;

  @Field((type) => Int, { nullable: true })
  unit_id: number;

  @Field((type) => Int, { nullable: true })
  merchandise_receipt_id: number;
}

@InputType()
export class AccountCodes {
  @Field((type) => String, { nullable: false })
  code: string;

  @Field((type) => AccountType, { nullable: false })
  type: AccountType;
}

@InputType()
export class JournalEntryInput {
  @Field((type) => String, { nullable: false })
  memo: string;

  @Field((type) => String, { nullable: false })
  book_name: string;

  @Field((type) => Metadata, { nullable: false })
  metadata: Metadata;

  @Field((type) => TransactionType, { nullable: false })
  transaction_type: TransactionType;

  @Field((type) => String, { nullable: true })
  payment_method: string;

  @Field((type) => String, { nullable: true })
  payment_method_account_code: string;

  @Field((type) => [AccountCodes], { nullable: false })
  account_codes: AccountCodes[];

  @Field((type) => Float, { nullable: false })
  amount: number;
}
