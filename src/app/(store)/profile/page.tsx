import OrdersOverview from "@/components/store/profile/OrdersOverview";
import ProfileOverview from "@/components/store/profile/Overview";

const ProfilePage = () => {
  return (
    <div>
      <ProfileOverview />
      <OrdersOverview />
    </div>
  );
};

export default ProfilePage;
