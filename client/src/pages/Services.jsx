import React from "react";
import Footer from "../components/Footer";
const items = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1552581234-26160f608093?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
    date: "27 Apr 2025",
    title: "Launch Your Website Faster with TemplateSee",
    description:
      "Access stunning website templates and full-stack projects crafted for developers and startups. Start building today with TemplateSee!",
    tags: ["Templates", "Full-Stack", "Free & Premium"],
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=80",
    date: "18 May 2025",
    title: "Build React Apps in Minutes",
    description:
      "Quick-start your React projects with production-ready templates and beautiful UI kits built by pros.",
    tags: ["React", "UI Kits", "Productivity"],
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1000&q=80",
    date: "10 May 2025",
    title: "Design Systems Made Easy",
    description:
      "Create scalable and maintainable design systems for your applications with reusable components and patterns.",
    tags: ["Design", "Scalability", "UI/UX"],
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1581090700227-1e8a1f1f3dbb?auto=format&fit=crop&w=1000&q=80",
    date: "01 May 2025",
    title: "Master Backend APIs with Node.js",
    description:
      "Build powerful RESTful and GraphQL APIs using modern backend frameworks and best practices.",
    tags: ["Backend", "Node.js", "APIs"],
  },
  {
    id: 5,
    image:
      "https://images.unsplash.com/photo-1603575448372-2eeb2a06c8fc?auto=format&fit=crop&w=1000&q=80",
    date: "05 Apr 2025",
    title: "Boost Your Productivity with Dev Tools",
    description:
      "Discover essential tools and tips that will speed up your workflow and help you write better code.",
    tags: ["Productivity", "Tools", "Developer"],
  },
  {
    id: 6,
    image:
      "https://images.unsplash.com/photo-1524646432-6f0caa0b4ed4?auto=format&fit=crop&w=1000&q=80",
    date: "15 Mar 2025",
    title: "Top Web Design Trends in 2025",
    description:
      "Explore the latest trends in web design, including minimalism, dark mode, and motion UI.",
    tags: ["Web Design", "Trends", "Inspiration"],
  },
  {
    id: 7,
    image:
      "https://images.unsplash.com/photo-1605902711622-cfb43c4437d3?auto=format&fit=crop&w=1000&q=80",
    date: "22 Feb 2025",
    title: "Level Up with Full-Stack Projects",
    description:
      "Practice real-world skills by building full-stack apps with authentication, payments, and dashboards.",
    tags: ["Full-Stack", "Practice", "Projects"],
  },
];

const CardList = () => {
  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 p-10">
        {items.map((item) => (
          <div
            key={item.id}
            className="mx-auto max-w-md overflow-hidden rounded-lg bg-white shadow"
          >
            <img
              src={item.image}
              className="aspect-video w-full object-cover"
              alt="Template Preview"
            />
            <div className="p-4">
              <p className="mb-1 text-sm text-primary-500">
                TemplateSee Team • <time>{item.date}</time>
              </p>
              <h3 className="text-xl font-medium text-gray-900">
                {item.title}
              </h3>
              <p className="mt-1 text-gray-500">{item.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {item.tags.map((tag, index) => (
                  <span
                    key={index}
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${
                      tag === "Templates"
                        ? "bg-green-50 text-green-600"
                        : tag === "Full-Stack"
                        ? "bg-blue-50 text-blue-600"
                        : "bg-purple-50 text-purple-600"
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      <Footer />
    </>
  );
};

export default CardList;
