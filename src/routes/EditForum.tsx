import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Layout from "@/components/Layout/Layout";
import { Textarea } from "@/components/ui/textarea";
import { Forward } from "lucide-react";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "@/components/ui/use-toast";
import { getApiURL } from "@/util/constants";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ForumData } from "@/util/interface";

type FormData = {
  title: string;
  content: string;
  tag?: string;
};

interface createResponse {
  forumId: number;
  created_at: Date;
  userId: string;
  title: string;
  content: string;
  genreId: number;
  forumType: string;
  voteCount: number;
}

export default function EditForum() {
  const navigate = useNavigate();
  const { forumId } = useParams<{ forumId: string }>();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset } = useForm<FormData>();

  const fetchForumData = async () => {
    try {
      const response = await axios.get<ForumData>(
        `${getApiURL()}/forum/id/${forumId}`
      );
      reset({
        title: response.data.title,
        content: response.data.content,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load chapter data.",
      });
    }
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const token = Cookies.get("token");

    if (!token) {
      toast({
        title: "Authentication Error",
        description: "Please log in to create a discussion.",
      });
      return;
    }

    try {
      setLoading(true);
      const response = await axios.put<createResponse>(
        `${getApiURL()}/admin/forum`,
        {
          forumId: forumId,
          title: data.title,
          content: data.content,
          genreId: 1,
          forumType: "Announcement",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast({
        title: "Discussion Updated",
        description: "Your discussion has been successfully Updated.",
      });
      setLoading(false);

      setTimeout(() => {
        navigate(`/announcements`);
      }, 1000);
    } catch (error) {
      toast({
        title: "Error",
        description:
          "There was an error creating the discussion. Please try again.",
      });
      console.error("Error creating discussion:", error);
    }
  };

  useEffect(() => {
    fetchForumData();
  }, []);

  return (
    <Layout>
      <div className="flex flex-col justify-center gap-8 items-center">
        <h1 className="text-3xl font-semibold text-center">
          Edit Announcement
        </h1>
        <form className="w-full " onSubmit={handleSubmit(onSubmit)}>
          <Input
            {...register("title", { required: true })}
            placeholder="Title"
            className="h-14 text-xl mb-4"
          />
          <Textarea
            {...register("content", { required: true })}
            className="min-h-48 mb-4"
            placeholder="Content"
          />
          <div className="flex flex-row w-full justify-between h-24">
            <Button type="submit" disabled={loading}>
              {loading ? (
                <div className="spinner-border animate-spin inline-block w-4 h-4 border-4 rounded-full border-t-transparent border-white"></div>
              ) : (
                "Submit"
              )}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
