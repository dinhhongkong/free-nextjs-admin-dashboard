import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";
import TrainChat from "./train-chat";

const TrainChatPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Quản lý dữ liệu training AI" />
      <div className="flex flex-col gap-10">
        <TrainChat />
      </div>
    </DefaultLayout>
  );
};

export default TrainChatPage;