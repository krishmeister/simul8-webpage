import { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import bible from '../data/bible.md?raw';
import styles from './BiblePanel.module.css';

interface Props {
  open: boolean;
  onClose: () => void;
}

function BiblePanel({ open, onClose }: Props) {
  return (
    <>
      <div
        className={`${styles.backdrop} ${open ? styles.backdropOpen : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={`${styles.panel} ${open ? styles.open : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="The Project Bible"
        aria-hidden={!open}
      >
        <header className={styles.header}>
          <span className={styles.title}>
            <BookIcon />
            The Bible
          </span>
          <button type="button" className={styles.close} onClick={onClose} aria-label="Close the Bible">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M4 4l8 8M12 4l-8 8" />
            </svg>
          </button>
        </header>
        <div className={styles.scroll}>
          <article className={styles.prose}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{bible}</ReactMarkdown>
          </article>
        </div>
      </aside>
    </>
  );
}

function BookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v15.5H6.5A2.5 2.5 0 0 0 4 20V4.5Z" />
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    </svg>
  );
}

export default memo(BiblePanel);
