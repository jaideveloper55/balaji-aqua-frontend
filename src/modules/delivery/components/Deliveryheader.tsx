import { HiOutlinePlus, HiOutlineTruck } from "react-icons/hi";

interface Props {
  onCreate: () => void;
}

const Deliveryheader = ({ onCreate }: Props) => (
  <div className="flex flex-wrap items-center justify-between gap-4">
    <div className="flex items-center gap-4">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
        <HiOutlineTruck className="h-7 w-7" />
      </div>
      <div>
        <h1 className="text-2xl font-bold leading-tight text-slate-900">
          Delivery Management
        </h1>
        <p className="text-sm text-slate-500">
          Create orders, assign delivery boys and track every delivery
        </p>
      </div>
    </div>

    <button
      type="button"
      onClick={onCreate}
      className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
    >
      <HiOutlinePlus className="h-5 w-5" />
      New Order
    </button>
  </div>
);

export default Deliveryheader;
