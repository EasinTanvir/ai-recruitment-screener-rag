import { getCurrentUser } from "./auth";

export async function authorize(requiredRole) {
  const user = await getCurrentUser();

  if (!user) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  if (requiredRole && user.role !== requiredRole) {
    return {
      success: false,
      message: "You are not authorized to perform this action.",
    };
  }

  return {
    success: true,
    user,
  };
}
