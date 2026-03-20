import React, { useState } from "react";
import { Button, message } from "antd";
import { HiOutlineArrowLeft } from "react-icons/hi";
import CustomerForm from "./Customerform";
import { customerApi } from "../services/Customer.api";
import type { CustomerFormValues } from "../types/Customer";

interface CustomerCreateProps {
  onBack?: () => void;
  onSuccess?: (id: string) => void;
}

const CustomerCreate: React.FC<CustomerCreateProps> = ({
  onBack,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: CustomerFormValues) => {
    setLoading(true);
    try {
      const created = await customerApi.createCustomer(data);
      message.success(`Customer "${created.name}" created successfully`);
      onSuccess?.(created.id);
    } catch {
      message.error("Failed to create customer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 max-w-[900px] mx-auto">
      <div className="flex items-center gap-4">
        <Button
          icon={<HiOutlineArrowLeft size={16} />}
          onClick={onBack}
          className="!rounded-xl"
        />
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            New Customer
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Add a new customer to your delivery network
          </p>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_1px_3px_rgba(15,23,42,0.04)] p-6 lg:p-8">
        <CustomerForm
          onSubmit={handleSubmit}
          onCancel={onBack}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default CustomerCreate;
