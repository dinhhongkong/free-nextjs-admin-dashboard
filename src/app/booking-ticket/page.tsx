import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import BookingTicketPage from "./bookingTicket";

const BookingPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Đặt vé hộ khách" />
      <div className="flex flex-col gap-10">
        <BookingTicketPage />
      </div>
    </DefaultLayout>
  );
};

export default BookingPage;