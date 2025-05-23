"use client";

import { useParams } from "next/navigation";

export default function FundraiserDetailPage() {
  const { fundraiserId } = useParams<{ fundraiserId: string }>();

  if (!fundraiserId) {
    return <div>Loading fundraiser details...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Fundraiser Details Page</h1>
      <p className="text-lg">
        Displaying details for fundraiser with ID:{" "}
        <strong>{fundraiserId}</strong>
      </p>
      <p className="mt-4">
        (This is a placeholder. We will build out the full design and data
        fetching for this page next.)
      </p>
    </div>
  );
}
