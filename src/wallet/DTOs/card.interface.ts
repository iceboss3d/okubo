export interface IAuthorization {
  authorization_code: string;
  bin: string;
  last4: string;
  exp_month: string;
  exp_year: string;
  channel: string;
  card_type: string;
  bank: string;
  country_code: string;
  brand: string;
  reusable: boolean;
  signature: string;
  account_name: null | string;
}

export interface IPaystackInitResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export interface IPaystackVerifyResponse {
  status: true;
  message: 'Verification successful';
  data: {
    status: string;
    reference: string;
    amount: number;
    message: null;
    currency: string;
    metadata: Record<string, any>;
    fees: number;
    authorization: IAuthorization;
  };
}

export enum ChargeFrom {
  SAVED_CARD = 'saved_card',
  NEW_CARD = 'new_card',
}

export interface IPaystackInitPayload {
  amount: number;
  email: string;
  channels: string[];
  callback_url: string;
  authorization_code?: string;
  metadata: {
    wallet_id: string;
  };
}
