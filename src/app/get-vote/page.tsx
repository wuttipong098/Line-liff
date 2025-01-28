'use client';
import { useEffect, useState } from 'react';
import { getVote } from '@/service';
import Image from 'next/image';
import PythonImage from '@/public/Python.png';
import JavaScriptImage from '@/public/JavaScript.png';
import JavaImage from '@/public/Java.png';
import PHPImage from '@/public/PHP.png';

const votingOptions = [
  { name: 'Python', image: PythonImage },
  { name: 'Javascript', image: JavaScriptImage },
  { name: 'Java', image: JavaImage },
  { name: 'PHP', image: PHPImage },
];;

export default function Vote() {
  const [votes, setVotes] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVotes() {
      try {
        const voteData = await getVote();

        // Ensure all options are represented, defaulting to 0 if not in voteData
        const completeVoteData = votingOptions.reduce((acc, option) => {
          acc[option.name] = voteData[option.name] || 0;
          return acc;
        }, {} as Record<string, number>);

        setVotes(completeVoteData);
      } catch (error) {
        console.error('Error fetching votes:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchVotes();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-screen text-xl">Loading...</div>;

  // Calculate the total number of votes
  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Vote Results</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {votingOptions.map((option) => {
          const voteCount = votes[option.name] || 0;

          return (
            <div
              key={option.name}
              className="bg-white shadow-md rounded-2xl p-4 flex flex-col items-center space-y-4"
            >
              <Image src={option.image} alt={option.name} width={100} height={100} className="rounded-full" />
              <h2 className="text-xl font-semibold text-gray-700">{option.name}</h2>
              <p className="text-sm text-gray-600">
                vote: {voteCount}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
