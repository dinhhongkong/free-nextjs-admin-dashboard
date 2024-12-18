import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ManageTicket from "./manageTicket";

const ManageTicketPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Quản lý vé" />
      <div className="flex flex-col gap-10">
        <ManageTicket />
      </div>
    </DefaultLayout>
  );
};

export default ManageTicketPage;