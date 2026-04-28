import { Button } from "antd";
import { HiOutlineTrash } from "react-icons/hi";

import CustomModal from "../../../components/common/CustomModal";
import { Company } from "../types/company";

interface Props {
  company: Company | null;
  onClose: () => void;
  onConfirm: () => void;
}

const DeactivateCompanyModal = ({ company, onClose, onConfirm }: Props) => (
  <CustomModal
    open={!!company}
    onClose={onClose}
    title="Deactivate Company"
    subtitle="This company will be hidden from active listings"
    icon={<HiOutlineTrash size={22} />}
    iconTone="red"
    size="md"
    footer={
      <div className="flex justify-end gap-2">
        <Button onClick={onClose}>Cancel</Button>
        <Button danger type="primary" onClick={onConfirm}>
          Deactivate
        </Button>
      </div>
    }
  >
    {company && (
      <p className="text-slate-600">
        Are you sure you want to deactivate{" "}
        <span className="font-semibold text-slate-900">{company.name}</span>?
        You can reactivate it later from the company details.
      </p>
    )}
  </CustomModal>
);

export default DeactivateCompanyModal;
