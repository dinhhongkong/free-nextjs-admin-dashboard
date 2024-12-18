import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";
import Document from "./document";

const DocumentPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Quản lý tài liệu nội bộ doanh nghiệp" />
      <div className="flex flex-col gap-10">
        <Document />
      </div>
    </DefaultLayout>
  );
};

export default DocumentPage;