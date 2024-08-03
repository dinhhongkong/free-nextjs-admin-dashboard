import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";
import Ticket from "@/components/UI/Ticket/Ticket";

const OfficePage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Quản lý vé" />
      <div className="flex flex-col gap-10">
        <Ticket />
      </div>
    </DefaultLayout>
  );
};

export default OfficePage;
