import { PaymentStatus } from "@/lib/types";
import { CreditCard } from "lucide-react";

interface PaymentStatusTagProps {
  status: PaymentStatus;
  isTable?: boolean;
}

const paymentStatusStyles: {
  [key in PaymentStatus]: { bgColor: string; textColor: string; label: string };
} = {
  [PaymentStatus.Pending]: {
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-800",
    label: "Pending",
  },
  [PaymentStatus.Paid]: {
    bgColor: "bg-green-100",
    textColor: "text-green-800",
    label: "Paid",
  },
  [PaymentStatus.Failed]: {
    bgColor: "bg-red-100",
    textColor: "text-red-800",
    label: "Failed",
  },
  [PaymentStatus.Declined]: {
    bgColor: "bg-orange-100",
    textColor: "text-orange-800 ",
    label: "Declined",
  },
  [PaymentStatus.Cancelled]: {
    bgColor: "bg-gray-100",
    textColor: "text-gray-800",
    label: "Cancelled",
  },
  [PaymentStatus.Refunded]: {
    bgColor: "bg-blue-100 dark:bg-blue-500/10",
    textColor: "text-blue-800 dark:text-blue-500",
    label: "Refunded",
  },
  [PaymentStatus.PartiallyRefunded]: {
    bgColor: "bg-purple-100 dark:bg-purple-500/10",
    textColor: "text-purple-800 dark:text-purple-500",
    label: "Partially Refunded",
  },
  [PaymentStatus.Chargeback]: {
    bgColor: "bg-pink-100 dark:bg-pink-500/10",
    textColor: "text-pink-800 dark:text-pink-500",
    label: "Chargeback",
  },
};

const PaymentStatusTag: React.FC<PaymentStatusTagProps> = ({
  status,
  isTable,
}) => {
  const styles = paymentStatusStyles[status];

  return (
    <div>
      <span
        className={` py-1 px-2 inline-flex items-center gap-x-1 text-xs font-medium rounded-md ${styles.bgColor} ${styles.textColor}`}
      >
        <CreditCard className="shrink-0 size-3" />
        {status === "Pending" && !isTable
          ? "Pending (Waiting for payment)"
          : status}
      </span>
    </div>
  );
};

export default PaymentStatusTag;
