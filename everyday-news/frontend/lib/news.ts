export interface Article {
  id: string
  title: string
  summary: string
  content: string
  author: string
  publishedAt: string
  category: string
  imageUrl: string
  readTime: number
}

export const mockArticles: Article[] = [
  {
    id: "1",
    title: "Revolutionary AI Breakthrough Changes Everything We Know About Machine Learning",
    summary:
      "Scientists at leading tech companies have developed a new AI model that demonstrates unprecedented capabilities in reasoning and problem-solving.",
    content:
      "In a groundbreaking development that could reshape the future of artificial intelligence, researchers have unveiled a new machine learning model that exhibits remarkable reasoning capabilities. The model, developed through collaborative efforts between multiple research institutions, demonstrates an ability to solve complex problems that previously required human-level intelligence.\n\nThe breakthrough comes at a time when the AI industry is experiencing rapid growth and innovation. This new model represents a significant leap forward in our understanding of how machines can process and analyze information in ways that mirror human cognitive processes.\n\nExperts believe this development could have far-reaching implications across various industries, from healthcare and finance to education and entertainment. The potential applications are vast and could fundamentally change how we interact with technology in our daily lives.",
    author: "Dr. Sarah Chen",
    publishedAt: "2024-01-15T10:30:00Z",
    category: "Technology",
    imageUrl: "/ai-technology-breakthrough-laboratory.jpg",
    readTime: 5,
  },
  {
    id: "2",
    title: "Climate Scientists Discover Unexpected Solution to Carbon Capture",
    summary:
      "A new method for capturing atmospheric carbon dioxide shows promise for large-scale environmental restoration efforts.",
    content:
      "Environmental researchers have made a surprising discovery that could revolutionize our approach to combating climate change. The new carbon capture method, which utilizes naturally occurring biological processes, has shown remarkable efficiency in laboratory tests.\n\nThe technique involves enhancing the natural carbon absorption capabilities of certain microorganisms, allowing them to process atmospheric CO2 at rates previously thought impossible. Initial trials suggest this method could be scaled up for industrial applications.\n\nThis breakthrough comes as governments worldwide are intensifying their efforts to meet ambitious climate targets. The new technology could provide a crucial tool in the fight against global warming, offering hope for a more sustainable future.",
    author: "Prof. Michael Rodriguez",
    publishedAt: "2024-01-14T14:20:00Z",
    category: "Environment",
    imageUrl: "/climate-science-carbon-capture-laboratory.jpg",
    readTime: 4,
  },
  {
    id: "3",
    title: "Global Markets React to Unexpected Economic Policy Changes",
    summary:
      "Major stock exchanges worldwide show significant movement following announcements from central banking authorities.",
    content:
      "Financial markets across the globe experienced significant volatility today as investors responded to unexpected policy announcements from major central banks. The coordinated statements, released simultaneously across multiple time zones, outlined new approaches to monetary policy that caught many analysts by surprise.\n\nThe market reaction was swift and pronounced, with major indices showing substantial movement in both directions as traders attempted to interpret the implications of the new policies. Currency markets also experienced heightened activity as investors repositioned their portfolios.\n\nEconomic experts are divided on the long-term implications of these policy changes, with some viewing them as necessary adaptations to current global conditions, while others express concern about potential unintended consequences.",
    author: "Jennifer Walsh",
    publishedAt: "2024-01-13T16:45:00Z",
    category: "Business",
    imageUrl: "/stock-market-trading-floor-financial.jpg",
    readTime: 3,
  },
  {
    id: "4",
    title: "Medical Breakthrough Offers New Hope for Rare Disease Treatment",
    summary: "Researchers develop innovative gene therapy approach that shows remarkable success in clinical trials.",
    content:
      "A team of medical researchers has achieved a significant breakthrough in treating a rare genetic disorder that affects thousands of patients worldwide. The new gene therapy approach has shown unprecedented success rates in clinical trials, offering hope to families who previously had limited treatment options.\n\nThe therapy works by correcting the underlying genetic defect that causes the disease, rather than simply managing symptoms. This represents a fundamental shift in treatment philosophy and could pave the way for similar approaches to other genetic conditions.\n\nPatient advocacy groups have hailed the development as a major victory, while regulatory authorities are fast-tracking the approval process to make the treatment available as quickly as possible.",
    author: "Dr. Amanda Foster",
    publishedAt: "2024-01-12T09:15:00Z",
    category: "Health",
    imageUrl: "/medical-research-laboratory-gene-therapy.jpg",
    readTime: 6,
  },
  {
    id: "5",
    title: "Space Exploration Reaches New Milestone with Successful Mars Mission",
    summary: "International space agencies celebrate successful landing of advanced rover on Martian surface.",
    content:
      "The international space community is celebrating a historic achievement with the successful landing of the most advanced Mars rover ever built. The mission, which represents years of collaborative effort between multiple space agencies, marks a new chapter in our exploration of the Red Planet.\n\nThe rover is equipped with cutting-edge scientific instruments designed to search for signs of past or present life on Mars. Its advanced capabilities far exceed those of previous missions, allowing for more detailed analysis of Martian soil, atmosphere, and geological features.\n\nThis success opens up new possibilities for future Mars exploration, including potential human missions. Scientists are already planning follow-up missions based on the data and insights expected from this groundbreaking expedition.",
    author: "Dr. James Liu",
    publishedAt: "2024-01-11T12:00:00Z",
    category: "Science",
    imageUrl: "/mars-rover-space-exploration-red-planet.jpg",
    readTime: 4,
  },
]

export const categories = ["All", "Technology", "Environment", "Business", "Health", "Science"]

export function getArticles(category?: string): Article[] {
  if (!category || category === "All") {
    return mockArticles
  }
  return mockArticles.filter((article) => article.category === category)
}

export function getArticleById(id: string): Article | undefined {
  return mockArticles.find((article) => article.id === id)
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}
