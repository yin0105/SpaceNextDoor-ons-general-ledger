import { Logger, Module } from '@nestjs/common';

import { LedgerResolver } from './graphql/ledger.resolver';
import { LedgerService } from './ledger.service';

@Module({
  imports: [],
  providers: [LedgerResolver, LedgerService, Logger],
  exports: [],
})
export class LedgerModule {}
