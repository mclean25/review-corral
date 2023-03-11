import withApiSupabase from "../../../components/api/utils/withApiSupabase";
import { Database } from "../../../types/database-types";

export default withApiSupabase<Database>(async function ProtectedRoute(
  req,
  res,
  supabaseServerClient,
) {
  res.status(200).end();
});
