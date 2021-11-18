import { Injectable, Logger } from '@nestjs/common';

import { InternalServerError } from '../shared/errors/errors.messages';
import { CreateJournalEntryArgs } from './graphql/ledger.args';
import {
  AccountCodes,
  AccountType,
  TransactionType,
} from './graphql/ledger.input';
import { CreateJournalEntryResp } from './graphql/ledger.type';
import { ICreditAccount, IDebitAccount } from './interfaces';
import { Account, SubAccount } from './interfaces/ledger.interface';
const { book } = require('medici');

@Injectable()
export class LedgerService {
  constructor(private readonly logger: Logger) {
    this.logger.setContext(LedgerService.name);
  }

  /**
   * Get Merchandise Debit Account.
   *
   * @param paymentMethod Payment Method which used for Merchandise receipt.
   * @param accountCode Account Code based on Payment Method.
   * @returns object
   */
  private getMerchandiseDebitAccount(
    paymentMethod: string,
    accountCode: string,
  ): IDebitAccount {
    const debitAccount = `${Account.CHECK_ASSETS}:${paymentMethod}`;
    return { debitAccount, accountCode };
  }

  /**
   * Get Merchandise Credit Account.
   *
   * @param accountCode Account Code based on Payment Method of Merchandise receipt.
   * @returns object
   */
  private getMerchandiseCreditAccount(
    accountCodes: AccountCodes[],
  ): ICreditAccount {
    const creditAccount = `${Account.ACCOUNTS_RECEIVABLE}:${SubAccount.FEES}`;
    // TODO: This account code will be changed later when we correct ledger account code.
    const accountCode = accountCodes.find(
      (x) => x.type === AccountType.MERCHANDISE,
    );
    // TODO: Will remove "?" later.
    return { creditAccount, accountCode: accountCode?.code };
  }

  getDebitAccount(
    transactionType: TransactionType,
    accountCodes: AccountCodes[],
    paymentMethod: string,
    paymentMethodAccountCode: string,
  ): { debitAccount: string; accountCode: string } {
    switch (transactionType) {
      case TransactionType.PAYMENT_RENT:
      case TransactionType.PAYMENT_DEPOSIT:
      case TransactionType.PAYMENT_INSURANCE:
      case TransactionType.PAYMENT_ADMIN_FEE: {
        const debitAccount = `${Account.CHECK_ASSETS}:${paymentMethod}`;

        return { debitAccount, accountCode: paymentMethodAccountCode };
      }
      case TransactionType.DEPOSIT_REFUND: {
        const debitAccount = `${Account.LIABILITY}:${SubAccount.SECURITY_DEPOSITS}`;
        const accountCode = accountCodes.find(
          (x) => x.type === AccountType.SECURITY_DEPOSITS,
        );
        return { debitAccount, accountCode: accountCode.code };
      }
      case TransactionType.INSURANCE_REFUND: {
        const debitAccount = `${Account.LIABILITY}:${SubAccount.PREPAID_INSURANCE_LIABILITIES}`;
        const accountCode = accountCodes.find(
          (x) => x.type === AccountType.PREPAID_INSURANCE_LIABILITIES,
        );
        return { debitAccount, accountCode: accountCode.code };
      }
      case TransactionType.RENT_REFUND: {
        const debitAccount = `${Account.INCOME}:${SubAccount.RENT}`;
        const accountCode = accountCodes.find(
          (x) => x.type === AccountType.RENT,
        );
        return { debitAccount, accountCode: accountCode.code };
      }
      case TransactionType.ADMIN_FEE_REFUND: {
        const debitAccount = `${Account.INCOME}:${SubAccount.ADMIN_FEE}`;
        const accountCode = accountCodes.find(
          (x) => x.type === AccountType.ADMIN_FEES,
        );
        return { debitAccount, accountCode: accountCode.code };
      }
      case TransactionType.RENT_INVOICING: {
        const debitAccount = `${Account.ACCOUNTS_RECEIVABLE}:${SubAccount.RENT}`;
        const accountCode = accountCodes.find(
          (x) => x.type === AccountType.RENT,
        );
        return { debitAccount, accountCode: accountCode.code };
      }
      case TransactionType.INSURANCE_INVOICING: {
        const debitAccount = `${Account.ACCOUNTS_RECEIVABLE}:${SubAccount.INSURANCE}`;
        const accountCode = accountCodes.find(
          (x) => x.type === AccountType.INSURANCE,
        );
        return { debitAccount, accountCode: accountCode.code };
      }
      case TransactionType.ADMIN_FEE_INVOICING: {
        const debitAccount = `${Account.ACCOUNTS_RECEIVABLE}:${SubAccount.FEES}`;
        const accountCode = accountCodes.find(
          (x) => x.type === AccountType.FEES,
        );
        return { debitAccount, accountCode: accountCode.code };
      }
      case TransactionType.MERCHANDISE_PAYMENT:
        return this.getMerchandiseDebitAccount(
          paymentMethod,
          paymentMethodAccountCode,
        );
    }

    throw InternalServerError('Something went wrong');
  }

  getCreditAccount(
    transactionType: TransactionType,
    accountCodes: AccountCodes[],
    paymentMethod: string,
    paymentMethodAccountCode: string,
  ): { creditAccount: string; accountCode: string } {
    switch (transactionType) {
      case TransactionType.PAYMENT_RENT: {
        const creditAccount = `${Account.ACCOUNTS_RECEIVABLE}:${SubAccount.RENT}`;
        const accountCode = accountCodes.find(
          (x) => x.type === AccountType.RENT,
        );

        return { creditAccount, accountCode: accountCode.code };
      }
      case TransactionType.PAYMENT_DEPOSIT: {
        const creditAccount = `${Account.LIABILITY}:${SubAccount.SECURITY_DEPOSITS}`;
        const accountCode = accountCodes.find(
          (x) => x.type === AccountType.SECURITY_DEPOSITS,
        );

        return { creditAccount, accountCode: accountCode.code };
      }
      case TransactionType.PAYMENT_INSURANCE: {
        const creditAccount = `${Account.ACCOUNTS_RECEIVABLE}:${SubAccount.INSURANCE}`;
        const accountCode = accountCodes.find(
          (x) => x.type === AccountType.INSURANCE,
        );

        return { creditAccount, accountCode: accountCode.code };
      }
      case TransactionType.PAYMENT_ADMIN_FEE: {
        const creditAccount = `${Account.ACCOUNTS_RECEIVABLE}:${SubAccount.FEES}`;
        const accountCode = accountCodes.find(
          (x) => x.type === AccountType.FEES,
        );

        return { creditAccount, accountCode: accountCode.code };
      }
      case TransactionType.RENT_INVOICING: {
        const creditAccount = `${Account.INCOME}:${SubAccount.RENTAL_INCOME}`;
        const accountCode = accountCodes.find(
          (x) => x.type === AccountType.RENTAL_INCOME,
        );

        return { creditAccount, accountCode: accountCode.code };
      }
      case TransactionType.INSURANCE_INVOICING: {
        const creditAccount = `${Account.INCOME}:${SubAccount.INSURANCE_INCOME}`;
        const accountCode = accountCodes.find(
          (x) => x.type === AccountType.INSURANCE_INCOME,
        );

        return { creditAccount, accountCode: accountCode.code };
      }
      case TransactionType.ADMIN_FEE_INVOICING: {
        const creditAccount = `${Account.FEE_INCOME}:${SubAccount.ADMINISTRATIVE_FEES}`;
        const accountCode = accountCodes.find(
          (x) => x.type === AccountType.ADMINISTRATIVE_FEES,
        );

        return { creditAccount, accountCode: accountCode.code };
      }
      case TransactionType.DEPOSIT_REFUND:
      case TransactionType.INSURANCE_REFUND:
      case TransactionType.RENT_REFUND:
      case TransactionType.ADMIN_FEE_REFUND: {
        const creditAccount = `${Account.CHECK_ASSETS}:${paymentMethod}`;

        return { creditAccount, accountCode: paymentMethodAccountCode };
      }
      case TransactionType.MERCHANDISE_PAYMENT:
        return this.getMerchandiseCreditAccount(accountCodes);
    }

    throw InternalServerError('Something went wrong');
  }

  public async createJournalEntry(
    args: CreateJournalEntryArgs,
  ): Promise<CreateJournalEntryResp> {
    const {
      metadata,
      book_name,
      memo,
      amount,
      transaction_type,
      account_codes,
      payment_method,
      payment_method_account_code,
    } = args?.payload;

    const { debitAccount, accountCode: debitAccountCode } =
      this.getDebitAccount(
        transaction_type,
        account_codes,
        payment_method,
        payment_method_account_code,
      );

    const { creditAccount, accountCode: creditAccountCode } =
      this.getCreditAccount(
        transaction_type,
        account_codes,
        payment_method,
        payment_method_account_code,
      );

    try {
      const myBook = new book(book_name);
      await myBook
        .entry(memo)
        .debit(debitAccount, amount, {
          ...metadata,
          account_code: debitAccountCode,
        })
        .credit(creditAccount, amount, {
          ...metadata,
          account_code: creditAccountCode,
        })
        .commit();
      return {
        message: 'Journal Entry has been created successfully!',
        success: true,
      };
    } catch (e) {
      throw InternalServerError('Something went wrong');
    }
  }
}
