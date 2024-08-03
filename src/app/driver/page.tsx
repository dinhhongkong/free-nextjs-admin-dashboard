import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";
import Driver from "@/components/UI/Driver/Driver";

const DriverPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Quản lý tài xế" />
      <div className="flex flex-col gap-10">
        <Driver />
      </div>
    </DefaultLayout>
  );
};

export default DriverPage;
