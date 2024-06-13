import Layout from "@/components/Layout/Layout";
import { getApiURL } from "@/util/constants";
import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface author {
  username: string;
  totalDonations: number;
}

export default function Home() {
  const [totalAuthor, setTotalAuthor] = useState(0);
  const [authors, setAuthors] = useState<author[]>([]);
  const [loading, setLoading] = useState(true);

  const token = Cookies.get("token");

  useEffect(() => {

    async function fetchData() {
      try {
        const response = await axios.get<{ totalUsers: number }>(
          `${getApiURL()}/admin/total-author`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTotalAuthor(response.data.totalUsers);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    async function fetchAuthors() {
      try {
        const response = await axios.get<author[]>(
          `${getApiURL()}/admin/authors/most-donated`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setAuthors(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAuthors();

    fetchData();
  }, []);

  return (
    <Layout>
      <div className="w-full">
        <h1 className="mb-4">Total author: {totalAuthor}</h1>
        <div>
          <h1 className="font-bold text-3xl">Top Earning:</h1>
          {authors.map((v, i) => (
            <div className="mb-4 mt-4">
              <div className="text-2xl">
                {i + 1}. {v.username}
              </div>
              <span>
                Total Donation Rp. {v.totalDonations.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
