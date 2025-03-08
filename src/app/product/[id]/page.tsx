import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductDetail from '@/components/product/ProductDetail';
import { getProductById } from '@/lib/data/productData';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';

type Props = {
  params: { id: string }
};

// Generate metadata for the page
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Await params before accessing its properties
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const product = await getProductById(id);
  
  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The requested product could not be found'
    };
  }
  
  return {
    title: `${product.name} - Tech Details Shop`,
    description: product.description.substring(0, 160),
    openGraph: {
      title: product.name,
      description: product.description.substring(0, 160),
      images: [
        {
          url: product.images[0] || 'https://placehold.co/800x800/e9ecef/495057?text=No+Image',
          width: 800,
          height: 800,
          alt: product.name,
        }
      ],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  // Await params before accessing its properties
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const product = await getProductById(id);
  
  if (!product) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main>
        <ProductDetail product={product} />
      </main>
      <Footer />
    </>
  );
}