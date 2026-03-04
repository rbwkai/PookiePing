// ===========================================
// SANITIZATION UTILITY
// ===========================================
// This module provides HTML sanitization to
// prevent XSS attacks when enabled
// ===========================================

const sanitizeHtml = require('sanitize-html');

/**
 * Sanitizes HTML content to prevent XSS attacks
 * 
 * Removes:
 * - <script> tags
 * - Inline event handlers (onclick, onerror, etc.)
 * - javascript: URLs
 * - Other dangerous elements
 * 
 * @param {string} dirty - The unsanitized HTML string
 * @returns {string} - The sanitized HTML string
 */
function sanitize(dirty) {
  return sanitizeHtml(dirty, {
    // Allowed HTML tags (safe ones only)
    allowedTags: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'br', 'hr',
      'ul', 'ol', 'li',
      'b', 'i', 'u', 'strong', 'em', 'strike', 's',
      'a', 'img',
      'blockquote', 'code', 'pre',
      'div', 'span',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
    ],
    
    // Allowed attributes per tag
    allowedAttributes: {
      'a': ['href', 'title', 'target'],
      'img': ['src', 'alt', 'title', 'width', 'height'],
      'div': ['class'],
      'span': ['class'],
      'p': ['class'],
      'code': ['class'],
      'pre': ['class'],
    },
    
    // Only allow safe URL schemes
    allowedSchemes: ['http', 'https', 'mailto'],
    
    // Remove javascript: URLs
    allowedSchemesByTag: {
      a: ['http', 'https', 'mailto'],
      img: ['http', 'https', 'data'],
    },
    
    // Strip all event handlers (onclick, onerror, etc.)
    allowedSchemesAppliedToAttributes: ['href', 'src'],
    
    // Don't allow any event handler attributes
    disallowedTagsMode: 'discard',
    
    // Self-closing tags
    selfClosing: ['img', 'br', 'hr'],
    
    // Enforce these settings
    enforceHtmlBoundary: true,
  });
}

module.exports = { sanitize };
