export interface ITenant {
  userName: string;
  email: string;
  phone: string;
  country: string;
  password: string;
  isAdmin: boolean;
}
export interface ILand {
  phone: string;
  ownerName: string;
  status: string;
  land: {
    size: string;
    description: string;
    fenced: boolean;
    tittled: boolean;
    price: number;
    rate: string;
    location: {
      county: string;
      ward: string;
    };
  };
}
export interface IAdmin {
  userName: string;
  email: string;
  password: string;
}
