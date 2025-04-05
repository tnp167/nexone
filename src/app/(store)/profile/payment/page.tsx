import { getUserPayments } from "@/queries/profile";
import PaymentsTable from "@/components/store/profile/payments/PaymentsTable";
import React from "react";

const PaymentPaymentsPage = async () => {
  const { payments, totalPages } = await getUserPayments();
  return (
    <div>
      <PaymentsTable payments={payments} totalPages={totalPages} />
    </div>
  );
};

export default PaymentPaymentsPage;
