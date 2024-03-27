import { getServerAuthSession } from "~/server/auth";
import Link from "next/link";
import Image from "next/image";

export async function Navbar() {
  const session = await getServerAuthSession();

  return (
    <div className="fixed left-0 top-0 z-10 flex w-screen items-center bg-gray-800 p-3 px-5 text-white">
      {/* logo */}
      <div className="flex-1">
        <Link href="/" className="text-3xl">
          develrock t3-todo
        </Link>
      </div>

      {/* login */}
      {session?.user === undefined && (
        <Link href={"/api/auth/signin"} className="btn btn-sm">
          Login
        </Link>
      )}

      {/* user & logout */}
      {session?.user !== undefined && (
        <div className="flex items-center gap-2">
          <div className="relative h-10 w-10 overflow-hidden rounded-full border bg-white">
            <Image
              fill={true}
              objectFit="cover"
              alt={session.user.name ?? "user"}
              src={session.user.image ? session.user.image : "/user.png"}
            />
          </div>
          {session.user.name}
          <Link className="btn btn-sm" href={"/api/auth/signout"}>
            Logout
          </Link>
        </div>
      )}
    </div>
  );
}
