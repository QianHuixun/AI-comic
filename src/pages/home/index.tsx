import { useState } from 'react';
import Header from '../../components/header';
import { Carousel } from '../../components/carousel/index';
import { RankingSection }  from '../../components/rankingsection/index';
import ComicSection from '../../components/comicsection';
import {StatsFooter} from '../../components/statsfooter';
import {Footer} from '../../components/footer';

function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-5">
        <Carousel />
        <RankingSection />
        <ComicSection />
        <StatsFooter />
      </main>
    </div>
  );
}

export default Home;