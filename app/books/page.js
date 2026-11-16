export const metadata = { title: "Books" };

const russianClassics = [
  { title: "The Brothers Karamazov", author: "Fyodor Dostoevsky" },
  { title: "The Idiot", author: "Fyodor Dostoevsky" },
  { title: "Crime and Punishment", author: "Fyodor Dostoevsky" },
  { title: "Notes from Underground", author: "Fyodor Dostoevsky" },
  { title: "Demons", author: "Fyodor Dostoevsky" },
  { title: "The Insulted and Humiliated", author: "Fyodor Dostoevsky" },
  { title: "White Nights", author: "Fyodor Dostoevsky" },
  { title: "Anna Karenina", author: "Leo Tolstoy" },
];

const harryPotterBooks = [
  "Harry Potter and the Philosopher's Stone",
  "Harry Potter and the Chamber of Secrets",
  "Harry Potter and the Prisoner of Azkaban",
  "Harry Potter and the Goblet of Fire",
  "Harry Potter and the Order of the Phoenix",
  "Harry Potter and the Half-Blood Prince",
  "Harry Potter and the Deathly Hallows",
].map((title) => ({ title, author: "J. K. Rowling" }));

const contemporaryFiction = [
  { title: "Devil House", author: "John Darnielle" },
];

const nonfictionBooks = [
  { title: "Outliers: The Story of Success", author: "Malcolm Gladwell" },
  { title: "The Power of Now: A Guide to Spiritual Enlightenment", author: "Eckhart Tolle" },
  { title: "Digital Minimalism: Choosing a Focused Life in a Noisy World", author: "Cal Newport" },
  { title: "The Psychology of Money: Timeless Lessons on Wealth, Greed, and Happiness", author: "Morgan Housel" },
];

const technicalBooks = [
  { title: "The Recursive Book of Recursion", author: "Al Sweigart" },
  { title: "Kubernetes: Up and Running", author: "Kelsey Hightower, Brendan Burns, Joe Beda" },
  { title: "Learning Git", author: "Anna Skoulikari" },
];

function BookEntry({ title, author, tag }) {
  return (
    <article className="book-entry">
      <div className="book-entry-heading">
        <h3>{title}</h3>
        <span className="book-tag">{tag}</span>
      </div>
      <p>{author}</p>
    </article>
  );
}

export default function BooksPage() {
  return (
    <main className="site-shell editorial books-page">
      <p className="eyebrow">Personal library</p>
      <h1>Books</h1>
      <p className="intro">A collection of literature and ideas, from Russian classics to the technical books shaping how I think and build.</p>

      <section className="editorial-section">
        <div className="books-section-heading">
          <div><p className="eyebrow">On the nightstand</p><h2>Currently reading</h2></div>
          <span className="books-count">01 book</span>
        </div>
        <div className="item-list">
          <BookEntry title="The Count of Monte Cristo" author="Alexandre Dumas" tag="In progress" />
        </div>
      </section>

      <section className="editorial-section">
        <div className="books-section-heading">
          <div><p className="eyebrow">Literature</p><h2>Russian classics</h2></div>
          <span className="books-count">{String(russianClassics.length).padStart(2, "0")} books</span>
        </div>
        <p className="books-section-intro">Novels and stories exploring human nature, morality, and the inner life.</p>
        <div className="item-list">
          {russianClassics.map((book) => <BookEntry key={book.title} {...book} tag="Read in Russian" />)}
        </div>
      </section>

      <section className="editorial-section">
        <div className="books-section-heading">
          <div><p className="eyebrow">Fantasy / Series</p><h2>Harry Potter</h2></div>
          <span className="books-count">07 books</span>
        </div>
        <p className="books-section-intro">The complete seven-book series, read in both Russian and English.</p>
        <div className="item-list">
          {harryPotterBooks.map((book) => (
            <BookEntry key={book.title} {...book} tag="Russian & English" />
          ))}
        </div>
      </section>

      <section className="editorial-section">
        <div className="books-section-heading">
          <div><p className="eyebrow">Fiction</p><h2>Contemporary fiction</h2></div>
          <span className="books-count">{String(contemporaryFiction.length).padStart(2, "0")} book</span>
        </div>
        <div className="item-list">
          {contemporaryFiction.map((book) => <BookEntry key={book.title} {...book} tag="Read" />)}
        </div>
      </section>

      <section className="editorial-section">
        <div className="books-section-heading">
          <div><p className="eyebrow">Ideas &amp; perspective</p><h2>Nonfiction</h2></div>
          <span className="books-count">{String(nonfictionBooks.length).padStart(2, "0")} books</span>
        </div>
        <p className="books-section-intro">Perspectives on psychology, attention, success, and personal growth.</p>
        <div className="item-list">
          {nonfictionBooks.map((book) => <BookEntry key={book.title} {...book} tag="Read" />)}
        </div>
      </section>

      <section className="editorial-section">
        <div className="books-section-heading">
          <div><p className="eyebrow">Computer science</p><h2>Technical reading</h2></div>
          <span className="books-count">{String(technicalBooks.length).padStart(2, "0")} books</span>
        </div>
        <p className="books-section-intro">Practical reading on the tools, systems, and ideas behind software engineering.</p>
        <div className="item-list">
          {technicalBooks.map((book) => <BookEntry key={book.title} {...book} tag="Learning" />)}
        </div>
      </section>
    </main>
  );
}
