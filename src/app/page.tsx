import { revalidatePath } from "next/cache";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import { CreateTodo } from "./_components/create-todo";

async function TodoList() {
  const todos = await api.todo.getMyTodos();

  async function deleteTodo(id: string) {
    "use server";
    await api.todo.delete({ id });
    revalidatePath("/");
  }

  return todos.map((todo) => (
    <div
      key={todo.id}
      className="flex w-full max-w-xl flex-col rounded-xl border p-5 shadow-md"
    >
      <div className="text">{todo.text}</div>
      <div className="created flex w-full items-center justify-end gap-1">
        <div className="text-xs">
          {new Date(todo.createdAt).toLocaleString("it")}
        </div>
        <form action={deleteTodo.bind(null, todo.id)}>
          <button type="submit" className="btn btn-sm">
            Done
          </button>
        </form>
      </div>
    </div>
  ));
}
export default async function Home() {
  const session = await getServerAuthSession();

  return (
    <main className="flex min-h-screen flex-col items-center justify-start gap-5 p-5 pt-20">
      {session?.user === undefined && (
        <div className="text-xl">Login required</div>
      )}

      {session?.user !== undefined && (
        <>
          <CreateTodo />
          <TodoList />
        </>
      )}
    </main>
  );
}
