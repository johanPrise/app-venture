import React, { Suspense } from "react";
import { STARTUP_BY_ID_QUERY, PLAYLIST_BY_SLUG_QUERY, HAS_VOTED_QUERY } from "@/sanity/lib/queries";
import { notFound } from "next/navigation";
import { client } from "@/sanity/lib/client";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import markdownit from "markdown-it";
import { Skeleton } from "@/components/ui/skeleton";
import View from "@/components/View";
import ViewTracker from "@/components/ViewTracker";
import VoteButton from "@/components/VoteButton";
import { auth } from "@/auth";
import StartupCard, { StartupCardType } from "@/components/StartupCard";


const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;
  const session = await auth();
  
  // Fetch data and handle potential null responses
  // Votes are read without the CDN so the count matches the user's vote state
  const [post, editorPicksResponse, hasVoted] = await Promise.all([
    client.withConfig({ useCdn: false }).fetch(STARTUP_BY_ID_QUERY, { id }),
    client.fetch(PLAYLIST_BY_SLUG_QUERY, { slug: 'editor-picks-new' }),
    session?.id
      ? client.withConfig({ useCdn: false }).fetch(HAS_VOTED_QUERY, { startupId: id, authorId: session.id })
      : false,
  ]);
  
  // Safely extract editorPosts, defaulting to an empty array if response is null or doesn't have select
  const editorPosts = editorPicksResponse?.select || [];
  
  const md = markdownit();
  
  if (!post) return notFound();
  const parsedContent = md.render(post?.pitch || "");
  
  return (
    <>
      <section className="pink_container !min-h-[230px]">
        <p className="tag">{formatDate(post?._createdAt)}</p>
        <h1 className="heading">{post.title}</h1>
        <p className="sub-heading !max-w-5xl">{post?.description}</p>
      </section>

      <section className="section_container">
        <img
          src={post?.image}
          alt="thumbnail"
          className="w-full h-auto rounded-xl"
        />

        <div className="space-y-5 mt-10 max-w-4xl mx-auto">
          <div className="flex-between gap-5">
            <Link
              href={`/user/${post?.author?._id}`}
              className="flex gap-2 items-center mb-3"
            >
              <Image
                src={post?.author?.image}
                alt="avatar"
                width={64}
                height={64}
                className="rounded-full drop-shadow-lg"
              />

              <div>
                <p className="text-20-medium">{post?.author?.name}</p>
                <p className="text-16-medium !text-black-300">
                  @{post?.author?.username}
                </p>
              </div>
            </Link>
            <div className="flex items-center gap-3">
              <p className="category-tag">{post.category}</p>
              <VoteButton
                startupId={id}
                initialVotes={post.votes ?? 0}
                initialHasVoted={Boolean(hasVoted)}
                isLoggedIn={Boolean(session?.id)}
              />
            </div>
          </div>
          <h3 className="text-30-bold">Pitch Details</h3>
          {parsedContent ? (
            <article
              className="prose max-w-4xl mx-auto font-work-sans break-all"
              dangerouslySetInnerHTML={{ __html: parsedContent }}
            />
          ) : (
            <p className="no-result"> No Details Provided</p>
          )}
        </div>
        <hr className="divider" />

        {editorPosts?.length > 0 && (
          <div className='max-w-4xl mx-auto'>
            <p className='text-30-semibold'>Editor Picks</p>
            <ul className='mt-7 card_grid-sm'>
              {editorPosts.map((post: StartupCardType, i: number) => (
                <StartupCard key={i} post={post} />
              ))}
            </ul>
          </div>
        )}

        <Suspense fallback={<Skeleton className="view_skeleton" />}>
          <View id={id} />
        </Suspense>
        <ViewTracker id={id} />
      </section>
    </>
  );
};
export default Page;