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
        
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border-gray-200 shadow-md rounded-md">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-300">
                <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase">Username</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase">Total Donations</th>
              </tr>
            </thead>
            <tbody>
              {authors.map((author, index) => (
                <tr key={author.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{author.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black">Rp. {author.totalDonations.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
  
      </div>
    </Layout>
  );
  
}
