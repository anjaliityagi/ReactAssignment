// import { useState } from "react";
// import { createContext, useContext } from "react";

// type ThemeContextType = {
//   theme: string;
//   toggleTheme: () => void;
// };

// const ThemeContext = createContext<ThemeContextType | null>(null);

// export function ThemeProvider({ children }: { children: React.ReactNode }) {
//   let th = localStorage.getItem("theme") || "light";
//   if (th !== "dark" && th !== "light") {
//     th = "light";
//   }
//   const [theme, setTheme] = useState(th);

//   const toggleTheme = () => {
//     console.log("change");
//     setTheme((prev) => {
//       const newTheme = prev === "light" ? "dark" : "light";
//       localStorage.setItem("theme", newTheme);
//       return newTheme;
//     });
//   };

//   return (
//     <ThemeContext.Provider value={{ theme, toggleTheme }}>
//       <div className={`${theme} min-h-screen `}>{children}</div>
//     </ThemeContext.Provider>
//   );
// }

// export function useTheme(): ThemeContextType {
//   const c = useContext(ThemeContext);
//   if (!c) throw new Error("useTheme must be used inside Themeprovider");
//   return c;
// }
