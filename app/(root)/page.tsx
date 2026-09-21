import SearchForm from '@/components/SearchForm';
import StartupCard, { StartupCardType }  from '@/components/StartupCard';
import { STARTUPS_QUERY } from '@/sanity/lib/queries';
import { sanityFetch, SanityLive } from '@/sanity/lib/live';
import {auth} from '@/auth';
import SortTabs, { StartupSort } from '@/components/SortTabs';

export default async function Home({searchParams}:{
  searchParams: Promise<{query?: string, sort?: string }>
}) {
  const { query, sort: sortParam } = await searchParams;
  const sort: StartupSort = sortParam === 'votes' ? 'votes' : 'recent';
  const params = {search : query || null, sort };

  const session = await auth()
    console.log(session?.id)
  const {data: posts} = await sanityFetch({ query: STARTUPS_QUERY, params}) // Fetching data from Sanity
  console.log(posts)

  return (
    <div>
      <section className='pink_container'>
      <h1 className="heading">Pitch Your Startup, <br/> Connect With Entrepreneurs </h1>
      <p className="sub-heading !max-w-3xl">
        Submit Ideas, Vote on Pitches, and Get Noticed in Virtual Competitions
      </p>
      <SearchForm query= {query} sort={sort}/>

      </section>
<section className='section_container'>
  <p className='text-30-semibold'>
    {query ? `Search results for "${query}"`:  "All Startups"}
  </p>
  <SortTabs sort={sort} query={query} />

  <ul className="mt-7 card_grid">
  {posts?.length > 0 ? (
    posts.map((post: StartupCardType) => (
      <StartupCard key={post?._id} post={post} />
    ))
  ) : (
    <p className="no-results">No startups found</p>
  )}
</ul>

</section>
<SanityLive />

    </div>

  );
}


