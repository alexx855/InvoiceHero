"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { TypewriterEffectSmooth } from "./HeroHighlight";
import { TextGenerateEffect } from "./TypeWriteEffect";
import Login from "./Login";
const words = [
  {
    text: "Invoice",
  },

  {
    text: "Hero",
    className: "text-blue-800 dark:text-violet-800",
  },
];
const Landing = () => {
  return (
    <div>
      <div className="flex z-[-2] absolute top-0 left-0">
        <span className="flex from-gray-500 to-transparent bg-gradient-to-b w-[1.1px] h-[70vh] mx-20"></span>
        <span className="flex from-gray-500 to-transparent bg-gradient-to-b w-[1.1px] h-[70vh] mx-20"></span>
        <span className="flex from-gray-500 to-transparent bg-gradient-to-b w-[1.1px] h-[70vh] mx-20"></span>
      </div>
      <div className="flex z-[-2] absolute top-0 right-0">
        <span className="flex from-gray-500 to-transparent bg-gradient-to-b w-[1.1px] h-[70vh] mx-20"></span>
        <span className="flex from-gray-500 to-transparent bg-gradient-to-b w-[1.1px] h-[70vh] mx-20"></span>
        <span className="flex from-gray-500 to-transparent bg-gradient-to-b w-[1.1px] h-[70vh] mx-20"></span>
      </div>
      <section className="relative w-full" id="hero">
        <section className="-mb-20">
          <div className="items-center flex relative max-w-7xl mx-auto w-full lg:px-16 md:px-12 lg:pb-24 lg:pt-30 pb-12 pt-28 px-5">
            <div className="max-w-5xl mx-auto">
              <div className="md:text-center text-left">
                <div className="max-w-4xl gap-6 lg:gap-12 lg:items-end mx-auto">
                  <div className=" flex flex-col justify-center items-center">
                    <TypewriterEffectSmooth words={words} />
                    <TextGenerateEffect
                      words={`Create & share professional invoices in seconds, totally free! Sign in to unlock blockchain-powered security, crypto payments, and more.
                    `}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <svg
          data-theme="dark"
          viewBox="0 0 1371 131"
          xmlns="http://www.w3.org/2000/svg"
          className="css-54dvsu"
        >
          <g opacity="0.12">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M1283.29 61.2456L1370.47 107.883L1369.53 109.646L1279.05 61.2456H1087.11L1171.44 125.875L1170.22 127.462L1083.82 61.2456H922.641L975.373 128.246H1368.48V131.246H2.4845V128.246H192.484L279.477 61.2456H75.3353L1.45309 99.0025L0.542969 97.2216L70.9403 61.2456H2.4845V59.2456H74.8539L186.391 2.24561H2.4845V0.245605H1007.18L1007.3 0.0880319L1007.51 0.245605H1168.67L1168.8 0L1169.26 0.245605H1368.48V2.24561H1173L1279.55 59.2456H1368.48V61.2456H1283.29ZM1275.31 59.2456L1168.76 2.24561H1010.12L1084.5 59.2456H1275.31ZM1081.21 59.2456L1006.83 2.24561H876.205L921.067 59.2456H1081.21ZM918.522 59.2456L873.796 2.41838L874.015 2.24561H777.385L797.8 59.2456H918.522ZM795.676 59.2456L775.26 2.24561H603.759L603.9 2.31296L576.697 59.2456H795.676ZM796.392 61.2456L820.389 128.246H543.728L575.742 61.2456H796.392ZM822.513 128.246L798.517 61.2456H920.096L972.828 128.246H822.513ZM187.953 3.69316L187.213 2.24561H356.083L282.073 59.2456H79.2488L187.953 3.69316ZM357.608 3.59496L356.569 2.24561H485.937L440.961 59.2456H285.351L357.608 3.59496ZM488.283 2.50128L487.959 2.24561H601.716L574.481 59.2456H443.508L488.283 2.50128ZM441.93 61.2456H573.525L541.596 128.069L541.964 128.246H389.063L441.93 61.2456ZM439.382 61.2456L386.515 128.246H195.761L282.754 61.2456H439.382Z"
              fill="white"
            ></path>
          </g>
          <rect
            x="220.999"
            y="59.7456"
            width="931"
            height="1"
            fill="url(#paint1_linear_3597_5639)"
            fillOpacity="0.6"
          ></rect>
          <defs>
            <linearGradient
              id="paint0_linear_3597_5639"
              x1="1391"
              y1="65.7452"
              x2="52.5002"
              y2="65.7453"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="white" stopOpacity="0"></stop>
              <stop
                offset="0.403742"
                stopColor="white"
                stopOpacity="0.505556"
              ></stop>
              <stop
                offset="0.479167"
                stopColor="white"
                stopOpacity="0.6"
              ></stop>
              <stop offset="1" stopColor="white" stopOpacity="0"></stop>
            </linearGradient>
            <linearGradient
              id="paint1_linear_3597_5639"
              x1="184.406"
              y1="62.9607"
              x2="184.556"
              y2="72.6672"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#191A1B"></stop>
              <stop offset="0.3125" stopColor="#18434E"></stop>
              <stop offset="0.697917" stopColor="#6C2F73"></stop>
              <stop offset="1" stopColor="#191A1B"></stop>
            </linearGradient>
          </defs>
        </svg>

        <Login/>
      </section>
    </div>
  );
};

export default Landing;
