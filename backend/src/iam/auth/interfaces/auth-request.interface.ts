export interface UserPayload {
  id: string;
  email: string;
}
export interface AuthenticatedRequest {
  user: UserPayload;
}
