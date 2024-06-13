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
import { ForumData } from "@/util/interface";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

export default function Announcements() {
  const navigate = useNavigate();

  const [forums, setForums] = useState<ForumData[]>([]);
  const [alertOpen, setAlertOpen] = useState(0);

  const token = Cookies.get("token");

  const fetchData = async () => {
    try {
      const forumResponse = await axios.get(
        `${getApiURL()}/forum/announcements`
      );
      setForums(forumResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${getApiURL()}/admin/forum`, {
        data: { id },
        headers: { Authorization: `Bearer ${token}` },
      });
      toast({
        title: "Forum deleted",
        description: "The forum has been successfully deleted.",
      });
      fetchData();
      setAlertOpen(0);
    } catch (error) {
      console.error("Error deleting chapter:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Layout>
      <h1 className="text-3xl font-semibold mb-6">Announcements</h1>
      <Table>
        <TableCaption>Forum Data</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Forum Id</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Content</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {forums.map((forum) => (
            <TableRow key={forum.forumId}>
              <TableCell className="font-medium">{forum.forumId}</TableCell>
              <TableCell>{forum.title}</TableCell>
              <TableCell>{forum.content}</TableCell>
              <TableCell className="space-x-2">
                <Button
                  variant={"outline"}
                  onClick={() =>
                    navigate(`/edit-announcement/${forum.forumId}`)
                  }
                >
                  Edit
                </Button>
                <Button
                  variant={"destructive"}
                  onClick={() => setAlertOpen(forum.forumId)}
                >
                  Delete
                </Button>
              </TableCell>
              <AlertDialog open={forum.forumId === alertOpen}>
                <AlertDialogTrigger asChild></AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      the forum.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setAlertOpen(0)}>
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDelete(forum.forumId)}
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
