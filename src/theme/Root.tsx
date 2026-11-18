import React, {useEffect, useState, type ReactNode} from 'react';
import Head from '@docusaurus/Head';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './PasswordGate.module.css';

const STORAGE_KEY = 'docs-auth';

async function sha256(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function readStoredHash(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export default function Root({children}: {children: ReactNode}): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  const expectedHash = siteConfig.customFields?.docsPasswordHash as string;

  // Server render and first client render always show the gate,
  // so the pre-rendered HTML never contains the documentation content.
  const [status, setStatus] = useState<'checking' | 'locked' | 'unlocked'>(
    'checking',
  );
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    setStatus(readStoredHash() === expectedHash ? 'unlocked' : 'locked');
  }, [expectedHash]);

  // Rendered in both states: the gate hides the theme Layout,
  // which normally emits these tags.
  const robots = (
    <Head>
      <meta name="robots" content="noindex, nofollow" />
    </Head>
  );

  if (status === 'unlocked') {
    return (
      <>
        {robots}
        {children}
      </>
    );
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const hash = await sha256(password);
    if (hash === expectedHash) {
      try {
        localStorage.setItem(STORAGE_KEY, hash);
      } catch {
        // storage unavailable - unlock for this page view only
      }
      setStatus('unlocked');
    } else {
      setError(true);
      setPassword('');
    }
  };

  return (
    <div className={styles.wrapper}>
      {robots}
      <Head>
        <title>{siteConfig.title}</title>
      </Head>
      {status === 'locked' && (
        <form className={styles.card} onSubmit={onSubmit}>
          <h1 className={styles.title}>Dokumentacja Turnup Tickets</h1>
          <label htmlFor="docs-password" className={styles.label}>
            Hasło
          </label>
          <input
            id="docs-password"
            type="password"
            className={styles.input}
            value={password}
            autoFocus
            autoComplete="current-password"
            onChange={(e) => {
              setPassword(e.target.value);
              setError(false);
            }}
          />
          {error && (
            <p role="alert" className={styles.error}>
              Nieprawidłowe hasło
            </p>
          )}
          <button type="submit" className="button button--primary button--block">
            Wejdź
          </button>
        </form>
      )}
    </div>
  );
}
