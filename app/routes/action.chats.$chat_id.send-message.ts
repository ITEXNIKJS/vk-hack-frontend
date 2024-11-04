import { json, type ActionFunctionArgs } from "@remix-run/node";

import { chat_message_emitter } from "~/features/chat";
import db from "~/lib/db.server";

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const content = formData.get("content") as string;
  const chat_id = params.chat_id;

  if (content.replaceAll(" ", "").length < 1) {
    return json(
      {
        success: false,
        message: "Message cannot be empty",
      },
      { status: 400 }
    );
  }

  const result = await db.$transaction(async (tx) => {
    const chat = await tx.chats.findFirst({
      where: {
        id: chat_id,
      },
      select: {
        id: true,
      },
    });

    if (!chat) {
      return {
        success: false,
        message: null,
      };
    }

    return {
      success: true,
    };
  });

  if (!result.success) {
    return json(
      {
        success: false,
        message: "Chat already closed",
      },
      { status: 400 }
    );
  }

  chat_message_emitter.emit("message", result.message);

  return json(
    {
      success: true,
      message: "Message sent",
    },
    { status: 201 }
  );
};
