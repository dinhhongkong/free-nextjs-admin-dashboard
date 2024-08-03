import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";
import Employee from "@/components/UI/Employee/Employee";

const EmployeePage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Quản lý nhân viên" />
      <div className="flex flex-col gap-10">
        <Employee />
      </div>
    </DefaultLayout>
  );
};

export default EmployeePage;
