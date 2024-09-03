"use client"

import Card from "@/components/Card";
import Featured from "@/components/Featured";
import Header from "@/components/Header";
import Link from "next/link";
import { useEffect, useState } from "react";
import { loadNFTs, NFT } from "@/services/Web3Service";

export default function Home() {

  const [nfts, setNfts] = useState<NFT[]>([])
  const [message, setMessage] = useState<string>("")

  useEffect(() => {
    loadNFTs().then(nfts => setNfts(nfts.reverse())).catch(err => setMessage(err.message))
  }, [])

  return (
    <>
      <main>
        <section className="bg-secondary-500 poster pt-4 relative text-opacity-60 text-white sm:px-4">
          <Header />
          <div className="container mx-auto pb-36 pt-16 px-4 relative">
            <div className="-mx-4 flex flex-wrap items-center space-y-6 lg:space-y-0">
              <Featured nft={nfts[nfts.length - 1]} />
              <div className="mx-auto px-4 w-full lg:w-6/12">
                <h1 className="font-bold leading-tight mb-2 text-4xl text-white md:leading-tight md:text-5xl lg:leading-tight lg:text-6xl 2xl:leading-tight 2xl:text-7xl">Meu NFT Market</h1>
                <p className="font-light mb-12 text-xl">World largest marketplace for rarest NFTs.</p>
                <div className="flex flex-wrap gap-4 items-center">
                  <Link href="/create" className="bg-gradient-to-t bg-primary-500 font-bold from-primary-500 hover:bg-primary-600 hover:from-primary-600 hover:to-primary-500 inline-block px-12 py-2 rounded text-white to-primary-400">Create</Link>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="bg-opacity-10 bg-primary-500 py-24 sm:px-4">
          <div className="container mx-auto px-4">
            <div className="-mx-4 flex flex-wrap gap-2 items-center mb-6">
              <div className="px-4 w-full md:flex-1">
                <h2 className="capitalize font-bold text-3xl text-gray-900"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="1.25em" height="1.25em" className="inline-block mb-2 mr-2 text-primary-500">
                  <path d="M12 23a7.5 7.5 0 0 1-5.138-12.963C8.204 8.774 11.5 6.5 11 1.5c6 4 9 8 3 14 1 0 2.5 0 5-2.47.27.773.5 1.604.5 2.47A7.5 7.5 0 0 1 12 23z"></path>
                </svg><span>NFTs on sale</span></h2>
              </div>
            </div>
            <div className="-mx-3 flex flex-wrap gap-y-6 justify-center mb-12">
              {
                nfts && nfts.length
                  ? nfts.map(nft => <Card nft={nft} sold={false} />)
                  : <>No NFTs found for sale</>
              }
            </div>
            {/* <div className="text-center"><a href="#" className="bg-gradient-to-t bg-primary-500 from-primary-500 hover:bg-primary-600 hover:from-primary-600 hover:to-primary-500 inline-block px-6 py-2 rounded text-white to-primary-400">View More</a>
            </div> */}
          </div>
        </section>
      </main>
    </>
  );
}
