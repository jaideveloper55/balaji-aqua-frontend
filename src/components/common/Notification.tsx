import { toast } from "react-toastify";

export const successNotification = (message: string, description: string) => {
  toast.success(
    <div>
      <div className="font-normal text-green-600 text-base">{message}</div>
      <div className="text-xs font-thin text-slate-600">{description}</div>
    </div>,
    {
      position: "top-right",
      icon: (
        <img
          src="/images/notification/success.svg"
          alt="success"
          width={40}
          height={40}
          style={{ objectFit: "cover" }}
        />
      ),
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    }
  );
};

export const errorNotification = (message: string, description: string) => {
  toast.error(
    <div>
      <div className="font-normal text-red-500 text-base">{message}</div>
      <div className="text-xs font-thin text-slate-600">{description}</div>
    </div>,
    {
      position: "top-right",
      icon: (
        <img
          src="/images/notification/warning.svg"
          alt="warning"
          width={40}
          height={40}
          style={{ objectFit: "cover" }}
        />
      ),
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    }
  );
};
