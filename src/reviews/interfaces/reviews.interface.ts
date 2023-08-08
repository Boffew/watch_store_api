export interface Reviews {
  user_id: number;
  product_id: number;
  rating: number;
  comment: string;
}

export interface User {
  id: number;
  name: string;
}
