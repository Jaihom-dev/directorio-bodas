export interface UserCredential {
  user?: User;
  providerId?: string;
  _tokenResponse?: TokenResponse;
  operationType?: string;
  moreInfo?: MoreInfo;
}

interface TokenResponse {
    kind?: string;
    idToken?: string;
    email?: string;
    refreshToken?: string;
    expiresIn?: string;
    localId?: string;
}

export interface User {
    uid?: string;
    email?: string;
    emailVerified?: boolean;
    displayName?: string;
    isAnonymous?: boolean;
    providerData?: ProviderDatum[];
    stsTokenManager?: StsTokenManager;
    createdAt?: string;
    lastLoginAt?: string;
    apiKey?: string;
    appName?: string;
}

interface ProviderDatum {
  providerId?: string;
  uid?: string;
  displayName?: string;
  email?: string;
  phoneNumber?: null;
  photoURL?: null;
}

interface StsTokenManager {
  refreshToken?: string;
  accessToken?: string;
  expirationTime?: number;
}

interface MoreInfo {
  uid?: string;
  city: string;
  country: string;
  weddingDate: Date;
  phoneNumber: string;
  role: string[];
}
