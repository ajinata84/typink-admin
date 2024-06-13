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
import { ForumComment } from "@/util/interface";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState, useCallback } from "react";

export default function ForumComments() {
  const [search, setSearch] = useState("");
  const [forums, setForums] = useState<ForumComment[]>([]);
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [alertOpen, setAlertOpen] = useState(0);

  const token = Cookies.get("token");

  const fetchData = async () => {
    try {
      const forumResponse = await axios.get(
        `${getApiURL()}/forum/search-comment?query=${debouncedSearch}`
      );
      setForums(forumResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${getApiURL()}/admin/forum-comment`, {
        data: { id },
        headers: { Authorization: `Bearer ${token}` },
      });
      toast({
        title: "Forum comment deleted",
        description: "The forum comment has been successfully deleted.",
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
      <h1 className="text-3xl font-semibold mb-6">Forum Comment</h1>

      <span>Search</span>
      <Input
        placeholder="Search comment, user, parent forum title min. 4 characters"
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
            <TableHead>Parent Forum Title</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {forums.map((forum) => (
            <TableRow key={forum.forumCommentId}>
              <TableCell className="font-medium">
                {forum.forumCommentId}
              </TableCell>
              <TableCell>{forum.users.username}</TableCell>
              <TableCell>{forum.content}</TableCell>
              <TableCell>
                {new Date(forum.created_at).toLocaleString()}
              </TableCell>
              <TableCell>{forum.forum.title}</TableCell>
              <TableCell>
                <Button
                  variant={"destructive"}
                  onClick={() => setAlertOpen(forum.forumCommentId)}
                >
                  Delete
                </Button>
              </TableCell>
              <AlertDialog open={forum.forumCommentId === alertOpen}>
                <AlertDialogTrigger asChild></AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      the forum comment.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setAlertOpen(0)}>
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDelete(forum.forumCommentId)}
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
