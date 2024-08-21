"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";
import Ticket from "@/components/UI/Ticket/Ticket";
import { Select, TableProps } from "antd";
import Journey from "@/components/UI/Journey/Journey";

const { Option } = Select;
type OnChange = NonNullable<TableProps<Journey>["onChange"]>;
type Filters = Parameters<OnChange>[1];

type GetSingle<T> = T extends (infer U)[] ? U : never;
type Sorts = GetSingle<Parameters<OnChange>[2]>;

interface TripProps {
  params: {
    slug: number;
  };
}

const TicketPage: React.FC<TripProps> = ({ params }) => {
  const { slug } = params;

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Quản lý vé" />
      <div className="flex flex-col gap-10">
        <Ticket params={params}></Ticket>
      </div>
    </DefaultLayout>
  );
};

export default TicketPage;
