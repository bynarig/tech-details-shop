import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="card bg-base-100 shadow-xl h-full">
      <figure className="px-4 pt-4 relative h-48">
        {/* Using a placeholder image if the product image isn't available */}
        <div className="relative w-full h-full">
          <Image 
            src={product.image || "https://placehold.co/400x300?text=No+Image"} 
            alt={product.name}
            fill
            className="object-cover rounded-xl"
          />
        </div>
        {!product.inStock && (
          <div className="absolute top-2 right-2 badge badge-error text-white">Out of Stock</div>
        )}
      </figure>
      <div className="card-body">
        <h2 className="card-title text-lg">{product.name}</h2>
        <div className="flex items-center mb-2">
          <div className="rating rating-sm">
            {[...Array(5)].map((_, i) => (
              <input 
                key={i} 
                type="radio" 
                name={`rating-${product.id}`} 
                className={`mask mask-star-2 ${i < Math.floor(product.rating) ? 'bg-orange-400' : 'bg-gray-300'}`} 
                disabled 
                checked={i + 1 === Math.round(product.rating)}
              />
            ))}
          </div>
          <span className="text-xs ml-2">({product.rating})</span>
        </div>
        <p className="text-sm line-clamp-2">{product.description}</p>
        <div className="card-actions justify-between items-center mt-4">
          <span className="text-xl font-bold">${product.price.toFixed(2)}</span>
          <Link href={`/product/${product.id}`} className="btn btn-primary btn-sm">View Details</Link>
        </div>
      </div>
    </div>
  );
}