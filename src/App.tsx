import { useState, useEffect, useRef } from "react";
import ProductCard from "./ProductCard";
import './index.css'; // Ensure to import the CSS file

type Product = {
  name: string;
  amazonPrice: string;
  flipkartPrice: string;
  bestCard: string;
  image?: string;
  category?: string;
  amazonLink?: string;
  flipkartLink?: string;
};

type ChatMessage =
  | { sender: "user"; text: string }
  | { sender: "bot"; text?: string; product?: Product };

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem("chatHistory");
    return saved ? JSON.parse(saved) : [
      { sender: "user", text: "Find best deal for iPhone 13" },
      { sender: "bot", text: "🛒 Amazon: ₹55,000 | Flipkart: ₹54,200" },
    ];
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [platformFilter, setPlatformFilter] = useState<"all" | "amazon" | "flipkart">("all");
  const [sortBy, setSortBy] = useState<"priceAsc" | "priceDesc" | "none">("none");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(messages));
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const userInput = input.trim();
    setMessages([...messages, { sender: "user", text: userInput }]);
    setInput("");
    setLoading(true);

    fetch(`http://localhost:4000/search?q=${encodeURIComponent(userInput)}`)
      .then(response => response.json())
      .then(data => {
        if (data.length > 0) {
          setMessages((prev) => [
            ...prev,
            ...data.map((product: Product): ChatMessage => ({
              sender: "bot",
              product,
            })),
          ]);
        } else {
          setMessages((prev) => [
            ...prev,
            { sender: "bot", text: "🔍 No products found." },
          ]);
        }
      })
      .catch(() => {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "🔍 Unable to fetch results." },
        ]);
      })
      .finally(() => setLoading(false));
  };

  const filteredProducts = messages
    .filter((msg): msg is { sender: "bot"; product: Product } => msg.sender === "bot" && !!msg.product)
    .map((msg) => msg.product);

  const platformFiltered = filteredProducts.filter((product) => {
    if (platformFilter === "amazon") return !!product.amazonPrice;
    if (platformFilter === "flipkart") return !!product.flipkartPrice;
    return true;
  });

  const sortedProducts = [...platformFiltered].sort((a, b) => {
    const getPrice = (p: Product) => {
      const priceStr = (platformFilter === "flipkart" ? p.flipkartPrice : p.amazonPrice).replace(/[₹,]/g, '');
      return parseInt(priceStr);
    };
    if (sortBy === "priceAsc") return getPrice(a) - getPrice(b);
    if (sortBy === "priceDesc") return getPrice(b) - getPrice(a);
    return 0;
  });

  return (
    <div className={`flex flex-col h-screen max-w-screen-md mx-auto w-full font-sans border shadow-sm transition-colors duration-300 ${
      darkMode ? "bg-gray-900 text-white border-gray-700" : "bg-gradient-to-br from-gray-100 via-white to-gray-200 text-gray-900 border-gray-200"
    }`}>
      <div className="flex justify-end mb-2 px-2 sm:px-4">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="text-xs border px-3 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-2 sm:px-4 py-4 space-y-2">
        <div className="space-y-2">
          {messages.some((m) => m.sender === "bot" && m.product) ? (
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-4 text-sm">
                <span className="font-semibold">Filter:</span>
                <button onClick={() => setPlatformFilter("all")} className={`px-3 py-1 rounded border ${platformFilter === "all" ? "bg-blue-100 text-blue-700 border-blue-500" : "bg-white"}`}>All</button>
                <button onClick={() => setPlatformFilter("amazon")} className={`px-3 py-1 rounded border ${platformFilter === "amazon" ? "bg-blue-100 text-blue-700 border-blue-500" : "bg-white"}`}>Amazon</button>
                <button onClick={() => setPlatformFilter("flipkart")} className={`px-3 py-1 rounded border ${platformFilter === "flipkart" ? "bg-blue-100 text-blue-700 border-blue-500" : "bg-white"}`}>Flipkart</button>

                <span className="ml-4 font-semibold">Sort:</span>
                <button onClick={() => setSortBy("priceAsc")} className={`px-3 py-1 rounded border ${sortBy === "priceAsc" ? "bg-green-100 text-green-700 border-green-500" : "bg-white"}`}>Price ↑</button>
                <button onClick={() => setSortBy("priceDesc")} className={`px-3 py-1 rounded border ${sortBy === "priceDesc" ? "bg-green-100 text-green-700 border-green-500" : "bg-white"}`}>Price ↓</button>
              </div>
              {loading ? (
                <div className="flex justify-center items-center h-32 text-gray-500 text-sm italic">
                  Fetching the best deals...
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                  {sortedProducts.map((product, i) => (
                    <ProductCard
                      key={i}
                      name={product.name}
                      amazonPrice={product.amazonPrice}
                      flipkartPrice={product.flipkartPrice}
                      bestCard={product.bestCard}
                      image={product.image}
                      category={product.category}
                      amazonLink={product.amazonLink}
                      flipkartLink={product.flipkartLink}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : null}
          {messages.map((msg, index) =>
            msg.sender !== "bot" || !("product" in msg) ? (
              <div className={`max-w-xs sm:max-w-md ${msg.sender === "user" ? "self-end ml-auto" : "self-start mr-auto"}`}>
                <div className="flex items-start gap-2">
                  {msg.sender === "bot" && (
                    <div className="text-2xl pt-1">🤖</div>
                  )}
                  <div
                    className={`px-4 py-2 rounded-xl shadow-sm text-sm whitespace-pre-wrap font-medium ${
                      msg.sender === "user"
                        ? "bg-blue-600 text-white rounded-br-none font-semibold"
                        : "bg-white text-gray-800 rounded-bl-none border font-medium"
                    }`}
                  >
                    {msg.text}
                    <div className="text-[10px] text-gray-400 mt-1 text-right">
                      {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
                {msg.sender === "user" && (
                  <div className="text-xs mt-1 text-right text-gray-400">👍 ❤️ 😂</div>
                )}
              </div>
            ) : null
          )}
          {loading && (
            <div className="text-gray-500 text-sm italic ml-2">Bot is typing...</div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="border-t p-4">
        <div className="flex flex-col sm:flex-row gap-2 w-full items-center">
          <button
            className={`text-blue-600 border border-blue-600 px-3 py-2 rounded-md hover:bg-blue-50 transition-colors text-sm ${listening ? "bg-blue-100" : ""}`}
            onClick={() => {
              const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
              if (!SpeechRecognition) {
                alert("Voice recognition not supported");
                return;
              }
              const recognition = new SpeechRecognition();
              recognition.lang = "en-US";
              recognition.start();
              setListening(true);
              recognition.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setInput(transcript);
                setListening(false);
                setTimeout(() => {
                  setInput("");
                  setMessages((prev) => [...prev, { sender: "user", text: transcript }]);
                  setLoading(true);
                  fetch(`http://localhost:4000/search?q=${encodeURIComponent(transcript)}`)
                    .then(response => response.json())
                    .then(data => {
                      if (data.length > 0) {
                        setMessages((prev) => [
                          ...prev,
                          ...data.map((product: Product): ChatMessage => ({
                            sender: "bot",
                            product,
                          })),
                        ]);
                      } else {
                        setMessages((prev) => [
                          ...prev,
                          { sender: "bot", text: "🔍 No products found." },
                        ]);
                      }
                    })
                    .catch(() => {
                      setMessages((prev) => [
                        ...prev,
                        { sender: "bot", text: "🔍 Unable to fetch results." },
                      ]);
                    })
                    .finally(() => setLoading(false));
                }, 0);
              };
              recognition.onerror = () => setListening(false);
            }}
          >
            🎤
          </button>
          <input
            className="flex-1 px-4 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
            type="text"
            placeholder="Ask me something..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-r-md transition-colors"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
