import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { siteUrl } from "@/constants/siteUrl";

export async function POST() {
  const response = NextResponse.redirect(`${siteUrl}/login`, { status: 303 });
  response.cookies.delete("myziya_access_token");
  return response;
}
