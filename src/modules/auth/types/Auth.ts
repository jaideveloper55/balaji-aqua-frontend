//  Tenant

export interface TenantFeature {
  icon: string;
  title: string;
  desc: string;
}

export interface TenantConfig {
  id: string;
  name: string;
  shortName: string;
  tagline: string;
  accent: string;
  accentHover: string;
  accentSoft: string;
  gradientFrom: string;
  gradientVia: string;
  gradientTo: string;
  description: string;
  features: TenantFeature[];
}

export type TenantId = "sri-balaji-aqua" | "royal-beverage";

// Auth Forms

export interface PasswordFormValues {
  email: string;
  password: string;
}

export interface PinFormValues {
  pin: string;
}

export type AuthTabKey = "password" | "pin";
