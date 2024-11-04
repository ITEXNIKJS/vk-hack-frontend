import { ActionFunctionArgs, json } from "@remix-run/node";
import { chat_message_emitter } from "~/features/chat";
import db from "~/lib/db.server";
import axios from "axios";

interface ApiRequest {
  account_url: string;
  account_name: string;
  reps_url: string[];
}

export const action = async ({ request, params }: ActionFunctionArgs) => {
  try {
    const formData = await request.formData();
    const repositoriesStr = formData.get("repositories") as string;

    if (!repositoriesStr || !params.chat_id) {
      return json({ error: "No repositories selected" }, { status: 400 });
    }

    const repositories = repositoriesStr.split(",");
    const firstRepoUrl = repositories[0];
    const accountName = firstRepoUrl.split("/")[3];
    const accountUrl = `https://github.com/${accountName}`;

    const apiRequestBody: ApiRequest = {
      account_url: accountUrl,
      account_name: accountName,
      reps_url: repositories,
    };

    let message = await db.messages.create({
      data: {
        chat_id: params.chat_id,
        message: `Начат анализ репозиториев пользователя ${accountName}. 
                 Количество репозиториев: ${repositories.length}`,
        sender: "AI",
        type: "TEXT",
      },
    });

    chat_message_emitter.emit("message", message);

    // Используем axios вместо fetch
    const response = await axios.post(
      `${process.env.EXTERNAL_API_URL}/rep`,
      apiRequestBody, // axios автоматически сериализует объект в JSON
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Accept-Charset": "utf-8",
        },
      }
    );

    // axios автоматически проверяет статус и парсит JSON
    const result = response.data;

    function formatAssessmentMessage(data: {
      soft_skills: { [s: string]: unknown } | ArrayLike<unknown>;
      skills: { [s: string]: unknown } | ArrayLike<unknown>;
      grade: any;
      final: any;
    }) {
      // Format soft skills section
      const softSkillsSection = Object.entries(data.soft_skills)
        .map(([skill, value]) => `${skill}: ${(value as number).toFixed(0)}`)
        .join("\n");

      // Format skills section
      const skillsSection = Object.entries(data.skills)
        .map(([category, skills]) => `${category}: ${skills}`)
        .join("\n");

      // Compose the final message
      const message = `Грейд: ${data.grade}
    
    Софт скиллы:
    ${softSkillsSection}
    
    Технические навыки:
    ${skillsSection}
    
    ${data.final}`;

      return message;
    }

    // Usage example:
    const formattedMessage = formatAssessmentMessage(result);

    // Updated database query
    message = await db.messages.create({
      data: {
        chat_id: params.chat_id,
        message: formattedMessage,
        sender: "AI",
        type: "TEXT",
      },
    });

    chat_message_emitter.emit("message", message);

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error in action:", error);

    // Более детальная обработка ошибок axios
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const errorMessage =
        error.response?.data?.error ||
        "Произошла ошибка при анализе репозиториев. Пожалуйста, попробуйте позже.";

      return json({ error: errorMessage }, { status });
    }

    return json(
      {
        error:
          "Произошла ошибка при анализе репозиториев. Пожалуйста, попробуйте позже.",
      },
      { status: 500 }
    );
  }
};
