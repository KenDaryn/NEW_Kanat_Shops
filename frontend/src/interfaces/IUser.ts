export interface IUser {
  id: number;
  username: string;
  password: string;
  token: string;
  role?: string;
  id_shops?:number
//   blocked: boolean;
}
