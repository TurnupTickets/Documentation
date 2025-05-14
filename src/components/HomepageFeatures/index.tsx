import type {ReactNode} from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';
import Link from "@docusaurus/Link";

type FeatureItem = {
  title: string;
  url: string;
};

const FeatureList: FeatureItem[] = [
    {
        title: 'Produkcja',
        url: 'https://turnup-tickets.pl/',
    },
    {
        title: 'Testowe środowisko',
        url: 'https://turnup-tickets.pl/beta',
    },
];

function Feature({title, url}: FeatureItem) {
  return (
      <div className={clsx('col col--6')}>
          <div className={styles.buttonsContainer}>
              <div className={styles.buttons}>
                  <Link
                      className="button button--secondary button--lg button--block"
                      to={url}>
                      {title}
                  </Link>
              </div>
          </div>
      </div>
  );
}

export default function HomepageFeatures(): ReactNode {
    return (
        <section className={styles.features}>
            <div className="container">
                <div className="row">
                    {FeatureList.map((props, idx) => (
                        <Feature key={idx} {...props} />
                    ))}
                </div>
            </div>
        </section>
    );
}
