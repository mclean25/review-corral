import { NextApiRequest } from "next";

export async function getAccessTokenSafe(
  req: NextApiRequest,
): Promise<string | undefined> {
  // const { token } = await supabaseClient.auth.api.getUserByCookie(req);
  // return token ?? undefined;
  return undefined;
}
