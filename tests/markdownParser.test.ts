import { describe, it, expect } from 'vitest';
import { parseMarkdown } from '../shared/markdownParser';

describe('parseMarkdown', () => {
  it('renders html and sanitizes', () => {
    const md = '# Title\n<script>alert(1)</script>';
    const html = parseMarkdown(md);
    expect(html).toContain('<h1');
    expect(html).not.toContain('<script>');
  });
});
