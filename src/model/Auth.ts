export type User = {
  userId: number | null ;
  username: string | null;
  role: string | null;
  iat: number;
  exp: number;
}

export type TokenResponse = {
  accessToken: string;
  tokenType: string;
}
