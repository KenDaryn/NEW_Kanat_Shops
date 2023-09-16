import { object, string, number, InferType, boolean, date } from "yup";

const UserSchema = object({
  username: string().required("Username is required!"),
  password: string().required("Password is required!"),
  id_shops: number(),
  createdOn: date().default(() => new Date()),
});

export type Users = InferType<typeof UserSchema>;
export default UserSchema;
