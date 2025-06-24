import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

type SearchBarProps = {
  search: string;
  setSearch: (value: string) => void;
};

export function SearchBar({ search = "", setSearch }: SearchBarProps) {
  const [internalValue, setInternalValue] = useState(search);

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearch(internalValue);
    }, 300);

    return () => {
      clearTimeout(handler); // Cleanup on each change
    };
  }, [internalValue, setSearch]);

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
      <Input
        value={internalValue}
        onChange={(e) => setInternalValue(e.currentTarget.value)}
        type="search"
        placeholder="Find best blogs, search keywords, topics and hashtags"
        className="pl-10 h-12 font-semibold bg-gray-50"
      />
    </div>
  );
}
