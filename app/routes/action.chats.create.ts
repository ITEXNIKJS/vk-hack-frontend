import { ActionFunctionArgs } from "@remix-run/node";
import db from "~/lib/db.server";

export function extractGithubUsername(url: string): string {
  // Поддерживаемые форматы URL:
  // https://github.com/username
  // https://github.com/username/
  // https://github.com/username/repo
  // http://github.com/username
  // github.com/username

  // Удаляем протокол, если он есть
  const withoutProtocol = url.replace(/^(https?:)?\/\//, "");

  // Проверяем, начинается ли URL с github.com
  if (!withoutProtocol.startsWith("github.com/")) {
    return "";
  }

  // Разбиваем оставшуюся часть URL по слешу
  const parts = withoutProtocol.split("/");

  // Username должен быть второй частью после github.com
  if (parts.length >= 2) {
    const username = parts[1].trim();

    // Проверяем, что username не пустой и соответствует правилам GitHub
    // GitHub username может содержать только буквы, цифры и дефисы
    // и не может начинаться с дефиса
    if (username && /^[a-zA-Z0-9][\w-]*$/.test(username)) {
      return username;
    }
  }

  return "";
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const git_url = formData.get("chatName") as string;

  if (!git_url) return { success: false };

  await db.chats.create({
    data: {
      github_url: git_url,
      username: extractGithubUsername(git_url),
    },
  });

  return { success: true };
}
