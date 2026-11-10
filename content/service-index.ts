// Shared by navigation and page teasers. Full editorial records stay on the server.
export const serviceIndex = {
  imagefilme: {
    title: "Imagefilme",
    summary:
      "Wer Sie sind, wie Sie arbeiten und was Ihr Unternehmen besonders macht.",
    image: "/assets/images/interview.webp",
  },
  recruitingfilme: {
    title: "Recruitingfilme",
    summary:
      "Ein Blick in den Arbeitsalltag – aus der Perspektive der Menschen, die ihn gestalten.",
    image: "/assets/images/recruiting.webp",
  },
} as const;

export type ServiceSlug = keyof typeof serviceIndex;

export const servicePreviews = (Object.keys(serviceIndex) as ServiceSlug[]).map(
  (slug) => ({
    slug,
    ...serviceIndex[slug],
  }),
);

