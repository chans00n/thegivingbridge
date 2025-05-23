"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface ActivityItem {
  id: string;
  type: "donation" | "comment"; // Extendable in the future
  userName: string;
  userAvatarUrl?: string;
  amount?: number; // Specific to donations
  message?: string; // For comments or donation messages
  timestamp: string; // Simple string for now, e.g., "2 hours ago"
}

interface CampaignActivityFeedProps {
  activities: ActivityItem[];
  title?: string;
  itemsPerPage?: number;
}

const getInitials = (name: string) => {
  const names = name.split(" ");
  if (names.length === 1) return names[0][0]?.toUpperCase() || "A";
  return (
    (names[0][0]?.toUpperCase() || "") +
    (names[names.length - 1][0]?.toUpperCase() || "")
  );
};

export const CampaignActivityFeed: React.FC<CampaignActivityFeedProps> = ({
  activities,
  title = "Recent Activity",
  itemsPerPage = 5,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  if (!activities || activities.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No recent activity to display.
          </p>
        </CardContent>
      </Card>
    );
  }

  const totalPages = Math.ceil(activities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentActivities = activities.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    const halfMaxPages = Math.floor(maxPagesToShow / 2);

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= halfMaxPages) {
        for (let i = 1; i <= maxPagesToShow - 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("ellipsis-end");
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - halfMaxPages + 1) {
        pageNumbers.push(1);
        pageNumbers.push("ellipsis-start");
        for (let i = totalPages - maxPagesToShow + 2; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push("ellipsis-start");
        for (
          let i = currentPage - halfMaxPages + 2;
          i <= currentPage + halfMaxPages - 2;
          i++
        ) {
          if (i > 1 && i < totalPages) pageNumbers.push(i);
        }
        pageNumbers.push("ellipsis-end");
        pageNumbers.push(totalPages);
      }
    }
    return pageNumbers;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Donor</TableHead>
              <TableHead>Message</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentActivities.map((activity) => (
              <TableRow key={activity.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-9 w-9 border">
                      {activity.userAvatarUrl && (
                        <AvatarImage
                          src={activity.userAvatarUrl}
                          alt={activity.userName}
                        />
                      )}
                      <AvatarFallback>
                        {getInitials(activity.userName)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium truncate">
                      {activity.userName}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="max-w-xs truncate">
                  {activity.message || "-"}
                </TableCell>
                <TableCell className="text-right">
                  {activity.type === "donation" && activity.amount ? (
                    <span className="font-semibold text-green-600 dark:text-green-500">
                      ${activity.amount.toLocaleString()}
                    </span>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell className="text-right text-xs text-muted-foreground">
                  {activity.timestamp}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {totalPages > 1 && (
          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePreviousPage();
                  }}
                  aria-disabled={currentPage === 1}
                  className={
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>
              {getPageNumbers().map((page, index) => (
                <PaginationItem key={index}>
                  {typeof page === "string" ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(page);
                      }}
                      isActive={currentPage === page}
                    >
                      {page}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNextPage();
                  }}
                  aria-disabled={currentPage === totalPages}
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </CardContent>
    </Card>
  );
};
