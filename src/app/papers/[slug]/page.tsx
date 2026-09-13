import { redirect } from 'next/navigation';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function PaperSlugRedirect({ params }: Props) {
  const { slug } = await params;
  redirect(`/papershelf/${slug}`);
}
