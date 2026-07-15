import React from "react";
import Input from "@/components/shared/Input";
import { Search } from "lucide-react";

export default function SearchBar({
  placeholder = "Search roles, companies, locations...",
}) {
  return (
    <div className="relative max-w-2xl">
      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <Input className="pl-11 pr-4" placeholder={placeholder} />
    </div>
  );
}
