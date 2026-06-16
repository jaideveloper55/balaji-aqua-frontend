import React from "react";
import { Button } from "antd";
import { HiOutlineArrowLeft } from "react-icons/hi";
import { useMutation } from "@tanstack/react-query";
import CustomerForm from "./Customerform";
import { createCustomerApi } from "../api/customers.api";
import type { CustomerFormValues } from "../types/Customer";
import {
  errorNotification,
  successNotification,
} from "../../../components/common/Notification";

interface CustomerCreateProps {
  onBack?: () => void;
  onSuccess?: (id: string) => void;
}

const CustomerCreate: React.FC<CustomerCreateProps> = ({
  onBack,
  onSuccess,
}) => {
  const createCustomer = useMutation({
    mutationKey: ["createCustomer"],
    mutationFn: (data: CustomerFormValues) => createCustomerApi(data),
    onSuccess: (response) => {
      successNotification(
        "Success",
        response.data.message ?? "Customer created successfully"
      );
      onSuccess?.(response.data.id);
    },
    onError: (error: any) => {
      errorNotification("Error", error.message);
    },
  });

  const handleSubmit = (data: CustomerFormValues) => {
    createCustomer.mutate(data);
  };

  return (
    <div className="flex flex-col gap-6 p-6 max-w-[900px] mx-auto">
      <div className="flex items-center gap-4">
        <Button
          icon={<HiOutlineArrowLeft size={16} />}
          onClick={onBack}
          className="!rounded-xl"
          disabled={createCustomer.isPending}
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
          loading={createCustomer.isPending}
        />
      </div>
    </div>
  );
};

export default CustomerCreate;
