(() => {
    'use strict';

    const initSupportSearch = () => {
        const input = document.getElementById('support-search-input');
        const form = document.getElementById('support-search-form');
        const count = document.getElementById('support-results-count');
        const clearButton = document.getElementById('support-clear');
        const noResults = document.getElementById('support-no-results');
        const githubLink = document.getElementById('support-github-search');

        if (!input || !form || !count || !clearButton || !noResults || !githubLink) {
            return;
        }

        const articles = Array.from(document.querySelectorAll('[data-support-item]'));
        const groups = Array.from(document.querySelectorAll('[data-support-group]'));
        const topicCards = Array.from(document.querySelectorAll('[data-support-topic]'));
        const allTopicsCount = articles.length;

        const normalize = (value) => value
            .toLocaleLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9._ -]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();

        const updateSearch = () => {
            const query = normalize(input.value);
            const terms = query.split(' ').filter(Boolean);
            let visibleCount = 0;

            articles.forEach((article) => {
                const searchableText = normalize(
                    `${article.innerText || article.textContent || ''} ${article.dataset.search || ''}`
                );
                const matches = terms.length === 0 || terms.every((term) => searchableText.includes(term));
                article.hidden = !matches;
                if (matches) visibleCount += 1;
            });

            groups.forEach((group) => {
                const groupArticles = Array.from(group.querySelectorAll('[data-support-item]'));
                const hasVisibleArticle = groupArticles.some((article) => !article.hidden);
                group.hidden = groupArticles.length > 0 && !hasVisibleArticle;
            });

            topicCards.forEach((card) => {
                const targetId = card.dataset.supportTopic;
                const targetGroup = targetId ? document.getElementById(targetId) : null;
                card.hidden = Boolean(targetGroup && targetGroup.hidden);
            });

            if (terms.length === 0) {
                count.textContent = `Showing all ${allTopicsCount} support articles.`;
            } else if (visibleCount === 1) {
                count.textContent = '1 matching support article.';
            } else {
                count.textContent = `${visibleCount} matching support articles.`;
            }

            noResults.hidden = visibleCount !== 0;
            clearButton.hidden = terms.length === 0;

            if (terms.length > 0) {
                const githubQuery = `is:issue ${input.value.trim()}`;
                githubLink.href = `https://github.com/cefsharp/CefSharp/issues?q=${encodeURIComponent(githubQuery)}`;
                githubLink.textContent = 'Search matching CefSharp issues on GitHub ↗';
            } else {
                githubLink.href = 'https://github.com/cefsharp/CefSharp/discussions';
                githubLink.textContent = 'Browse CefSharp community discussions ↗';
            }
        };

        form.addEventListener('submit', (event) => {
            event.preventDefault();
            updateSearch();
            document.getElementById('support-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });

        input.addEventListener('input', updateSearch);

        clearButton.addEventListener('click', () => {
            input.value = '';
            updateSearch();
            input.focus();
        });

        document.querySelectorAll('[data-support-query]').forEach((button) => {
            button.addEventListener('click', () => {
                input.value = button.dataset.supportQuery || '';
                updateSearch();
                input.focus();
                document.getElementById('support-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });

        updateSearch();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSupportSearch, { once: true });
    } else {
        initSupportSearch();
    }
})();
