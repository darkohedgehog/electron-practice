import { ThemeProvider } from "@/ui/components/theme-provider";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import "./index.css";
import About from "./about/About";
import Home from "./home/Home";
import Library from "./library/Library";
import Upload from "./upload/Upload";
import BookDetails from "./library/BookDetails";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/library" element={<Library />} />
            <Route path="/library/:id" element={<BookDetails />} />
            <Route path="/upload" element={<Upload />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
