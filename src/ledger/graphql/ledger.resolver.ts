import { Logger } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { LedgerService } from '../ledger.service';
import { CreateJournalEntryArgs } from './ledger.args';
import { CreateJournalEntryResp } from './ledger.type';

@Resolver()
export class LedgerResolver {
  constructor(
    private readonly ledgerService: LedgerService,
    private readonly logger: Logger,
  ) {
    this.logger.setContext(LedgerResolver.name);
  }

  @Query(() => String)
  sayHello(): string {
    return 'Hello World!';
  }

  @Mutation((returns) => CreateJournalEntryResp)
  async createJournalEntry(
    @Args() args: CreateJournalEntryArgs,
  ): Promise<CreateJournalEntryResp> {
    return this.ledgerService.createJournalEntry(args);
  }
}
