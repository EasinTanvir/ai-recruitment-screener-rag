"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import Button from "@/components/shared/Button";
import { logoutAction } from "@/app/user/setting/actions";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);

    try {
      await logoutAction();

      toast.success("Logged out successfully.");
      router.push("/login");
    } catch (error) {
      toast.error("Unable to log out. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="secondary"
      type="button"
      onClick={handleLogout}
      disabled={loading}
    >
      {loading ? "Signing out..." : "Sign out"}
    </Button>
  );
}
