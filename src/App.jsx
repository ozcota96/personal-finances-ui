import { BrowserRouter, Routes } from "react-router-dom";
import "./App.css";

function Header() {
  return (
    <header>
      <h1>Personal Finances</h1>
    </header>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
    // <div>
    //   <Header />
    //   <main>
    //     <h2>Welcome to Personal Finances App</h2>
    //   </main>
    // </div>
  );
}

export default App;
