import {
  createServerSupabaseClient,
  SupabaseClient,
} from "@supabase/auth-helpers-nextjs";
import { NextApiResponse } from "next";
import { AxiomAPIRequest } from "next-axiom/dist/withAxiom";
import { Database } from "../../../database-types";

export type AddParameters<
  TFunction extends (...args: any) => any,
  TParameters extends [...args: any],
> = (
  ...args: [...Parameters<TFunction>, ...TParameters]
) => ReturnType<TFunction>;

export default function withApiSupabase<ResponseType = any>(
  handler: (
    req: AxiomAPIRequest,
    res: NextApiResponse,
    supabaseClient: SupabaseClient<Database>,
  ) => Promise<void | NextApiResponse>,
) {
  return async (req: AxiomAPIRequest, res: NextApiResponse): Promise<void> => {
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ) {
      const errorMessage =
        "NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY env variables are required!";
      console.error(errorMessage);
      res.status(500).send({
        error: {
          message: errorMessage,
        },
      });
    }

    const supabase = createServerSupabaseClient<Database, "public">({
      req,
      res,
    });

    try {
      await handler(req, res, supabase);
    } catch (error) {
      console.error("Error in handling child of withApiSupabase", error);
      res.status(500).send({
        error: String(error),
      });
      return;
    }
  };
}
