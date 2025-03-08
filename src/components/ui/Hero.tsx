import Link from "next/link";

export default function Hero() {
  return (
    <div className="hero bg-base-200 py-12">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Tech Details Shop</h1>
          <p className="py-6">
            Your one-stop shop for high-quality phone parts and accessories. 
            We offer genuine replacement parts for all major brands.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/category/screens" className="btn btn-primary">Browse Screens</Link>
            <Link href="/category/batteries" className="btn btn-secondary">Browse Batteries</Link>
          </div>
        </div>
      </div>
    </div>
  );
}