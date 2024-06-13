import Layout from "@/components/Layout/Layout";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { getApiURL } from "@/util/constants";
import { Chapter, ForumData } from "@/util/interface";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState, useCallback } from "react";

interface ChapterResponse {
  chapterId: number;
  chapterTitle: string;
  created_at: Date;
  literature: {
    title: string;
    users: {
      username: string;
    };
  };
  content: string;
}

export default function ChapterPage() {
  const [search, setSearch] = useState("");
  const [forums, setForums] = useState<ChapterResponse[]>([]);
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [alertOpen, setAlertOpen] = useState(0);

  const token = Cookies.get("token");

  const fetchData = async () => {
    try {
      const forumResponse = await axios.get(
        `${getApiURL()}/chapter/search?query=${debouncedSearch}`
      );
      setForums(forumResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${getApiURL()}/admin/chapter`, {
        data: { id },
        headers: { Authorization: `Bearer ${token}` },
      });
      toast({
        title: "Chapter deleted",
        description: "The chapter has been successfully deleted.",
      });
      fetchData();
      setAlertOpen(0);
    } catch (error) {
      console.error("Error deleting chapter:", error);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500); // Delay of 500ms

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  useEffect(() => {
    if (debouncedSearch.length >= 4) {
      fetchData();
    }
  }, [debouncedSearch]);

  return (
    <Layout>
      <h1 className="text-3xl font-semibold mb-6">Chapter</h1>

      <span>Search</span>
      <Input
        placeholder="Search Chapter title, Author, Parent Literature Title, Content min. 4 characters"
        onChange={(e) => setSearch(e.target.value)}
      />
      <Table className="overflow-x-scroll">
        <TableCaption>Forum Data</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Chapter Id</TableHead>
            <TableHead>LiteratureTitle</TableHead>
            <TableHead>Chapter Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {forums.map((forum) => (
            <TableRow key={forum.chapterId}>
              <TableCell className="font-medium">{forum.chapterId}</TableCell>
              <TableCell>{forum.literature.title}</TableCell>
              <TableCell>{forum.chapterTitle}</TableCell>
              <TableCell>{forum.literature.users.username}</TableCell>
              <TableCell>
                {new Date(forum.created_at).toLocaleString()}
              </TableCell>
              <TableCell>
                <Button
                  variant={"destructive"}
                  onClick={() => setAlertOpen(forum.chapterId)}
                >
                  Delete
                </Button>
              </TableCell>
              <AlertDialog open={forum.chapterId === alertOpen}>
                <AlertDialogTrigger asChild></AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      the chapter.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setAlertOpen(0)}>
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDelete(forum.chapterId)}
                    >
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Layout>
  );
}
