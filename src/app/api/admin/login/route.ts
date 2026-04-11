import { NextResponse } from "next/server";
import { setAdminSessionCookie, validateAdminPassword } from "@/lib/admin-auth";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    if (!validateAdminPassword(password)) {
      return NextResponse.json({ error: "Невірний пароль." }, { status: 401 });
    }

    await setAdminSessionCookie();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Помилка входу." },
      { status: 500 }
    );
  }
}
