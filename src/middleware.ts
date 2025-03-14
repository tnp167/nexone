import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getUserCountry } from "./lib/utils";

export default clerkMiddleware(async (auth, req) => {
  const protectedRoutes = createRouteMatcher([
    "/dashboard(.*)",
    "/checkout(.*)",
  ]);
  if (protectedRoutes(req)) await auth.protect();

  //Country Detection
  const response = NextResponse.next();

  const countryCookie = req.cookies.get("userCountry");

  if (!countryCookie) {
    const userCountry = await getUserCountry();
    response.cookies.set("userCountry", JSON.stringify(userCountry), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
  }

  return response;
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
