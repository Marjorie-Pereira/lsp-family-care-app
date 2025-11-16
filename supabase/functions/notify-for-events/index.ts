// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
"jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "@supabase/supabase-js";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";

console.log("Hello from Functions!");

dayjs.extend(utc);

Deno.serve(async (_req) => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const now = dayjs().utc().startOf("minute");
  const target = now.add(10, "minute"); // queremos eventos que acontecem daqui a 10 min

  // Select preciso para timestamptz
  const { data: events, error } = await supabase
    .from("Events")
    .select("*")
    .eq("notified", false)
    .gte("event_date", now.toISOString()) // >= agora
    .lte("event_date", target.toISOString()); // <= agora + 10min

  if (error) {
    console.error("Erro no select:", error);
    return new Response("Erro no select", { status: 500 });
  }

  const { data, error: usersError } = await supabase.from("Users").select("*");
  if (usersError) throw usersError;

  const push_token = data[0]?.push_token;
  console.log("users data", data);
  console.log("🚀 ~ Deno.serve ~ push_token:", push_token);

  if (!events?.length) {
    return new Response("Nenhum evento encontrado");
  }

  for (const event of events) {
    console.log("🔔 Notificando usuário do evento:", event.id);

    // EXPO PUSH
    try {
      const res = await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Deno.env.get("EXPO_ACCESS_TOKEN")}`,
        },
        body: JSON.stringify({
          to: push_token,
          sound: "default",
          body: `${event.name} inicia em 10 minutos!`,
          title: "Está quase na hora!",
          data: {
            event_id: event.id,
          },
        }),
      }).then((res) => res.json());

      await supabase
        .from("Events")
        .update({ notified: true })
        .eq("id", event.id);

      return new Response(JSON.stringify(res), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error(error);
      return new Response("Erro", { status: 500 });
    }
  }

  return new Response("User notified");
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/notify-for-events' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
