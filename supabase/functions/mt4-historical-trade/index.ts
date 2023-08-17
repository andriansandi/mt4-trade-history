import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Client } from "https://deno.land/x/mysql/mod.ts";
import * as mod from "https://deno.land/std@0.192.0/uuid/mod.ts";
import axiod from "https://deno.land/x/axiod/mod.ts";
import moment from "https://deno.land/x/momentjs@2.29.1-deno/mod.ts";

serve(async (server) => {
  return new Response("Maho");
});
