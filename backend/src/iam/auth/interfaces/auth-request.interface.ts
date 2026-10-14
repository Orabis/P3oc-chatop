export interface UserPayload {
  id: number;
  email: string;
}

export interface JwtPayload {
  sub: number;
  email: string;
}

export interface AuthenticatedRequest {
  user: UserPayload;
}
