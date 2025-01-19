import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "./types";
import { EditorDto } from "@webcraft/types";

/**
 * Hook to get the editor state from the server
 */
export const useGetEditor = (id: string) => {
  const getEditorQuery = useQuery<EditorDto>({
    queryKey: ["editor", id],
    queryFn: async () => {
      const { data } = await axios.get<EditorDto>(`${API_URL}/editors/${id}`);
      return data;
    },
  });

  return getEditorQuery;
};
