/* eslint-disable @typescript-eslint/no-this-alias */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { UserRolesEnum } from 'src/utils/constants';
import * as bcrypt from 'bcryptjs';
import { Store } from 'src/store/schemas/store.schema';
export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
})
export class User {
  @Prop({
    required: true,
  })
  firstName: string;

  @Prop({
    required: true,
  })
  lastName: string;

  @Prop()
  otherNames?: string;

  @Prop({
    required: true,
    unique: true,
  })
  email: string;

  @Prop({
    unique: true,
  })
  userName?: string;

  @Prop()
  profileImage?: string;

  @Prop({
    required: true,
    unique: true,
  })
  phoneNo: string;

  @Prop({
    required: true,
  })
  password: string;

  @Prop({
    required: true,
    type: String,
    enum: UserRolesEnum,
  })
  role: UserRolesEnum;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'Store' })
  store: Store;

  @Prop()
  passwordResetToken: string;

  @Prop()
  passwordResetTTL: Date;

  @Prop()
  emailConfirmationToken: string;

  @Prop()
  emailConfirmationTTL: Date;

  @Prop({
    default: false,
  })
  emailConfirmed: boolean;

  // add referee for agents and shop location managers
  //   @Prop({})
  //   referee: string;

  //shop linkage for agents
  //   @Prop({})
  //   shops: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', function (next) {
  const user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  // generate a salt
  bcrypt.genSalt(5, function (err, salt) {
    if (err) return next(err);

    // hash the password using our new salt
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);
      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});

// UserSchema.pre('u')
