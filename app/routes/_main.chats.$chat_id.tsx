import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { Input } from "~/components/ui/input";
import { Send } from "lucide-react";
import { Checkbox } from "~/components/ui/checkbox";
import { Card, CardContent } from "~/components/ui/card";
import db from "~/lib/db.server";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { useEventSource } from "remix-utils/sse/react";
import { ScrollArea } from "~/components/ui/scroll-area";

// Типы для GitHub API
interface Repository {
  name: string;
  description: string;
  url: string;
  last_commit_date: string;
  commit_count: number;
  stars: number;
}

// Функция для получения репозиториев
async function getTopRepositories(username: string): Promise<Repository[]> {
  const headers = {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    "X-GitHub-Api-Version": "2022-11-28",
  };

  try {
    // Получаем список репозиториев
    const reposResponse = await fetch(
      `https://api.github.com/users/${username}/repos`,
      { headers }
    );

    if (!reposResponse.ok) return [];
    const repos = await reposResponse.json();

    // Фильтруем форки и получаем количество коммитов для каждого репозитория
    const nonForkRepos = repos.filter((repo: any) => !repo.fork);

    const reposWithCommits = await Promise.all(
      nonForkRepos.map(async (repo: any) => {
        const commitsResponse = await fetch(
          `https://api.github.com/repos/${username}/${repo.name}/commits?author=${username}&per_page=1`,
          { headers }
        );

        const link = commitsResponse.headers.get("Link") || "";
        const match = link.match(/page=(\d+)>; rel="last"/);
        const commitCount = match ? parseInt(match[1]) : 1;

        return {
          name: repo.name,
          description: repo.description || "Нет описания",
          url: repo.html_url,
          last_commit_date: repo.pushed_at,
          commit_count: commitCount,
          stars: repo.stargazers_count,
        };
      })
    );

    // Сортируем по количеству коммитов
    return reposWithCommits
      .sort((a, b) => b.commit_count - a.commit_count)
      .slice(0, 5);
  } catch (error) {
    console.error("Error fetching repositories:", error);
    return [];
  }
}

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const chat = await db.chats.findUnique({
    where: {
      id: params["chat_id"],
    },
    include: {
      messages: true,
    },
  });

  if (!chat) return redirect("/");

  const repositories = await getTopRepositories(chat.username);

  return { ...chat, repositories };
};

export default function ChatPage() {
  const data = useLoaderData<typeof loader>();

  const { repositories } = data;

  const [messages, setMessages] = useState<typeof data.messages>(data.messages);

  const [selectedRepos, setSelectedRepos] = useState<Set<string>>(new Set());

  const handleCheckboxChange = (url: string, checked: boolean) => {
    setSelectedRepos((prev) => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(url);
      } else {
        newSet.delete(url);
      }
      return newSet;
    });
  };

  const new_message = useEventSource(`/action/chats/${data.id}/subscribe`, {
    enabled: true,
    event: "new-message",
  });

  useEffect(() => {
    if (!new_message) return;

    const message_data: (typeof messages)[0] = JSON.parse(new_message);

    setMessages((data) => [...data, message_data]);
  }, [new_message]);

  return (
    <div className="flex border flex-col flex-grow bg-zinc-100 dark:bg-zinc-800/80 rounded-md pb-0">
      <div className="flex flex-col w-full flex-grow py-1 px-2">
        <ScrollArea className="h-[620px] pr-4">
          {data.messages.length === 0 ? (
            <div className="space-y-4 flex flex-grow flex-col">
              <span className="text-lg font-medium">
                Выберите репозитории для анализа
              </span>
              <Form
                className="flex flex-col justify-between flex-grow"
                method="post"
                navigate={false}
                action={`/action/chats/${data.id}/send`}
              >
                <input
                  type="hidden"
                  name="repositories"
                  value={Array.from(selectedRepos)}
                />
                <div className="space-y-4">
                  {repositories.map((repo) => (
                    <Card key={repo.name} className="p-4">
                      <CardContent className="p-0">
                        <div className="flex items-center space-x-4">
                          <Checkbox
                            id={repo.name}
                            checked={selectedRepos.has(repo.url)}
                            onCheckedChange={(checked) =>
                              handleCheckboxChange(repo.url, checked as boolean)
                            }
                          />
                          <div className="flex-1">
                            <label
                              htmlFor={repo.name}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {repo.name}
                            </label>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {repo.description}
                            </p>
                            <div className="mt-1 text-xs text-gray-500">
                              ⭐ {repo.stars} • 💻 {repo.commit_count} коммитов
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <div className="mt-4">
                  <Button
                    type="submit"
                    disabled={selectedRepos.size === 0}
                    className="w-full"
                  >
                    Анализировать выбранные репозитории
                  </Button>
                </div>
              </Form>
            </div>
          ) : (
            messages.map((message) => (
              <div className="mb-4 whitespace-pre-wrap" key={message.id}>
                <span>{message.message.replace(/^[ ]+/gm, "")}</span>
              </div>
            ))
          )}
        </ScrollArea>
      </div>
      {data.messages.length === 0 ? null : (
        <div className="flex flex-row items-center border-t rounded-t-none">
          <Input className="border-none rounded-t-none w-full" />
          <Send className="w-6 h-full aspect-square pr-2 cursor-pointer" />
        </div>
      )}
    </div>
  );
}
