export interface User {
  id: string;
}

export interface Reserve {
  id: string;
  symbol: string;
}
export interface UserReserves {
  id: string;
  reserve: Reserve;
  user: User;
}

export interface Data {
  userReserves: UserReserves[];
}

export interface AaveUserReserves {
   data: Data;
}


