import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { API_URL, Editor } from "./types";

/**
 * Hook to save the editor state using react-query mutation
 */
export const useSaveEditor = () => {
  const saveEditorMutation = useMutation({
    mutationFn: async ({
      id,
      editor,
    }: {
      id: string;
      editor: Omit<Editor, "id">;
    }) => {
      console.log(editor);
      await axios.patch(`${API_URL}/editors/${id}`, editor);
    },
  });

  return saveEditorMutation;
};
