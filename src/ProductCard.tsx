type ProductProps = {
  product: {
    name: string;
    price: number;
    site: string;
  };
};

export default function ProductCard({ product }: ProductProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-2 w-80">
      <div className="text-lg font-semibold">📱 {product.name}</div>
      <div>💰 Price: ₹{product.price}</div>
      <div>🛍️ Platform: {product.site}</div>
    </div>
  );
}
