/* eslint-disable @typescript-eslint/no-this-alias */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';
import { TokenStatusEnum, UserRolesEnum } from 'src/utils/constants';
export type UserDocument = HydratedDocument<RegistrationToken>;

@Schema({
  timestamps: true,
})
export class RegistrationToken {
  @Prop({ type: mongoose.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({
    unique: true,
  })
  token: string;

  @Prop()
  tokenTTl: Date;

  @Prop({
    enum: TokenStatusEnum,
    default: TokenStatusEnum.ACTIVE,
  })
  status: TokenStatusEnum;

  @Prop({
    enum: UserRolesEnum,
  })
  use: UserRolesEnum; //need a way to define the shop or agent (use name)

  @Prop()
  registered: string; //should contain Id of registered object
}

export const RegistrationTokenSchema =
  SchemaFactory.createForClass(RegistrationToken);
