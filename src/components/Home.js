import React from 'react'
import ShopMenWomen from './ShopMenWomen'
import Hero from './Hero'
import BestSellers from './BestSellers'
import NewArrivals from './NewArrivals'
import Reviews from './Reviews'

function Home() {
  return (
    <div>
      <Hero/>
      <ShopMenWomen/>
      <BestSellers/>
      <NewArrivals/>
      <Reviews/>
    </div>
  )
}

export default Home
