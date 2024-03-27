"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { api } from "~/trpc/react";

export function CreateTodo() {
  const router = useRouter();
  const [text, setText] = useState("");

  const createTodo = api.todo.create.useMutation({
    onSuccess: () => {
      router.refresh();
      setText("");
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        createTodo.mutate({ text });
      }}
      className="flex flex-col w-full max-w-xl p-5 border shadow-md gap-2 rounded-xl"
    >
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write text..."
        className="w-full p-2 border rounded-xl"
      />

      <button
        type="submit"
        className="btn"
        disabled={!text?.trim() || createTodo.isLoading}
      >
        {createTodo.isLoading ? "..." : "Submit"}
      </button>
    </form>
  );
}
