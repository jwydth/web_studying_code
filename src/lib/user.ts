import { cookies } from "next/headers";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/db";

/** Read-only: safe in Server Components & routes (Next 15 requires awaiting cookies) */
export async function readUserId(): Promise<string | undefined> {
  const c = await cookies();
  return c.get("uid")?.value;
}

/** Route-only: sets cookie if missing AND ensures a User row exists */
export async function ensureUserIdInRoute(): Promise<string> {
  const c = await cookies();
  let id = c.get("uid")?.value;

  if (!id) {
    id = randomUUID();
    // set a non-httpOnly cookie so client can read if you need later
    c.set("uid", id, { path: "/", sameSite: "lax", maxAge: 60 * 60 * 24 * 365 });
  }

  // ✅ make sure this id exists in the User table
  await prisma.user.upsert({
    where: { id },
    update: {},
    create: {
      id,
      email: `guest_${id}@example.invalid`, // harmless placeholder
      name: "Guest",
    },
  });

  return id;
}
