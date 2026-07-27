import type { StormNote } from "@/lib/storm-notes";

type FaqItem = { q: string; a: string };

type FeelingJsonLdProps = {
  pageUrl: string;
  homeUrl: string;
  homeLabel: string;
  breadcrumbCurrent: string;
  headline: string;
  description: string;
  anonymousName: string;
  notes: StormNote[];
  faq: FaqItem[];
};

// Serialize JSON-LD safely: neutralize any "</script>" or angle brackets so a
// note body can't break out of the <script> element.
function toJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function FeelingJsonLd({
  pageUrl,
  homeUrl,
  homeLabel,
  breadcrumbCurrent,
  headline,
  description,
  anonymousName,
  notes,
  faq,
}: FeelingJsonLdProps) {
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: homeLabel, item: homeUrl },
      { "@type": "ListItem", position: 2, name: breadcrumbCurrent, item: pageUrl },
    ],
  };

  const datedNotes = notes.filter((note) => note.body && note.created_at);
  const latest = datedNotes.reduce<string | null>(
    (acc, note) => (note.created_at && (!acc || note.created_at > acc) ? note.created_at : acc),
    null,
  );

  const discussion =
    datedNotes.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "DiscussionForumPosting",
          headline,
          articleBody: description,
          url: pageUrl,
          datePublished: latest ?? undefined,
          author: { "@type": "Organization", name: "Magnitca", url: homeUrl },
          interactionStatistic: {
            "@type": "InteractionCounter",
            interactionType: "https://schema.org/CommentAction",
            userInteractionCount: datedNotes.length,
          },
          comment: datedNotes.map((note) => ({
            "@type": "Comment",
            text: note.body,
            datePublished: note.created_at,
            author: { "@type": "Person", name: note.display_name?.trim() || anonymousName, url: pageUrl },
            ...(note.helpful_count
              ? {
                  interactionStatistic: {
                    "@type": "InteractionCounter",
                    interactionType: "https://schema.org/LikeAction",
                    userInteractionCount: note.helpful_count,
                  },
                }
              : {}),
          })),
        }
      : null;

  const faqPage =
    faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        }
      : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(breadcrumb) }} />
      {discussion ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(discussion) }} />
      ) : null}
      {faqPage ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(faqPage) }} />
      ) : null}
    </>
  );
}
