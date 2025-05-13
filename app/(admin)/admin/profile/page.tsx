
import ProfileDetails from "@/components/profile/profile-details";
import ProfileUpdateForm from "@/components/profile/complete-profile";
import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";

const Profile = async () => {
  const user = await getCurrentUser();
  return (
    <>
      <div className="rounded-xl border bg-white/60 p-2 shadow dark:bg-accent/20 sm:p-4">
        <Link
          href="/dashboard"
          className="mb-4 block text-blue-500 hover:underline"
        >
          Back
        </Link>
        <ProfileDetails
          user={{ username: user?.username!, email: user?.email!, image: user?.image! }}
        />
        <div className="mt-6">
        
        </div>
      </div>
    </>
  );
};

export default Profile;
