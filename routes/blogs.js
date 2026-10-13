const express = require("express");
const fs = require("fs/promises");
const path = require("path");

const router = express.Router();
const blogApiUrl = (process.env.BLOG_API_URL || "https://blogs-crm.brotherslight.in/api").replace(/\/+$/, "");
const siteUrl = (process.env.SITE_URL || "https://brotherslight.in").replace(/\/+$/, "");
const requestTimeout = 8000;
const blogsPerPage = 9;
const localHosts = new Set(["localhost", "127.0.0.1", "::1", "[::1]", "0.0.0.0"]);

class BlogApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "BlogApiError";
    this.status = status;
  }
}

async function apiGet(endpoint) {
  let response;
  try {
    response = await fetch(`${blogApiUrl}${endpoint}`, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(requestTimeout)
    });
  } catch (error) {
    throw new BlogApiError(`Request failed: ${error.message}`);
  }

  if (!response.ok) {
    throw new BlogApiError(`CRM returned HTTP ${response.status}.`, response.status);
  }

  try {
    return await response.json();
  } catch (error) {
    throw new BlogApiError(`CRM returned invalid JSON: ${error.message}`);
  }
}

async function getBlogPage(page, search, category) {
  const query = new URLSearchParams({
    page: String(page),
    limit: String(blogsPerPage)
  });
  if (search) query.set("search", search);
  if (category) query.set("category", category);

  const result = await apiGet(`/blogs?${query}`);
  if (
    result.success !== true ||
    !Array.isArray(result.blogs) ||
    !Number.isInteger(Number(result.totalPages))
  ) {
    throw new BlogApiError("CRM returned an unexpected blog-list response.");
  }
  return result;
}

async function getCategories() {
  const result = await apiGet("/blogs/categories");
  if (result.success !== true || !Array.isArray(result.categories)) {
    throw new BlogApiError("CRM returned an unexpected category response.");
  }
  return result.categories;
}

function safeJson(value) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

function dateIso(value) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString();
}

function dateDisplay(value) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? ""
    : new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric" }).format(date);
}

function readingTime(blog) {
  const content = String(blog.content || blog.excerpt || blog.title || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&(?:[a-z]+|#\d+|#x[\da-f]+);/gi, " ");
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

function pageUrl(page, search, category) {
  const query = new URLSearchParams({ page: String(page) });
  if (search) query.set("search", search);
  if (category) query.set("category", category);
  return `/blogs?${query}`;
}

function isLocalUrl(url) {
  const hostname = url.hostname.toLowerCase();
  return localHosts.has(hostname) || hostname.endsWith(".localhost");
}

function parseHttpUrl(value) {
  try {
    const url = new URL(value);
    if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) return null;
    if (process.env.NODE_ENV === "production" && isLocalUrl(url)) return null;
    return url;
  } catch {
    return null;
  }
}

function mediaBaseUrl() {
  const configured = process.env.BLOG_MEDIA_BASE_URL;
  const crmOrigin = parseHttpUrl(new URL(blogApiUrl).origin);
  const base = configured ? parseHttpUrl(configured) : crmOrigin;
  if (!base) {
    throw new BlogApiError(
      "Set BLOG_MEDIA_BASE_URL to a publicly reachable HTTP(S) CRM media origin."
    );
  }
  return base;
}

function resolveBlogImage(blog) {
  const storedPath = String(blog.featured_image || "").trim();
  const apiImageUrl = String(blog.featured_image_url || "").trim();

  const absoluteStoredPath = parseHttpUrl(storedPath);
  if (absoluteStoredPath) return absoluteStoredPath.href;

  if (storedPath) {
    if (storedPath.startsWith("//")) return "";

    const base = mediaBaseUrl();
    const resolved = new URL(storedPath, `${base.href.replace(/\/+$/, "")}/`);
    if (resolved.origin !== base.origin || (process.env.NODE_ENV === "production" && isLocalUrl(resolved))) {
      throw new BlogApiError("CRM returned a featured image URL outside the configured media origin.");
    }
    return resolved.href;
  }

  const absoluteApiImage = parseHttpUrl(apiImageUrl);
  if (absoluteApiImage) return absoluteApiImage.href;
  if (!apiImageUrl || apiImageUrl.startsWith("//")) return "";
  const base = mediaBaseUrl();
  const resolvedApiImage = new URL(apiImageUrl, `${base.href.replace(/\/+$/, "")}/`);
  return resolvedApiImage.origin === base.origin ? resolvedApiImage.href : "";
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatPlainTextArticle(content) {
  const lines = String(content || "").replace(/\r\n?/g, "\n").split("\n");
  const blocks = [];
  let index = 0;
  const listItem = line => {
    const unordered = line.match(/^\s*[-*•]\s+(.+)$/);
    if (unordered) return { type: "ul", text: unordered[1] };
    const ordered = line.match(/^\s*\d+[.)]\s+(.+)$/);
    if (ordered && /[.!?]["')\]]?$/.test(ordered[1])) {
      return { type: "ol", text: ordered[1] };
    }
    return null;
  };
  const heading = line => {
    const numbered = line.match(/^\s*\d+[.)]\s+(.+)$/);
    if (numbered && !/[.!?]["')\]]?$/.test(numbered[1])) {
      return { level: "h2", text: numbered[1] };
    }
    const shortHeading = line.trim();
    if (
      shortHeading.length <= 90 &&
      shortHeading.split(/\s+/).length <= 8 &&
      /^[A-Z][\w&,'’()-]*(?:\s+[A-Z][\w&,'’()-]*)*$/.test(shortHeading) &&
      !/[.!?]$/.test(shortHeading)
    ) {
      return { level: "h3", text: shortHeading };
    }
    return null;
  };

  while (index < lines.length) {
    const line = lines[index].trim();
    if (!line) {
      index += 1;
      continue;
    }

    const currentItem = listItem(line);
    if (currentItem) {
      const items = [];
      while (index < lines.length) {
        if (!lines[index].trim()) {
          index += 1;
          continue;
        }
        const item = listItem(lines[index].trim());
        if (!item || item.type !== currentItem.type) break;
        items.push(`<li>${escapeHtml(item.text)}</li>`);
        index += 1;
      }
      blocks.push(`<${currentItem.type}>${items.join("")}</${currentItem.type}>`);
      continue;
    }

    const sectionHeading = heading(line);
    if (sectionHeading) {
      blocks.push(`<${sectionHeading.level}>${escapeHtml(sectionHeading.text)}</${sectionHeading.level}>`);
      index += 1;
      continue;
    }

    const paragraphLines = [];
    while (index < lines.length && lines[index].trim()) {
      if (paragraphLines.length && (listItem(lines[index].trim()) || heading(lines[index].trim()))) break;
      paragraphLines.push(lines[index].trim());
      index += 1;
    }
    if (paragraphLines.length) {
      blocks.push(`<p>${paragraphLines.map(escapeHtml).join(" ")}</p>`);
    }
  }

  return blocks.join("\n");
}

function articleContent(content) {
  const value = String(content || "");
  return /<\/?(?:h[1-6]|p|br|strong|b|em|i|u|ul|ol|li|blockquote|a|img|figure|hr|pre|code|table)\b/i.test(value)
    ? value
    : formatPlainTextArticle(value);
}

function sitemapError(res, error) {
  console.error("Could not build public sitemap from the Blog CRM:", error.message);
  return res.status(503).type("text/plain").send("Sitemap temporarily unavailable.");
}

router.get("/sitemap.xml", async (_req, res) => {
  try {
    const firstPage = await getBlogPage(1, "", "");
    const totalPages = Number(firstPage.totalPages);
    if (totalPages > 2083) {
      throw new BlogApiError("CRM sitemap exceeds the standard single-file URL limit.");
    }

    const blogs = firstPage.blogs.slice();
    for (let page = 2; page <= totalPages; page += 1) {
      const result = await getBlogPage(page, "", "");
      blogs.push(...result.blogs);
    }

    const sitemapPath = path.join(__dirname, "..", "Public", "sitemap.xml");
    const existingSitemap = await fs.readFile(sitemapPath, "utf8");
    const closingTag = "</urlset>";
    if (!existingSitemap.includes(closingTag)) {
      throw new Error("The existing sitemap has no urlset closing tag.");
    }

    const xmlEscape = value => String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
    const articleUrls = blogs.map(blog => {
      const loc = `${siteUrl}/blogs/${encodeURIComponent(blog.slug)}`;
      const lastmod = dateIso(blog.updated_at);
      return `<url><loc>${xmlEscape(loc)}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}</url>`;
    }).join("");

    res.type("application/xml").send(
      existingSitemap.replace(closingTag, `${articleUrls}${closingTag}`)
    );
  } catch (error) {
    sitemapError(res, error);
  }
});

router.get("/blogs", async (req, res) => {
  const search = String(req.query.search || "").trim().slice(0, 120);
  const category = String(req.query.category || "").trim().slice(0, 100);
  const requestedPage = Number(req.query.page || "1");
  const page = Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const seo = {
    title: "Blogs & Insights | Brothers Light",
    description: "Explore insights on software development, business automation, ERP, CRM, AI, and digital solutions from Brothers Light.",
    canonical: `${siteUrl}/blogs`,
    schemaType: "CollectionPage"
  };

  try {
    const [result, categories] = await Promise.all([
      getBlogPage(page, search, category),
      getCategories()
    ]);
    if (Number(result.totalPages) > 0 && page > Number(result.totalPages)) {
      return res.redirect(302, pageUrl(Number(result.totalPages), search, category));
    }
    const blogs = result.blogs.map(blog => ({
      ...blog,
      featured_image_url: resolveBlogImage(blog)
    }));
    res.render("pages/blogs", {
      seo,
      blogs,
      categories,
      search,
      selectedCategory: category,
      page: Number(result.page) || page,
      total: Number(result.total) || 0,
      totalPages: Number(result.totalPages) || 0,
      pageUrl,
      dateIso,
      dateDisplay,
      readingTime,
      apiError: false
    });
  } catch (error) {
    console.error("Could not load public blogs from the Blog CRM:", error.message);
    res.status(503).render("pages/blogs", {
      seo,
      blogs: [],
      categories: [],
      search,
      selectedCategory: category,
      page,
      total: 0,
      totalPages: 0,
      pageUrl,
      dateIso,
      dateDisplay,
      readingTime,
      apiError: true
    });
  }
});

router.get("/blogs/:slug", async (req, res) => {
  const slug = req.params.slug;
  const canonical = `${siteUrl}/blogs/${encodeURIComponent(slug)}`;
  const notFoundSeo = {
    title: "Article not found | Brothers Light",
    description: "The requested article could not be found.",
    canonical,
    schemaType: "WebPage"
  };
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return res.status(404).render("pages/blog-detail", {
      seo: notFoundSeo,
      blog: null,
      related: [],
      blogJsonLd: "",
      apiError: false
    });
  }

  try {
    const result = await apiGet(`/blogs/${encodeURIComponent(slug)}`);
    if (result.success !== true || !result.blog) {
      return res.status(404).render("pages/blog-detail", {
        seo: notFoundSeo,
        blog: null,
        related: [],
        blogJsonLd: "",
        apiError: false
      });
    }

    const blog = result.blog;
    if (blog.slug !== slug || typeof blog.content !== "string") {
      throw new BlogApiError("CRM returned an invalid blog detail response.");
    }
    blog.featured_image_url = resolveBlogImage(blog);
    const related = (Array.isArray(blog.related) ? blog.related : []).map(item => ({
      ...item,
      featured_image_url: resolveBlogImage(item)
    }));
    const seo = {
      title: blog.meta_title || `${blog.title} | Brothers Light`,
      description: blog.meta_description || blog.excerpt || `Read ${blog.title} on Brothers Light.`,
      canonical: `${siteUrl}/blogs/${encodeURIComponent(blog.slug)}`,
      schemaType: "WebPage",
      ogType: "article",
      image: blog.featured_image_url || "https://brotherslight.in/images/logo-red.png"
    };
    const authorName = blog.author_name || "Brothers Light";
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": blog.title,
      "description": seo.description,
      "image": blog.featured_image_url || undefined,
      "datePublished": dateIso(blog.published_at) || undefined,
      "dateModified": dateIso(blog.updated_at) || undefined,
      "author": {
        "@type": authorName === "Brothers Light" ? "Organization" : "Person",
        "name": authorName
      },
      "publisher": {
        "@type": "Organization",
        "name": "Brothers Light",
        "logo": {
          "@type": "ImageObject",
          "url": `${siteUrl}/images/logo-red.png`
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": seo.canonical
      }
    };
    res.render("pages/blog-detail", {
      seo,
      blog,
      related,
      articleContent: articleContent(blog.content),
      blogJsonLd: safeJson(structuredData),
      dateIso,
      dateDisplay
    });
  } catch (error) {
    if (error.status === 404) {
      return res.status(404).render("pages/blog-detail", {
        seo: notFoundSeo,
        blog: null,
        related: [],
        blogJsonLd: "",
        apiError: false
      });
    }
    console.error(`Could not load public blog "${slug}" from the Blog CRM:`, error.message);
    return res.status(503).render("pages/blog-detail", {
      seo: {
        title: "Article temporarily unavailable | Brothers Light",
        description: "This article is temporarily unavailable. Please try again shortly.",
        canonical,
        schemaType: "WebPage"
      },
      blog: null,
      related: [],
      blogJsonLd: "",
      apiError: true
    });
  }
});

module.exports = router;
