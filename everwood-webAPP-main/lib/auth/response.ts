import { NextResponse } from "next/server";

export const ok = (data: unknown, status = 200): NextResponse =>
  NextResponse.json({ success: true, data }, { status });

export const err = (
  message: string,
  status: number,
  code?: string
): NextResponse =>
  NextResponse.json({ success: false, error: { message, code } }, { status });

export const validationErr = (
  issues: { message: string; path: (string | number)[] }[]
): NextResponse =>
  NextResponse.json(
    { success: false, error: { message: "Validation failed", issues } },
    { status: 422 }
  );
