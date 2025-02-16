
import { MdOutlineLightMode, MdOutlineDarkMode, MdOutlineSystemSecurityUpdateGood } from "react-icons/md";
import { useTranslation } from 'react-i18next';
import { t } from 'i18next';

import { Button } from "@/ui/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/ui/components/ui/dropdown-menu"
import { useTheme } from "@/ui/components/theme-provider"

export function ModeToggle() {
  const { i18n } = useTranslation();
  const { theme, setTheme } = useTheme()

  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative rounded-full border-accent dark:border-accentDark dark:hover:bg-accentDark"
        >
          {isDark ? (
            <MdOutlineDarkMode className="h-[1.2rem] w-[1.2rem] text-slate-400" />
          ) : (
            <MdOutlineLightMode className="h-[1.2rem] w-[1.2rem] text-yellow-200" />
          )}
          <span className="sr-only">Toggle Theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          className="gap-1 flex text-accent dark:text-accentDark"
          onClick={() => setTheme("light")}
        >
          <MdOutlineLightMode /> {t('modeToggleLight')}
        </DropdownMenuItem>
        <DropdownMenuItem
          className="gap-1 flex text-accent dark:text-accentDark"
          onClick={() => setTheme("dark")}
        >
          <MdOutlineDarkMode /> {t('modeToggleDark')}
        </DropdownMenuItem>
        <DropdownMenuItem
          className="gap-1 flex text-accent dark:text-accentDark"
          onClick={() => setTheme("system")}
        >
          <MdOutlineSystemSecurityUpdateGood /> {t('modeToggleSystem')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
