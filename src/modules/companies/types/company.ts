export type CompanyType =
  | "WATER_PLANT"
  | "DISTRIBUTOR"
  | "RETAILER"
  | "SERVICE_CENTER";

export interface CreateCompanyDto {
  name: string;
  type: CompanyType | "";
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  gstNumber: string;
}

export interface Company {
  id: string;
  name: string;
  type: CompanyType;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  gstNumber: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
