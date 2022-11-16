import { withAxiom } from "next-axiom";
import withApiSupabase from "../../../components/api/utils/withApiSupabase";
import { Database } from "../../../database-types";

// Utility to redirect Github OAuth requests from Ngrok to the correct URL
export default withAxiom(
  withApiSupabase<Database>(async function ProtectedRoute(req, res, _) {
    const params = new URLSearchParams(
      req.query as Record<string, string>,
    ).toString();

    res.redirect("http://localhost:54321/auth/v1/callback?" + params);
  }),
);
