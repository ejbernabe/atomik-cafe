// src/App.tsx
import Navbar from './components/Navbar';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-200">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold">Welcome to my React App</h1>
      </main>
    </div>
  );
}