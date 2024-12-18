import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";
import { AccountEmployee } from "@/components/UI/AccountEmployee/AccountEmployee";

const AccountPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Quản lý tài khoản" />
      <div className="flex flex-col gap-10">
        <AccountEmployee />
      </div>
    </DefaultLayout>
  );
};

export default AccountPage;