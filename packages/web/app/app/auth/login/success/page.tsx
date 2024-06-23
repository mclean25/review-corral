"use client";

import { Loading } from "@/components/ui/cards/loading";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { FC, useEffect } from "react";

export const auth_access_token_key = "sst_auth_access_token";

const Page: FC<{ searchParams: { token?: string } }> = ({ searchParams }) => {
  useEffect(() => {
    const token = searchParams.token;

    if (token) {
      cookies().set(auth_access_token_key, token);
      redirect("/");
    } else {
      redirect("/error");
    }
  }, []);

  // This part will never be reached due to the redirects
  return <Loading />;
};

export default Page;
