import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

const Admin = async () => {
  const user = await getCurrentUser() as { username: string } | null;

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">Admin</h1>
      <p>Welcome, {user.username}!</p>
      <Link href="/admin/profile" className="text-blue-500 hover:underline">
        View Profile
      </Link>
    </div>
  );
};

export default Admin;
