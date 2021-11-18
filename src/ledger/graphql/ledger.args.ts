import { ArgsType, Field } from '@nestjs/graphql';

import { JournalEntryInput } from './ledger.input';

@ArgsType()
export class CreateJournalEntryArgs {
  @Field((type) => JournalEntryInput)
  payload: JournalEntryInput;
}
