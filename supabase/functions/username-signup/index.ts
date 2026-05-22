import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const usernameRe = /^[a-z0-9_]{3,24}$/;
const localAuthDomain = "hondaaccord.app";

function normalizeUsername(username: string) {
  return username.trim().replace(/^@/, "").toLowerCase();
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { username, password } = await req.json();
    const normalizedUsername = normalizeUsername(String(username ?? ""));

    if (!usernameRe.test(normalizedUsername)) {
      return json({ error: "Use 3-24 letters, numbers, or underscores." }, 400);
    }

    if (typeof password !== "string" || password.length < 6) {
      return json({ error: "Password must be at least 6 characters." }, 400);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const email = `${normalizedUsername}@${localAuthDomain}`;
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", normalizedUsername)
      .maybeSingle();

    if (existingProfile) {
      return json({ error: "Username is already taken." }, 409);
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        username: normalizedUsername,
        display_name: normalizedUsername,
      },
    });

    if (error) {
      const message = error.message.toLowerCase().includes("already")
        ? "Username is already taken."
        : error.message;
      return json({ error: message }, 400);
    }

    if (data.user) {
      await supabase.from("profiles").upsert({
        id: data.user.id,
        username: normalizedUsername,
        display_name: normalizedUsername,
      });
    }

    return json({ ok: true });
  } catch (err) {
    return json(
      { error: err instanceof Error ? err.message : "Could not create account." },
      500,
    );
  }
});

function json(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
