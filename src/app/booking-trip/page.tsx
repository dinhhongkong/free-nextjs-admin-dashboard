import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import BookingTrip from "./BookingTrip";

const BookingPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Đặt vé hộ khách" />
      <div className="flex flex-col gap-10">
        <BookingTrip />
      </div>
    </DefaultLayout>
  );
};

export default BookingPage;
