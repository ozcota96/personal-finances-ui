import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import "./App.css";

// function Header() {
//   return (
//     <header>
//       <h1>Personal Finances</h1>
//     </header>
//   );
// }

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
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
