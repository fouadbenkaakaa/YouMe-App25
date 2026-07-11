import { useState } from "react";
import { BOOKS, CATEGORIES, Book } from "../data/BookData";

export default function BooksPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredBooks = BOOKS.filter((book: Book) => {
    const matchesSearch = 
      book.title.includes(search) || 
      book.author.includes(search);
    const matchesCategory = 
      selectedCategory === "all" || 
      book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="books-page" style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>📚 مكتبة YouMe</h1>

      {/* البحث */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="ابحث عن كتاب أو مؤلف..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ddd",
            fontSize: "16px"
          }}
        />
      </div>

      {/* التصنيفات */}
      <div style={{ 
        display: "flex", 
        gap: "10px", 
        marginBottom: "20px",
        flexWrap: "wrap"
      }}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            style={{
              padding: "8px 16px",
              borderRadius: "20px",
              border: "none",
              background: selectedCategory === cat.id ? "#4F46E5" : "#E5E7EB",
              color: selectedCategory === cat.id ? "white" : "#374151",
              cursor: "pointer"
            }}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* الكتب */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: "20px"
      }}>
        {filteredBooks.map((book) => (
          <div 
            key={book.id}
            style={{
              background: "white",
              borderRadius: "12px",
              padding: "16px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
            }}
          >
            <img 
              src={book.cover} 
              alt={book.title}
              style={{
                width: "100%",
                height: "200px",
                objectFit: "cover",
                borderRadius: "8px",
                marginBottom: "12px"
              }}
            />
            <h3 style={{ margin: "0 0 8px 0", fontSize: "16px" }}>{book.title}</h3>
            <p style={{ margin: "0 0 8px 0", color: "#666", fontSize: "14px" }}>
              ✍️ {book.author}
            </p>
            <span style={{
              background: "#EEF2FF",
              color: "#4F46E5",
              padding: "4px 12px",
              borderRadius: "12px",
              fontSize: "12px"
            }}>
              {book.category}
            </span>
            <p style={{ marginTop: "8px", fontSize: "12px", color: "#999" }}>
              📄 {book.pages} صفحة
            </p>
          </div>
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <p style={{ textAlign: "center", color: "#999", marginTop: "40px" }}>
          لا توجد نتائج للبحث
        </p>
      )}
    </div>
  );
}