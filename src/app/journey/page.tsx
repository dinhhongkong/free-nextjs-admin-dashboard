import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";
import Journey from "@/components/UI/Journey/Journey";

const OfficePage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Quản lý hành trình" />
      <div className="flex flex-col gap-10">
        <Journey />
      </div>
    </DefaultLayout>
  );
};

export default OfficePage;
