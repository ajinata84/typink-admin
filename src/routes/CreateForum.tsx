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
import { useNavigate } from "react-router-dom";

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

export default function ForumCreate() {
  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm<FormData>();

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
      const response = await axios.post<createResponse>(
        `${getApiURL()}/admin/forum`,
        {
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
        title: "Discussion Created",
        description: "Your discussion has been successfully created.",
      });
      reset();

      setTimeout(() => {
        navigate(`/`);
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

  return (
    <Layout>
      <div className="flex flex-col justify-center gap-8 items-center">
        <h1 className="text-3xl font-semibold text-center">
          Create Announcement
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
           
            <Button type="submit" className="">
              Post
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
