import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "./types";
import { CreateEditorDto } from "@webcraft/types";
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
      editor: CreateEditorDto;
    }) => {
      console.log(editor);
      await axios.patch(`${API_URL}/editors/${id}`, editor);
    },
  });

  return saveEditorMutation;
};
