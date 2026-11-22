import Image from "next/image";
import { CopyButton } from "@/components/copy-button";
import { TextScrub } from "@/components/gsap-transitions";
import {
  HeroAccentRule,
  HeroItem,
  HeroPortraitMotion,
  HeroStagger,
  MaskedHeadline,
  MotionLinkButton,
  PortraitReveal,
  ProjectCardMotion,
  SectionDivider,
  SectionReveal,
  SkillBadgeList,
  StaggerGroup,
  StaggerItem,
} from "@/components/motion-primitives";
import { Navbar } from "@/components/navbar";
import { PORTFOLIO, type Project } from "@/data/portfolio";

function ProjectPreview({ project }: { project: Project }) {
  return (
    <div
      className="relative aspect-[16/9] w-full overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--bg)]"
      aria-hidden="true"
    >
      <Image
        src={project.coverImage}
        alt=""
        fill
        sizes="(max-width: 768px) 100vw, 480px"
        className="object-cover opacity-80 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04] group-focus-within:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)]/85 via-[var(--bg)]/25 to-[var(--bg)]/30" />
      <div className="relative flex h-full items-start justify-between p-3.5">
        <span
          className="h-2 w-2 rounded-full ring-2 ring-[var(--bg)]/60 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-125 motion-reduce:transition-none"
          style={{ backgroundColor: project.accentTone }}
        />
        <span className="rounded bg-[var(--bg)]/75 px-2 py-0.5 text-xs text-[var(--text)] backdrop-blur-xs">
          {project.year}
        </span>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div id="top" className="min-h-screen flex flex-col">
      <Navbar />

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 sm:px-8">
        {/* Hero */}
        <section className="py-20 sm:py-28 md:py-32">
          <div className="grid items-center gap-10 md:grid-cols-12 md:gap-12">
            <HeroStagger className="max-w-3xl space-y-6 md:col-span-7">
              <HeroItem>
                <p className="flex items-center gap-2.5 text-sm text-[var(--muted)]">
                  <HeroAccentRule />
                  <span>
                    {PORTFOLIO.name} — {PORTFOLIO.role}
                  </span>
                </p>
              </HeroItem>

              <MaskedHeadline
                text={PORTFOLIO.hero.headline}
                className="font-[family-name:var(--font-display)] text-4xl leading-[1.06] tracking-tight text-[var(--text)] sm:text-6xl md:text-6xl lg:text-7xl"
              />

              <HeroItem>
                <p className="max-w-2xl text-base leading-relaxed text-[var(--muted)] sm:text-lg">
                  {PORTFOLIO.hero.subheadline}
                </p>
              </HeroItem>

              <HeroItem className="flex flex-wrap items-center gap-4 pt-2">
                <MotionLinkButton
                  href="#projects"
                  className="group inline-flex items-center gap-2 rounded-md bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-[var(--accent-ink)] transition-opacity hover:opacity-92"
                >
                  <span>{PORTFOLIO.hero.primaryCta}</span>
                  <span
                    aria-hidden="true"
                    className="inline-block transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5 group-focus-visible:translate-x-0.5 motion-reduce:transition-none"
                  >
                    →
                  </span>
                </MotionLinkButton>
                <MotionLinkButton
                  href="#contact"
                  className="inline-flex items-center rounded-md border border-[var(--border)] px-5 py-2.5 text-sm font-medium text-[var(--text)] transition-colors hover:border-[var(--muted)] hover:bg-[var(--surface)]"
                >
                  {PORTFOLIO.hero.secondaryCta}
                </MotionLinkButton>
              </HeroItem>
            </HeroStagger>

            <HeroPortraitMotion className="mx-auto w-full max-w-[280px] sm:max-w-[320px] md:col-span-5 md:ml-auto md:mr-0 md:max-w-[340px]">
              <Image
                src="/images/me-1.webp"
                alt="Portrait of Mohamed Elhosiny"
                width={600}
                height={750}
                preload
                sizes="(max-width: 640px) 280px, (max-width: 768px) 320px, 340px"
                className="h-full w-full object-cover object-[50%_18%]"
              />
            </HeroPortraitMotion>
          </div>
        </section>

        {/* About */}
        <section id="about" data-gsap="about-curtain" className="scroll-mt-20">
          <SectionDivider />
          <div className="py-16 sm:py-24">
            <SectionReveal>
              <div className="grid gap-10 md:grid-cols-12 md:gap-12">
                <div className="md:col-span-4">
                  <h2 className="font-[family-name:var(--font-display)] text-3xl text-[var(--text)] sm:text-4xl">
                    About
                  </h2>
                  <p className="mt-2 text-sm text-[var(--muted)]">
                    NLP, Generative AI &amp; Applied ML
                  </p>

                  <PortraitReveal className="mt-6 w-full max-w-[240px] sm:max-w-[260px] md:max-w-[280px]">
                    <Image
                      src="/images/me-2.webp"
                      alt="Portrait of Mohamed Elhosiny"
                      width={500}
                      height={500}
                      sizes="(max-width: 640px) 240px, (max-width: 768px) 260px, 280px"
                      className="h-full w-full object-cover object-[50%_25%]"
                    />
                  </PortraitReveal>
                </div>

                <div className="space-y-6 md:col-span-8">
                  <TextScrub
                    text={PORTFOLIO.about.lead}
                    className="text-lg leading-relaxed text-[var(--text)] sm:text-xl"
                  />
                  <div className="space-y-4 text-sm leading-relaxed text-[var(--muted)] sm:text-base">
                    {PORTFOLIO.about.body.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>

                  <StaggerGroup className="grid gap-4 pt-2 sm:grid-cols-2">
                    {PORTFOLIO.about.softSkills.map((item) => (
                      <StaggerItem key={item.title}>
                        <div className="h-full rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 transition-colors duration-200 hover:border-[var(--muted)]/50 hover:bg-[var(--surface-hover)]">
                          <h3 className="text-sm font-medium text-[var(--text)]">
                            {item.title}
                          </h3>
                          <p className="mt-1.5 text-xs leading-relaxed text-[var(--muted)]">
                            {item.detail}
                          </p>
                        </div>
                      </StaggerItem>
                    ))}
                  </StaggerGroup>
                </div>
              </div>
            </SectionReveal>
          </div>
        </section>

        {/* Projects */}
        <section id="projects" className="scroll-mt-20">
          <SectionDivider />
          <div className="py-16 sm:py-24">
            <SectionReveal>
              <div className="mb-10 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                <h2 className="font-[family-name:var(--font-display)] text-3xl text-[var(--text)] sm:text-4xl">
                  Projects
                </h2>
                <p className="text-sm text-[var(--muted)]">
                  Computer vision, NLP, deep learning, and cross-platform AI apps
                </p>
              </div>
            </SectionReveal>

            <div className="grid gap-6 md:grid-cols-2">
              {PORTFOLIO.projects.map((project, index) => (
                <div
                  key={project.slug}
                  data-gsap={index % 2 === 1 ? "project-shift" : undefined}
                  className="h-full"
                >
                  <ProjectCardMotion
                    accentTone={project.accentTone}
                    delay={(index % 2) * 0.06}
                    className="group flex h-full flex-col justify-between rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 transition-colors duration-200 hover:border-[var(--muted)]/50 hover:bg-[var(--surface-hover)] focus-within:border-[var(--muted)]/60"
                  >
                    <div className="space-y-4">
                      <ProjectPreview project={project} />
                      <div>
                        <h3 className="text-lg font-medium text-[var(--text)]">
                          {project.title}
                        </h3>
                        <dl className="mt-3 space-y-2 text-sm leading-relaxed">
                          <div>
                            <dt className="inline font-medium text-[var(--text)]">
                              Problem:{" "}
                            </dt>
                            <dd className="inline text-[var(--muted)]">
                              {project.problem}
                            </dd>
                          </div>
                          <div>
                            <dt className="inline font-medium text-[var(--text)]">
                              Solution:{" "}
                            </dt>
                            <dd className="inline text-[var(--muted)]">
                              {project.solution}
                            </dd>
                          </div>
                          <div>
                            <dt className="inline font-medium text-[var(--text)]">
                              Result:{" "}
                            </dt>
                            <dd className="inline text-[var(--muted)]">
                              {project.result}{" "}
                              <span className="text-xs text-[var(--accent)]/85">
                                ({project.metricsTodo})
                              </span>
                            </dd>
                          </div>
                        </dl>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border)] pt-4">
                      <div className="flex flex-wrap gap-2">
                        {project.stack.map((tech) => (
                          <span
                            key={tech}
                            className="rounded border border-[var(--border)] bg-[var(--bg)] px-2 py-0.5 text-xs text-[var(--muted)] transition-colors duration-200 group-hover:border-[var(--muted)]/40"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      {project.liveUrl || project.repoUrl ? (
                        <div className="flex items-center gap-4 text-xs font-medium">
                          {project.liveUrl ? (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-[var(--accent)] transition-opacity hover:opacity-80"
                            >
                              <span>Live demo</span>
                              <span
                                aria-hidden="true"
                                className="inline-block transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none"
                              >
                                ↗
                              </span>
                            </a>
                          ) : null}
                          {project.repoUrl ? (
                            <a
                              href={project.repoUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-[var(--accent)] transition-opacity hover:opacity-80"
                            >
                              <span>GitHub Repo</span>
                              <span
                                aria-hidden="true"
                                className="inline-block transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none"
                              >
                                ↗
                              </span>
                            </a>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  </ProjectCardMotion>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Experience */}
        <section id="experience" className="scroll-mt-20">
          <SectionDivider />
          <div className="py-16 sm:py-24">
            <SectionReveal>
              <div className="grid gap-10 md:grid-cols-12 md:gap-12">
                <div className="md:col-span-4">
                  <h2 className="font-[family-name:var(--font-display)] text-3xl text-[var(--text)] sm:text-4xl">
                    Experience
                  </h2>
                  <p className="mt-2 text-sm text-[var(--muted)]">
                    Training tracks &amp; practical internships
                  </p>
                </div>

                <StaggerGroup className="divide-y divide-[var(--border)] md:col-span-8">
                  {PORTFOLIO.experience.map((item) => (
                    <StaggerItem
                      key={`${item.organization}-${item.role}`}
                      className="group relative py-6 pl-0 transition-colors first:pt-0 last:pb-0"
                    >
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute -left-3 top-6 bottom-6 w-[2px] origin-top scale-y-0 rounded-full bg-[var(--accent)]/75 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-y-100 group-first:top-0 motion-reduce:transition-none"
                      />
                      <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-baseline">
                        <h3 className="text-base font-medium text-[var(--text)]">
                          {item.role}
                        </h3>
                        <span className="text-xs text-[var(--muted)]">
                          {item.period}
                        </span>
                      </div>
                      <p className="mt-0.5 text-sm text-[var(--accent)]">
                        {item.organization}
                      </p>
                      <p className="mt-2.5 text-sm leading-relaxed text-[var(--muted)]">
                        {item.description}
                      </p>
                    </StaggerItem>
                  ))}
                </StaggerGroup>
              </div>
            </SectionReveal>
          </div>
        </section>

        {/* Skills */}
        <section id="skills" className="scroll-mt-20">
          <SectionDivider />
          <div className="py-16 sm:py-24">
            <SectionReveal>
              <div className="grid gap-10 md:grid-cols-12 md:gap-12">
                <div className="md:col-span-4">
                  <h2 className="font-[family-name:var(--font-display)] text-3xl text-[var(--text)] sm:text-4xl">
                    Skills
                  </h2>
                  <p className="mt-2 text-sm text-[var(--muted)]">
                    AI/ML, mobile &amp; web development, cloud, and languages
                  </p>
                </div>

                <StaggerGroup className="grid gap-6 sm:grid-cols-2 md:col-span-8">
                  {PORTFOLIO.skills.map((group) => (
                    <StaggerItem key={group.category}>
                      <div className="h-full rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 transition-colors duration-200 hover:border-[var(--muted)]/50">
                        <h3 className="text-sm font-medium text-[var(--text)]">
                          {group.category}
                        </h3>
                        <SkillBadgeList items={group.items} />
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerGroup>
              </div>
            </SectionReveal>
          </div>
        </section>

        {/* Education */}
        <section id="education" className="scroll-mt-20">
          <SectionDivider />
          <div className="py-16 sm:py-24">
            <SectionReveal>
              <div className="grid gap-10 md:grid-cols-12 md:gap-12">
                <div className="md:col-span-4">
                  <h2 className="font-[family-name:var(--font-display)] text-3xl text-[var(--text)] sm:text-4xl">
                    Education
                  </h2>
                </div>

                <div className="space-y-6 md:col-span-8">
                  {PORTFOLIO.education.map((edu) => (
                    <div
                      key={edu.institution}
                      className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6 transition-colors duration-200 hover:border-[var(--muted)]/50"
                    >
                      <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-baseline">
                        <h3 className="text-base font-medium text-[var(--text)]">
                          {edu.institution}
                        </h3>
                        <span className="text-xs text-[var(--muted)]">
                          {edu.expectedGraduation}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-[var(--accent)]">
                        {edu.degree}
                      </p>
                      <p className="mt-2 text-sm text-[var(--muted)]">
                        {edu.faculty}
                      </p>
                      <p className="mt-1 text-sm text-[var(--muted)]">
                        {edu.gpa}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </SectionReveal>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="scroll-mt-20">
          <SectionDivider />
          <div className="py-16 sm:py-24">
            <SectionReveal>
              <div
                data-gsap="contact-curtain"
                className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-8 sm:p-12"
              >
                <div className="max-w-2xl space-y-5">
                  <h2 className="font-[family-name:var(--font-display)] text-3xl text-[var(--text)] sm:text-5xl">
                    Get in touch
                  </h2>
                  <p className="text-sm leading-relaxed text-[var(--muted)] sm:text-base">
                    Open to AI/ML engineering roles, internships, and technical
                    collaborations in NLP and generative AI.
                  </p>
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <div className="inline-flex max-w-full items-center gap-1.5">
                      <MotionLinkButton
                        href={`mailto:${PORTFOLIO.email}`}
                        className="group inline-flex h-10 min-w-0 items-center gap-1.5 rounded-md bg-[var(--accent)] px-3 text-xs font-medium text-[var(--accent-ink)] transition-opacity hover:opacity-92 sm:gap-2 sm:px-5 sm:text-sm"
                      >
                        <span className="truncate">{PORTFOLIO.email}</span>
                        <span
                          aria-hidden="true"
                          className="inline-block shrink-0 transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5 group-focus-visible:translate-x-0.5 motion-reduce:transition-none"
                        >
                          →
                        </span>
                      </MotionLinkButton>
                      <CopyButton
                        value={PORTFOLIO.email}
                        label="email address"
                      />
                    </div>

                    <div className="inline-flex items-center gap-1.5">
                      <a
                        href={`tel:${PORTFOLIO.phone}`}
                        className="inline-flex h-10 items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--bg)]/70 px-3.5 text-sm font-medium text-[var(--text)] tabular-nums transition-colors duration-200 hover:border-[var(--muted)]/60 hover:bg-[var(--surface-hover)]"
                      >
                        <svg
                          aria-hidden="true"
                          viewBox="0 0 16 16"
                          fill="none"
                          className="h-3.5 w-3.5 shrink-0 text-[var(--accent)]"
                        >
                          <path
                            d="M3.2 2.5h2.2c.35 0 .66.24.74.58l.55 2.2c.07.3-.04.62-.29.8l-1.15.86a8.6 8.6 0 0 0 3.81 3.81l.86-1.15c.18-.25.5-.36.8-.29l2.2.55c.34.08.58.39.58.74v2.2c0 .44-.36.8-.8.78C7.02 13.3 2.7 8.98 2.42 3.3a.78.78 0 0 1 .78-.8Z"
                            stroke="currentColor"
                            strokeWidth="1.35"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span>{PORTFOLIO.phone}</span>
                      </a>
                      <CopyButton
                        value={PORTFOLIO.phone}
                        label="phone number"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2.5 pt-1">
                    <a
                      href={PORTFOLIO.locationMapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="group inline-flex items-center gap-1.5 text-sm text-[var(--muted)] transition-colors hover:text-[var(--text)]"
                    >
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 16 16"
                        fill="none"
                        className="h-3.5 w-3.5 shrink-0 text-[var(--accent)]"
                      >
                        <path
                          d="M8 14s4.5-4.15 4.5-7.5a4.5 4.5 0 1 0-9 0C3.5 9.85 8 14 8 14Z"
                          stroke="currentColor"
                          strokeWidth="1.35"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <circle
                          cx="8"
                          cy="6.5"
                          r="1.5"
                          stroke="currentColor"
                          strokeWidth="1.35"
                        />
                      </svg>
                      <span>{PORTFOLIO.location}</span>
                      <span
                        aria-hidden="true"
                        className="inline-block text-xs transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none"
                      >
                        ↗
                      </span>
                    </a>

                    <span
                      aria-hidden="true"
                      className="hidden text-[var(--border)] sm:inline"
                    >
                      ·
                    </span>

                    <div className="flex items-center gap-5">
                      <a
                        href={PORTFOLIO.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="group inline-flex items-center gap-1 text-sm text-[var(--muted)] transition-colors hover:text-[var(--text)]"
                      >
                        <span>GitHub</span>
                        <span
                          aria-hidden="true"
                          className="inline-block text-xs transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none"
                        >
                          ↗
                        </span>
                      </a>
                      <a
                        href={PORTFOLIO.linkedinUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="group inline-flex items-center gap-1 text-sm text-[var(--muted)] transition-colors hover:text-[var(--text)]"
                      >
                        <span>LinkedIn</span>
                        <span
                          aria-hidden="true"
                          className="inline-block text-xs transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none"
                        >
                          ↗
                        </span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </SectionReveal>
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--border)] py-6">
        <div className="mx-auto flex max-w-5xl flex-col justify-between gap-2 px-6 text-xs text-[var(--muted)] sm:flex-row sm:items-center sm:px-8">
          <span>© 2026 {PORTFOLIO.name}</span>
          <div className="flex items-center gap-5">
            <a
              href={`mailto:${PORTFOLIO.email}`}
              className="transition-colors hover:text-[var(--text)]"
            >
              Email
            </a>
            <a
              href={PORTFOLIO.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-[var(--text)]"
            >
              GitHub
            </a>
            <a
              href={PORTFOLIO.linkedinUrl}
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-[var(--text)]"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
