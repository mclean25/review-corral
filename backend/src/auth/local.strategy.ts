import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { SupabaseAuthStrategy, SupabaseAuthUser } from "nestjs-supabase-auth";
import { ExtractJwt } from "passport-jwt";

@Injectable()
export class SupabaseStrategy extends PassportStrategy(
  SupabaseAuthStrategy,
  "supabase",
) {
  public constructor() {
    super({
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY,
      supabaseOptions: {},
      supabaseJwtSecret: process.env.SUPABASE_JWT_SECRET,
      extractor: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: SupabaseAuthUser): Promise<any> {
    const user = await super.validate(payload);
    return user;
  }

  authenticate(req) {
    super.authenticate(req);
  }
}