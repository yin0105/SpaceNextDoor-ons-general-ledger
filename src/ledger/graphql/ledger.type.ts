import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CreateJournalEntryResp {
  @Field((type) => Boolean, { nullable: false })
  success: boolean;
  @Field((type) => String, { nullable: false })
  message: string;
}
