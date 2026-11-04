/**
 * BATTLE OF THE MAROONS — NEWS & ANNOUNCEMENTS PAGE
 * 
 * Editorial articles, public notices, press bulletins, and full article reader.
 */

import { newsArticles as staticNewsArticles } from '../data/news.js';
import { api } from '../services/api.js';
import { refreshScrollAnimations } from '../utils/scroll-animations.js';
import { openArticleReader } from '../components/article-reader.js';

export function renderNewsPage(container) {
  let selectedCategory = 'all';
  let articles = staticNewsArticles;

  const categories = [
    { id: 'all', label: 'All News & Bulletins' },
    { id: 'Announcements', label: 'Announcements' },
    { id: 'Match Reports', label: 'Match Reports' },
    { id: 'Events', label: 'Events & Galas' },
    { id: 'Advisory', label: 'Public Notices' },
    { id: 'Community', label: 'Community' }
  ];

  function findArticleById(id) {
    if (!id) return null;
    const cleanId = String(id).trim().toLowerCase();
    
    // Look up in dynamic articles
    const dynamicMatch = articles.find(a => 
      (a.slug && String(a.slug).trim().toLowerCase() === cleanId) || 
      (a._id && String(a._id).trim().toLowerCase() === cleanId) || 
      (a.id && String(a.id).trim().toLowerCase() === cleanId)
    );
    if (dynamicMatch) return dynamicMatch;

    // Look up in static fallback articles
    const staticMatch = staticNewsArticles.find(a => 
      (a.slug && String(a.slug).trim().toLowerCase() === cleanId) || 
      (a._id && String(a._id).trim().toLowerCase() === cleanId) || 
      (a.id && String(a.id).trim().toLowerCase() === cleanId)
    );
    if (staticMatch) return staticMatch;

    // Title keyword match fallback
    return articles.find(a => a.title && a.title.toLowerCase().includes(cleanId.replace(/-/g, ' '))) || null;
  }

  async function loadDynamicNews() {
    try {
      const dynamicArticles = await api.getNews();
      if (dynamicArticles && dynamicArticles.length > 0) {
        articles = dynamicArticles.map(a => ({
          ...a,
          summary: a.excerpt || a.summary,
          image: a.coverImage || a.image
        }));
        render();
        checkDeepLinkArticle();
      }
    } catch (e) {
      // Continue using static fallback
    }
  }

  window.addEventListener('bom-news-updated', loadDynamicNews);

  function checkDeepLinkArticle() {
    const hash = window.location.hash || '';
    if (hash.includes('article=')) {
      const params = new URLSearchParams(hash.split('?')[1] || '');
      const artParam = params.get('article');
      if (artParam) {
        const match = findArticleById(artParam);
        if (match) {
          openArticleReader(match);
        }
      }
    }
  }

  function render() {
    const featured = articles[0] || staticNewsArticles[0];
    const featuredId = featured.slug || featured._id || featured.id;
    const filtered = selectedCategory === 'all'
      ? articles
      : articles.filter(a => a.category === selectedCategory);

    container.innerHTML = `
      <div class="page-hero">
        <div class="container">
          <span class="page-hero-eyebrow">Press & Dispatches</span>
          <h1 class="page-hero-title">News & Announcements</h1>
          <p class="page-hero-subtitle">
            Official announcements, match reports, event summaries, and verified notices from the Joint Organising Committee.
          </p>
        </div>
      </div>

      <section class="page-section">
        <div class="container">
          <!-- Featured Lead Story -->
          <div class="news-featured-card" data-read-article="${featuredId}" style="cursor: pointer;">
            <div class="news-featured-img-wrap" data-read-article="${featuredId}">
              <img src="${featured.coverImage || featured.image || '/assets/images/news/maroons_salutation_2025.jpeg'}" alt="${featured.title}" onerror="this.onerror=null; this.src='/assets/images/news/maroons_salutation_2025.jpeg';" />
            </div>
            <div class="news-featured-content">
              <div class="news-card-meta">
                <span class="news-card-cat">${featured.category}</span>
                <span class="news-card-date">${featured.date} • By ${featured.author}</span>
              </div>
              <h2 style="font-size: clamp(1.6rem, 3vw, 2.4rem); margin-bottom: 14px; color: var(--color-wool); font-family: var(--font-display); cursor: pointer;" data-read-article="${featuredId}">
                ${featured.title}
              </h2>
              <p style="font-size: 1.05rem; line-height: 1.7; margin-bottom: 24px; color: var(--color-wool-muted);">
                ${featured.summary}
              </p>
              <div>
                <button type="button" class="btn-primary-cinematic" data-read-article="${featuredId}">
                  Read Complete Story
                </button>
              </div>
            </div>
          </div>

          <!-- Category Filter Bar -->
          <div class="gallery-filter-bar">
            ${categories.map(c => `
              <button 
                type="button" 
                class="gallery-filter-btn ${c.id === selectedCategory ? 'active' : ''}" 
                data-news-cat="${c.id}"
              >
                ${c.label}
              </button>
            `).join('')}
          </div>

          <!-- Articles Grid -->
          <div class="news-articles-grid">
            ${filtered.map(article => {
              const artId = article.slug || article._id || article.id;
              return `
              <article class="news-card" data-read-article="${artId}" style="cursor: pointer;">
                <div class="news-card-thumb" data-read-article="${artId}">
                  <img src="${article.coverImage || article.image || '/assets/images/news/maroons_salutation_2025.jpeg'}" alt="${article.title}" loading="lazy" onerror="this.onerror=null; this.src='/assets/images/news/maroons_salutation_2025.jpeg';" />
                </div>
                <div class="news-card-body">
                  <div class="news-card-meta">
                    <span class="news-card-cat">${article.category}</span>
                    <span class="news-card-date">${article.date}</span>
                  </div>
                  <h3 class="news-card-title" data-read-article="${artId}" style="cursor: pointer;">${article.title}</h3>
                  <p class="news-card-excerpt">${article.summary}</p>
                  <button type="button" class="news-read-more-link" data-read-article="${artId}">
                    Read Article <span>&rarr;</span>
                  </button>
                </div>
              </article>
            `}).join('')}
          </div>
        </div>
      </section>
    `;

    // Filter Clicks
    container.querySelectorAll('[data-news-cat]').forEach(btn => {
      btn.addEventListener('click', () => {
        selectedCategory = btn.getAttribute('data-news-cat');
        render();
      });
    });

    // Refresh scroll reveal animations
    refreshScrollAnimations(container);
  }

  // Robust Event Delegation for all article clicks on container
  container.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-read-article]');
    if (!trigger) return;
    
    // Don't trigger if clicked on a filter button
    if (e.target.closest('[data-news-cat]')) return;

    e.preventDefault();
    e.stopPropagation();

    const id = trigger.getAttribute('data-read-article');
    const article = findArticleById(id) || articles[0] || staticNewsArticles[0];
    if (article) {
      openArticleReader(article);
    }
  });

  const handleNewsUpdated = () => {
    loadDynamicNews();
  };
  window.addEventListener('bom-news-updated', handleNewsUpdated);

  render();
  checkDeepLinkArticle();
  loadDynamicNews();
}
