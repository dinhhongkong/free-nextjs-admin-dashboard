import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";
import Bus from "@/components/UI/Bus/Bus";

const BusPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Quản lý xe khách" />
      <div className="flex flex-col gap-10">
        <Bus />
      </div>
    </DefaultLayout>
  );
};

export default BusPage;
