import { object, string, number, InferType, date } from "yup";

const ItemSchema = object({
  item_name: string().required("Name is required").max(55),
  create_date: date(),
});

export type Items = InferType<typeof ItemSchema>;
export default ItemSchema;
