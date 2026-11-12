export const metadata = { title: "Books" };

const read = [
  { title: "The Brothers Karamazov", author: "Fyodor Dostoevsky" },
  { title: "The Idiot", author: "Fyodor Dostoevsky" },
  { title: "Crime and Punishment", author: "Fyodor Dostoevsky" },
  { title: "Notes from Underground", author: "Fyodor Dostoevsky" },
  { title: "Demons", author: "Fyodor Dostoevsky" },
  { title: "The Insulted and Humiliated", author: "Fyodor Dostoevsky" },
  { title: "White Nights", author: "Fyodor Dostoevsky" },
  { title: "Anna Karenina", author: "Leo Tolstoy" },
];

export default function BooksPage() {
  return (
    <main className="site-shell editorial">
      <p className="eyebrow">Reading</p>
      <h1>Books</h1>
      <p className="intro">A record of what I&apos;ve read and what I&apos;m reading now.</p>

      <section className="editorial-section">
        <h2>Currently reading</h2>
        <div className="item-list">
          <article>
            <h3>The Count of Monte Cristo</h3>
            <p>Alexandre Dumas</p>
          </article>
        </div>
      </section>

      <section className="editorial-section">
        <h2>Read</h2>
        <div className="item-list">
          {read.map((book) => (
            <article key={book.title}>
              <h3>{book.title}</h3>
              <p>{book.author}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
