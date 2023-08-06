import Link from "next/link";
import { prisma } from "./db";
import { z } from "zod";
import { TodoItem } from "./_components/TodoItem";

async function toggleTodo(id: string, complete: boolean) {
  "use server";
  console.log(id, complete);
  const toggleTodoSchema = z.object({
    id: z.string(),
    complete: z.boolean(),
  });
  const data = toggleTodoSchema.parse({ id, complete });
  await prisma.todo.update({
    where: { id: data.id },
    data: { complete: data.complete },
  });
}

export default async function Home() {
  const todos = await prisma.todo.findMany();
  // await prisma.todo.create({ data: { title: "test", complete: false } });
  console.log(todos);
  return (
    <>
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl">Todos</h1>
        <Link
          className="border border-slate-300 text-slate-300 px-2 py-1 rounded hover:bg-slate-700 focus-within:bg-slate-700 outline-none"
          href="/new"
        >
          New
        </Link>
      </header>
      <ul className="pl-4">
        {todos.map((todo) => (
          <TodoItem key={todo.id} {...todo} toggleTodo={toggleTodo} />
          // <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
    </>
  );
}
