"use client";

import TotalStat from "@/components/cards/Dashboard/TotalStat";
import ParentStatCard from "@/components/cards/Dashboard/ParentStatCard";
import RecentJoinedEmployees from "@/components/cards/Dashboard/RecentJoinedEmployees";
import DepartmentChart from "@/components/cards/Dashboard/DepartmentChart";
import UpcomingBirthdays from "@/components/cards/Dashboard/UpcomingBirthdays";


export default function Dashboard() {
  const role = localStorage.getItem("role");

  return (
    <div className="items-center px-8 py-4">
      <h1 className="text-black font-extrabold text-2xl dark:text-white">
        Hello {role},
      </h1>
      <h6 className="text-gray-700 dark:text-gray-100 mt-1.5 font-medium">
        We hope you're having a great day.
      </h6>

      <div className="lg:flex flex-row lg:py-5 justify-between gap-5 ">
        <ParentStatCard />
        <div className="my-5 lg:my-0 w-full md:flex">
          <TotalStat />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div>
          <DepartmentChart />
        </div>
        <div>
          <RecentJoinedEmployees />
        </div>
        <div>
          <UpcomingBirthdays />
        </div>
      </div>
    </div>
  );
}
