/**
 * Lazy Loading and WebP Support Script
 * 
 * This script provides:
 * 1. Lazy loading for images (loads images when they're about to be visible)
 * 2. WebP format support with PNG fallback for older browsers
 * 3. Smooth loading animations
 * 4. Performance optimization
 */

class LazyImageLoader {
  constructor() {
    this.supportsWebP = false;
    this.observer = null;
    this.init();
  }

  /**
   * Initialize the lazy loader
   */
  async init() {
    // Check WebP support
    this.supportsWebP = await this.checkWebPSupport();
    console.log('WebP support:', this.supportsWebP ? '✅ Yes' : '❌ No');

    // Set up intersection observer for lazy loading
    this.setupIntersectionObserver();

    // Process existing images
    this.processImages();

    // Add loading styles
    this.addLoadingStyles();
  }

  /**
   * Check if browser supports WebP format
   */
  checkWebPSupport() {
    return new Promise((resolve) => {
      const webP = new Image();
      webP.onload = webP.onerror = () => {
        resolve(webP.height === 2);
      };
      webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    });
  }

  /**
   * Set up intersection observer for lazy loading
   */
  setupIntersectionObserver() {
    const options = {
      root: null,
      rootMargin: '100px', // Start loading 100px before image enters viewport
      threshold: 0.1
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadImage(entry.target);
          this.observer.unobserve(entry.target);
        }
      });
    }, options);
  }

  /**
   * Process all images on the page
   */
  processImages() {
    const images = document.querySelectorAll('img[src]');
    images.forEach(img => {
      // Skip if already processed or is SVG
      if (img.dataset.processed || img.src.includes('.svg')) {
        return;
      }

      // Prepare image for lazy loading
      this.prepareImageForLazyLoading(img);
    });
  }

  /**
   * Prepare an image for lazy loading
   */
  prepareImageForLazyLoading(img) {
    // Store original src
    const originalSrc = img.src;
    img.dataset.originalSrc = originalSrc;
    
    // Convert to WebP path if supported
    if (this.supportsWebP && originalSrc.includes('.png')) {
      img.dataset.webpSrc = this.convertToWebPPath(originalSrc);
    }

    // Create placeholder
    img.src = this.createPlaceholder(img.offsetWidth || 300, img.offsetHeight || 200);
    img.classList.add('lazy-loading');
    
    // Mark as processed
    img.dataset.processed = 'true';

    // Start observing
    this.observer.observe(img);
  }

  /**
   * Convert PNG path to WebP path
   */
  convertToWebPPath(pngPath) {
    if (pngPath.includes('All-DrawingsCompressed/')) {
      return pngPath.replace('All-DrawingsCompressed/', 'All-DrawingsWebP/').replace('.png', '.webp');
    }
    if (pngPath.includes('All-Drawings/')) {
      return pngPath.replace('All-Drawings/', 'All-DrawingsWebPFull/').replace('.png', '.webp');
    }
    return pngPath.replace('.png', '.webp');
  }

  /**
   * Create a placeholder image
   */
  createPlaceholder(width, height) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    // Create gradient placeholder
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#333');
    gradient.addColorStop(1, '#555');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Add loading text
    ctx.fillStyle = '#999';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Loading...', width / 2, height / 2);
    
    return canvas.toDataURL();
  }

  /**
   * Load an image with WebP fallback
   */
  async loadImage(img) {
    const webpSrc = img.dataset.webpSrc;
    const originalSrc = img.dataset.originalSrc;

    // Try WebP first if supported
    if (this.supportsWebP && webpSrc) {
      try {
        const success = await this.tryLoadImage(webpSrc);
        if (success) {
          this.setImageSrc(img, webpSrc);
          return;
        }
      } catch (error) {
        console.log('WebP failed, falling back to PNG:', error.message);
      }
    }

    // Fallback to original PNG
    this.setImageSrc(img, originalSrc);
  }

  /**
   * Try to load an image and return promise
   */
  tryLoadImage(src) {
    return new Promise((resolve, reject) => {
      const testImg = new Image();
      testImg.onload = () => resolve(true);
      testImg.onerror = () => reject(new Error('Failed to load'));
      testImg.src = src;
    });
  }

  /**
   * Set image source with loading animation
   */
  setImageSrc(img, src) {
    img.classList.add('lazy-loading');
    
    const newImg = new Image();
    newImg.onload = () => {
      img.src = src;
      img.classList.remove('lazy-loading');
      img.classList.add('lazy-loaded');
    };
    newImg.onerror = () => {
      img.classList.remove('lazy-loading');
      img.classList.add('lazy-error');
      console.error('Failed to load image:', src);
    };
    newImg.src = src;
  }

  /**
   * Add CSS styles for loading animations
   */
  addLoadingStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .lazy-loading {
        opacity: 0.6;
        filter: blur(2px);
        transition: all 0.3s ease;
      }

      .lazy-loaded {
        opacity: 1;
        filter: blur(0);
        transition: all 0.3s ease;
      }

      .lazy-error {
        opacity: 0.5;
        border: 2px solid #ff6b6b;
      }

      /* Loading shimmer effect */
      .lazy-loading::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(
          90deg,
          transparent,
          rgba(255, 255, 255, 0.2),
          transparent
        );
        animation: shimmer 1.5s infinite;
      }

      @keyframes shimmer {
        0% { left: -100%; }
        100% { left: 100%; }
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Manually trigger loading for new images (useful for dynamic content)
   */
  processNewImages() {
    this.processImages();
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.lazyLoader = new LazyImageLoader();
  });
} else {
  window.lazyLoader = new LazyImageLoader();
}

// Export for manual use
window.LazyImageLoader = LazyImageLoader;
