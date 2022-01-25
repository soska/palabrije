import { json, Session } from "remix";
import { createCookieSessionStorage } from "remix";
import type { SessionState } from "~/lib/types";

export const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    // a Cookie from `createCookie` or the same CookieOptions to create one
    cookie: {
      name: "plbrjssn",
      secrets: ["p4l4br1j3.r0ck5"],
      sameSite: "lax",
    },
  });

export function isStateFresh(state: SessionState) {
  const d = new Date();
  const date = d.toDateString();
  return state.date === date;
}

export async function jsonWithSession(data: any, session: Session) {
  return json(data, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}
