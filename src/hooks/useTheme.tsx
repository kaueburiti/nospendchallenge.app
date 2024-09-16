import {useContext} from "react";
import {ThemeContext} from "@/provider/ThemeProvider";


export const useTheme = () => useContext(ThemeContext);

