import { useEffect } from "react";
import { Button, Tag } from "antd";
import { useForm } from "react-hook-form";
import {
  HiOutlineCheckCircle,
  HiOutlineOfficeBuilding,
  HiOutlinePencil,
} from "react-icons/hi";

import CustomModal from "../../../components/common/CustomModal";
import CustomInput from "../../../components/common/CustomInput";
import CustomSelect from "../../../components/common/CustomSelect";

import { Company } from "../types/company";
import { COMPANY_TYPES } from "../constants";
import { TYPE_META } from "../constants/companyMeta";

interface Props {
  company: Company | null;
  onClose: () => void;
  onEdit: (c: Company) => void;
}

const ViewCompanyModal = ({ company, onClose, onEdit }: Props) => {
  const {
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      type: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      gstNumber: "",
    },
  });

  useEffect(() => {
    if (company) {
      reset({
        name: company.name,
        type: company.type,
        email: company.email,
        phone: company.phone,
        address: company.address,
        city: company.city,
        state: company.state,
        gstNumber: company.gstNumber,
      });
    }
  }, [company, reset]);

  return (
    <CustomModal
      open={!!company}
      onClose={onClose}
      title={company?.name ?? "Company Details"}
      subtitle={company ? TYPE_META[company.type].label : undefined}
      icon={<HiOutlineOfficeBuilding size={22} />}
      iconTone="blue"
      size="2xl"
      headerRight={
        company ? (
          company.isActive ? (
            <Tag
              color="success"
              bordered={false}
              icon={<HiOutlineCheckCircle className="inline mr-1" />}
            >
              Active
            </Tag>
          ) : (
            <Tag bordered={false}>Inactive</Tag>
          )
        ) : null
      }
      footer={
        company && (
          <div className="flex justify-end gap-2">
            <Button onClick={onClose} size="large">
              Close
            </Button>
            <Button
              type="primary"
              size="large"
              icon={<HiOutlinePencil />}
              onClick={() => onEdit(company)}
            >
              Edit Company
            </Button>
          </div>
        )
      }
    >
      {company && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CustomInput
              name="name"
              control={control}
              errors={errors}
              label="Company Name"
              disabled
            />
            <CustomSelect
              name="type"
              control={control}
              errors={errors}
              label="Company Type"
              placeholder=""
              size="large"
              disabled
              options={COMPANY_TYPES}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CustomInput
              name="email"
              control={control}
              errors={errors}
              label="Work Email"
              iconType="mail"
              disabled
            />
            <CustomInput
              name="phone"
              control={control}
              errors={errors}
              label="Phone Number"
              disabled
            />
          </div>

          <CustomInput
            name="address"
            control={control}
            errors={errors}
            label="Street Address"
            disabled
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CustomInput
              name="city"
              control={control}
              errors={errors}
              label="City"
              disabled
            />
            <CustomInput
              name="state"
              control={control}
              errors={errors}
              label="State"
              disabled
            />
          </div>

          <CustomInput
            name="gstNumber"
            control={control}
            errors={errors}
            label="GST Number"
            disabled
          />
        </div>
      )}
    </CustomModal>
  );
};

export default ViewCompanyModal;
