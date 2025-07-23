import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // const body = await request.json();
    // const { userCountry } = body;
    // //Check if userCountry is provided
    // if (!userCountry) {
    //   return new NextResponse("User country is required", { status: 400 });
    // }
    // //Set the cookie
    // const response = new NextResponse("User cookie set successfully", {
    //   status: 200,
    // });
    // response.cookies.set("userCountry", JSON.stringify(userCountry), {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   path: "/",
    // });
    // return response;
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
