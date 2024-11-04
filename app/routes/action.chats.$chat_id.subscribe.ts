import { Messages } from "@prisma/client";
import type { LoaderFunctionArgs } from "@remix-run/node";

import { eventStream } from "remix-utils/sse/server";
import { chat_message_emitter } from "~/features/chat";

export async function loader({ request }: LoaderFunctionArgs) {
  return eventStream(request.signal, function setup(send) {
    function handle(message: Messages) {
      send({ event: "new-message", data: JSON.stringify(message) });
    }

    chat_message_emitter.on("message", handle);

    return function clear() {
      chat_message_emitter.off("message", handle);
    };
  });
}
