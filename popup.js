document.getElementById('extract').addEventListener('click', function () {
    browser.tabs.query({ active: true, currentWindow: true })
      .then((tabs) => {
        if (!tabs.length) {
          console.error('No active tab found');
          return;
        }
        // Execute script in the active tab
        return browser.tabs.executeScript(tabs[0].id, {
          code: `
            Array.from(document.querySelectorAll('a'))
              .filter(link => link.href.endsWith('.torrent') || link.href.startsWith('magnet:'))
              .map(link => link.href);
          `
        });
      })
      .then((results) => {
        if (!results || !results[0]) {
          console.error('No links found');
          return;
        }
        const links = results[0];
        const blob = new Blob([links.join('<br/>')], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  });
  