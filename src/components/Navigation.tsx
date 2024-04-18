import Link from "next/link";
import { Button, buttonVariants } from "./ui/button";
import { ModeToggle } from "./ToggleMode";
import { getServerSession } from "next-auth";
import SignOutButton from "./Sign-out";
import SignInButton from "./Sign-in";
import UserAccountNav from "./UserAccountNav";

const Navigation = async () => {
  const session = await getServerSession();
  console.log(session);
  const user = session?.user;
  return (
    <div className="p-4 flex items-center justify-between relative mx-2">
      <aside className="flex items-center gap-2 ">
        {/* <Image src={''}/> */}
        <h4 className="text-4xl font-bold">WebCanvas.</h4>
      </aside>
      <nav className="hidden md:block absolute left-[50%] top-[50%] transform translate-x-[-50%] translate-y-[-50%]">
        <ul className="flex items-center justify-center gap-8">
          <Link href={"/"}>Pricing</Link>
          <Link href={"/"}>About</Link>
          <Link href={"/"}>Documentation</Link>
          <Link href={"/features"}>Features</Link>
        </ul>
      </nav>
      <aside className="flex gap-2 items-center">
        {session ? (
          <>
            <Link
              href={"/agency"}
              // className="bg-primary text-white p-2 px-4 rounded-md hover:bg-primary"
              className={buttonVariants({ variant: "ghost" })}
            >
              Dashboard
            </Link>
            <UserAccountNav
              name={user?.name ?? "Welcome !"}
              email={user?.email ?? ""}
              imageURL={user?.image ?? ""}
            />
            <SignOutButton />
          </>
        ) : (
          <SignInButton />
        )}

        {/* <UserButton /> */}
        <ModeToggle />
      </aside>
    </div>
  );
};

export default Navigation;
