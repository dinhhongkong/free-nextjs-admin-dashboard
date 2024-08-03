import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";
import Office from "@/components/UI/Office/Office";

const OfficePage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Quản lý trạm xe" />
      <div className="flex flex-col gap-10">
        <Office />
      </div>
    </DefaultLayout>
  );
};

export default OfficePage;
