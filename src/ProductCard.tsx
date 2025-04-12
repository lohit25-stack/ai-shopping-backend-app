type ProductProps = {
    name: string;
    amazonPrice: string;
    flipkartPrice: string;
    bestCard: string;
    image?: string;
    category?: string;
    amazonLink?: string;
    flipkartLink?: string;
  };

export default function ProductCard({
  name,
  amazonPrice,
  flipkartPrice,
  bestCard,
  image,
  category,
  amazonLink,
  flipkartLink,
}: ProductProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-2 w-80">
      {image && (
        <img
          src={image}
          alt={name}
          className="w-full h-40 object-cover rounded"
        />
      )}
      {category && (
        <div className="text-xs text-white bg-blue-600 inline-block px-2 py-1 rounded-full">
          {category}
        </div>
      )}
      <div className="text-lg font-semibold">📱 {name}</div>
      <div>🛒 Amazon: {amazonPrice}</div>
      <div>🏷️ Flipkart: {flipkartPrice}</div>
      <div>💳 Best Card: {bestCard}</div>
      <div className="flex justify-between pt-4">
        <a
          href={amazonLink}
          className="text-sm bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600"
          target="_blank"
          rel="noopener noreferrer"
        >
          View on Amazon
        </a>
        <a
          href={flipkartLink}
          className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
          target="_blank"
          rel="noopener noreferrer"
        >
          View on Flipkart
        </a>
      </div>
    </div>
  );
}
