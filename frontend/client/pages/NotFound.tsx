import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-black text-white">
      <div className="text-center">
        <h1 className="text-5xl font-extrabold mb-4">404</h1>
        <p className="text-lg text-white/60 mb-6">Page not found</p>
        <Link to="/" className="inline-block rounded-lg px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10">Return Home</Link>
      </div>
    </div>
  );
};

export default NotFound;
