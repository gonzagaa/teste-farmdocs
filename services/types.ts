type Subscription = {
    id: number;
    status: string;
    start_at: string;
    end_at: string;
    next_billing_at: string | null;
    overdue_since: string | null;
    code: string | null;
    cancel_at: string;
    interval: string;
    interval_count: number;
    billing_trigger_type: string;
    billing_trigger_day: number;
    billing_cycles: number | null;
    installments: number;
    created_at: string;
    updated_at: string;
    customer: {
      id: number;
      name: string;
      email: string;
      code: string | null;
    };
    plan: {
      id: number;
      name: string;
      code: string | null;
    };
    product_items: {
      id: number;
      status: string;
      uses: number;
      cycles: number | null;
      quantity: number;
      created_at: string;
      updated_at: string;
      product: {
        id: number;
        name: string;
        code: string | null;
      };
      pricing_schema: {
        id: number;
        short_format: string;
        price: string;
        minimum_price: string | null;
        schema_type: string;
        pricing_ranges: any[];
        created_at: string;
      };
      discounts: any[];
    }[];
    payment_method: {
      id: number;
      public_name: string;
      name: string;
      code: string;
      type: string;
    };
    current_period: {
      id: number;
      billing_at: string;
      cycle: number;
      start_at: string;
      end_at: string;
      duration: number;
    };
    metadata: Record<string, any>;
    payment_profile: {
      id: number;
      holder_name: string;
      registry_code: string | null;
      bank_branch: string | null;
      bank_account: string | null;
      card_expiration: string;
      allow_as_fallback: boolean | null;
      card_number_first_six: string;
      card_number_last_four: string;
      renewed_card: {
        card_number_last_four: string | null;
        card_expiration: string | null;
      };
      card_renewed_at: string | null;
      token: string;
      created_at: string;
      payment_company: {
        id: number;
        name: string;
        code: string;
      };
    };
    invoice_split: boolean;
    subscription_affiliates: any[];
  };
  
  type SubscriptionsResponse = {
    subscriptions: Subscription[];
  };
  
  type Error = {
    error: string;
    status: string;
  };
  
  type SignInCredentials = {
    email: string;
    password: string;
  };
  
  type SignUpCredentials = {
    name: string;
    email: string;
    thumbnail?: string;
    password: string;
    phone: string;
  };
  
  export type {
    Subscription,
    SubscriptionsResponse,
    Error,
    SignInCredentials,
    SignUpCredentials,
  };
  