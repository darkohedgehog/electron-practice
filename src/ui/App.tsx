import { ThemeProvider } from "@/ui/components/theme-provider";
import { HashRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import "./index.css";
import About from "./about/About";
import Home from "./home/Home";
import Library from "./library/Library";
import Upload from "./upload/Upload";
import BookDetails from "./library/BookDetails";
import ManageBooks from "./manage/ManageBooks";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <HashRouter>
        <Layout>
          <Routes>
            <Route index element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/library" element={<Library />} />
            <Route path="/library/:id" element={<BookDetails />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/manage" element={<ManageBooks />} />
          </Routes>
        </Layout>
      </HashRouter>
    </ThemeProvider>
  );
}

export default App;
