import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Button from '@/components/Button';
import Card from '@/components/Card';
import styles from './page.module.css';
import fs from 'fs';
import path from 'path';

interface Conference {
  id: string;
  title: string;
  date: string;
  venue: string;
  description: string;
  qrCode: string;
  flierUrl?: string;
  advertiseOnHomepage?: boolean;
  createdAt: string;
  updatedAt: string;
}

function getAdvertisedConferences(): Conference[] {
  try {
    const dataPath = path.join(process.cwd(), 'data', 'conferences.json');
    const fileContent = fs.readFileSync(dataPath, 'utf-8');
    const conferences: Conference[] = JSON.parse(fileContent);
    return conferences.filter(c => c.advertiseOnHomepage === true);
  } catch (error) {
    console.error('Error reading conferences:', error);
    return [];
  }
}

export default function Home() {
  const advertisedConferences = getAdvertisedConferences();
  const hasAdvertisedConferences = advertisedConferences.length > 0;

  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className={styles.hero}>
          {hasAdvertisedConferences ? (
            // Conference Hero
            <div className={styles.conferenceHero}>
              {advertisedConferences.map((conference) => (
                <div key={conference.id} className={styles.conferenceHeroContent}>
                  {conference.flierUrl && (
                    <div className={styles.conferenceHeroImage}>
                      <Image
                        src={conference.flierUrl}
                        alt={`${conference.title} flier`}
                        width={500}
                        height={700}
                        className={styles.conferenceFlier}
                        priority
                      />
                    </div>
                  )}
                  <div className={styles.conferenceHeroText}>
                    <h1 className={styles.conferenceHeroHeading}>{conference.title}</h1>
                    <div className={styles.conferenceHeroDetails}>
                      <div className={styles.conferenceHeroDetail}>
                        <span className={styles.conferenceHeroIcon}>📅</span>
                        <span>{conference.date}</span>
                      </div>
                      <div className={styles.conferenceHeroDetail}>
                        <span className={styles.conferenceHeroIcon}>📍</span>
                        <span>{conference.venue}</span>
                      </div>
                    </div>
                    <p className={styles.conferenceHeroDescription}>{conference.description}</p>
                    <div className={styles.conferenceHeroButtons}>
                      <Button href={`/conference/${conference.id}`} variant="primary">
                        Register Now
                      </Button>
                      <Button href="/conferences" variant="secondary">
                        View All Conferences
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Default Hero
            <div className={styles.heroContent}>
              <div className={styles.heroText}>
                <h1 className={styles.heroHeading}>
                  The Future Belongs to <span className={styles.highlight}>Young Nigerians</span>
                </h1>
                <p className={styles.heroSubheading}>
                  NextGen empowers youth to participate in civic life, build stronger communities,
                  and shape the future through awareness, participation, and accountability.
                </p>
                <div className={styles.heroButtons}>
                  <Button href="/join" variant="primary">Join NextGen</Button>
                  <Button href="/about" variant="secondary">Learn More</Button>
                </div>
              </div>
              <div className={styles.heroImage}>
                <Image
                  src="/hero-youth-civic.png"
                  alt="Young Nigerians engaged in civic action"
                  width={600}
                  height={400}
                  priority
                  className={styles.image}
                />
              </div>
            </div>
          )}
        </section>

        {/* Value Pillars */}
        <section className={`${styles.section} ${styles.pillars}`}>
          <div className="container">
            <h2 className={`${styles.sectionHeading} color-green`}>Our Foundation</h2>
            <div className={styles.pillarsGrid}>
              <Card>
                <div className={styles.pillarIcon}>🎓</div>
                <h3 className="color-green">Awareness</h3>
                <p>
                  Educating young Nigerians about their civic rights, responsibilities,
                  and the power of informed participation.
                </p>
              </Card>

              <Card>
                <div className={styles.pillarIcon}>✊</div>
                <h3 className="color-green">Participation</h3>
                <p>
                  Mobilizing youth to actively engage in democratic processes,
                  from voting to community organizing.
                </p>
              </Card>

              <Card>
                <div className={styles.pillarIcon}>⚖️</div>
                <h3 className="color-green">Accountability</h3>
                <p>
                  Holding leaders accountable and ensuring transparency in governance
                  through collective action.
                </p>
              </Card>

              <Card>
                <div className={styles.pillarIcon}>🤝</div>
                <h3 className="color-green">Community</h3>
                <p>
                  Building networks of engaged young people who support each other
                  and drive positive change together.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Highlight Section */}
        <section className={`${styles.section} ${styles.highlight}`}>
          <div className="container">
            <div className={styles.highlightContent}>
              <div className={styles.highlightImage}>
                <Image
                  src="/community-organizing.png"
                  alt="Community organizing session"
                  width={500}
                  height={350}
                  className={styles.image}
                />
              </div>
              <div className={styles.highlightText}>
                <h2 className="color-green">Grassroots Impact</h2>
                <p>
                  We believe in the power of young people to transform their communities
                  from the ground up. Through civic education, voter mobilization, and
                  community organizing, NextGen is building a movement of informed,
                  engaged citizens who refuse to sit on the sidelines.
                </p>
                <p>
                  Our work is non-partisan, transparent, and focused on long-term systemic
                  change. We don't just talk about the future—we're building it, one
                  community at a time.
                </p>
                <Button href="/what-we-do" variant="secondary">See What We Do</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className={`${styles.section} ${styles.cta}`}>
          <div className="container text-center">
            <h2 className={styles.ctaHeading}>Ready to Make a Difference?</h2>
            <p className={styles.ctaText}>
              Join thousands of young Nigerians who are shaping the future of our democracy.
            </p>
            <Button href="/join" variant="primary">Join NextGen Today</Button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
