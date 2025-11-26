import axios from "axios";
import cheerio from "cheerio";

export async function fetchPastPapers(year, subject) {
  const baseUrl = "https://pastpapers.wiki/";

  try {
    const { data } = await axios.get(baseUrl, {
      headers: { "User-Agent": "Mozilla/5.0" }
    });

    const $ = cheerio.load(data);

    let foundLinks = [];

    // Step 1 — Find links containing the YEAR in href or text
    $("a").each((i, el) => {
      const text = $(el).text().trim();
      const href = $(el).attr("href") || "";

      if (href.includes(year) || text.includes(year)) {
        const fullURL = href.startsWith("http") ? href : new URL(href, baseUrl).href;
        foundLinks.push(fullURL);
      }
    });

    let pdfs = [];

    // Step 2 — Visit each year page & find SUBJECT and PDF links
    for (let page of foundLinks) {
      try {
        const { data: pageHTML } = await axios.get(page, { headers: { "User-Agent": "Mozilla/5.0" } });
        const $$ = cheerio.load(pageHTML);

        $$("a").each((j, el) => {
          const t = $$(el).text().toLowerCase();
          const href = $$(el).attr("href") || "";

          // if anchor text contains the subject or href contains subject
          if (t.includes(subject.toLowerCase()) || href.toLowerCase().includes(subject.toLowerCase())) {
            // if href is a PDF
            if (href.includes(".pdf")) {
              const fullURL = href.startsWith("http") ? href : new URL(href, page).href;
              pdfs.push({
                title: t || "Past Paper",
                url: fullURL
              });
            }
          }
        });

      } catch (err) {
        console.log("Failed to fetch page:", page, err.message);
      }
    }

    // deduplicate by URL
    const unique = Array.from(new Map(pdfs.map(p => [p.url, p])).values());
    return unique;

  } catch (err) {
    console.error("fetchPastPapers error:", err.message);
    return [];
  }
}
