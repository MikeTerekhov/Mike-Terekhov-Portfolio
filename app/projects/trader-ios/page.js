"use client"; // This is a client component 👈🏽
import { useState } from "react";
import game_over from "@/public/images/game_over.png";
import {useEffect } from 'react';

function TraderIOS() {
  return (
    <>

    <div >
      <div className='bg-gray-900 md:px-20 lg:px-40'>
          <div>
            <h3 style={{ textAlign: 'center' }} className="text-white text-7xl py-8 px-4 font-droidMono">Stock Trader IOS</h3>
          </div>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                            <video width="700" height="600" controls>
                                <source src="/videos/vid.mp4" type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                            </div>
      </div>
    </div>
    </>
  )
}
export default TraderIOS;
