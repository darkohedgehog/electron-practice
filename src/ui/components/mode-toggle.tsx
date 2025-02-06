// mode-toggle.tsx
import { Moon, Sun } from "lucide-react";
import { Button } from "@/ui/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/ui/components/ui/dropdown-menu";
import { useTheme } from "@/ui/components/theme-provider";

export function ModeToggle() {
  const { theme, setTheme } = useTheme(); // dodajemo i trenutnu temu radi debaga

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="ml-14">
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => { 
          console.log("Setting theme to light. Current theme:", theme);
          setTheme("light");
        }}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => {
          console.log("Setting theme to dark. Current theme:", theme);
          setTheme("dark");
        }}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => {
          console.log("Setting theme to system. Current theme:", theme);
          setTheme("system");
        }}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
