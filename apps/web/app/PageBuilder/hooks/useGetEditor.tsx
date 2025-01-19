import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_URL, Editor } from "./types";

/**
 * Hook to get the editor state from the server
 */
export const useGetEditor = (id: string) => {
  const getEditorQuery = useQuery<Editor>({
    queryKey: ["editor", id],
    queryFn: async () => {
      const { data } = await axios.get<Editor>(`${API_URL}/editors/${id}`);
      return data;
    },
  });

  return getEditorQuery;
};
