import { NextResponse } from "next/server";
import { loginFormSchema } from "@/app/(authentication)/login/_components/schema";
import validateFormData from "@/helpers/validateFormData";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  // Server side form validation
  const { errors } = validateFormData(loginFormSchema, {
    email,
    password,
  });

  // If there are validation errors, return a JSON response with the errors and a 401 status.
  if (errors) {
    return NextResponse.json({ errors }, { status: 401 });
  }

  const response = await fetch(
    `${process.env.BACKEND_API_URL || "http://127.0.0.1:8000/api/v1"}/auth/admin-login`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    }
  );

  if (!response.ok) {
    const backendError = await response.json().catch(() => null);
    return NextResponse.json(
      {
        errors: {
          password:
            backendError?.detail ||
            "Cannot connect to the FastAPI backend or the credentials are invalid",
        },
      },
      { status: 401 }
    );
  }

  const token = await response.json();
  const result = NextResponse.json(token);
  result.cookies.set("myziya_access_token", token.access_token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return result;
}
