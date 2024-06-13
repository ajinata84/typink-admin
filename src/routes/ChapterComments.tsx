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
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { getApiURL } from "@/util/constants";
import { ChapterComment } from "@/util/interface";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

export default function ChapterComments() {
  const [search, setSearch] = useState("");
  const [forums, setForums] = useState<ChapterComment[]>([]);
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [alertOpen, setAlertOpen] = useState(0);

  const token = Cookies.get("token");

  const fetchData = async () => {
    try {
      const forumResponse = await axios.get(
        `${getApiURL()}/chapter/search-comment?query=${debouncedSearch}`
      );
      setForums(forumResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${getApiURL()}/admin/chapter-comment`, {
        data: { id },
        headers: { Authorization: `Bearer ${token}` },
      });
      toast({
        title: "chapter comment deleted",
        description: "The chapter comment has been successfully deleted.",
      });
      fetchData();
      setAlertOpen(0);
    } catch (error) {
      console.error("Error deleting chapter comment:", error);
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
      <h1 className="text-3xl font-semibold mb-6">Chapter Comment</h1>
      <span>Search</span>
      <Input
        placeholder="Search User, content, parent chapter title min. 4 characters"
        onChange={(e) => setSearch(e.target.value)}
      />
      <Table>
        <TableCaption>Forum Data</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">id</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Content</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Parent Chapter</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {forums.map((forum) => (
            <TableRow key={forum.chapterCommentId}>
              <TableCell className="font-medium">
                {forum.chapterCommentId}
              </TableCell>
              <TableCell>{forum.users.username}</TableCell>
              <TableCell>{forum.content}</TableCell>
              <TableCell>
                {new Date(forum.created_at).toLocaleString()}
              </TableCell>
              <TableCell>{forum.chapters.chapterTitle}</TableCell>

              <TableCell>
                <Button
                  variant={"destructive"}
                  onClick={() => setAlertOpen(forum.chapterCommentId)}
                >
                  Delete
                </Button>
              </TableCell>
              <AlertDialog open={forum.chapterCommentId === alertOpen}>
                <AlertDialogTrigger asChild></AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      the comment.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setAlertOpen(0)}>
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDelete(forum.chapterCommentId)}
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
