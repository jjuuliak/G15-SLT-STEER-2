import React from "react";
import { Box, Typography } from "@mui/material";

const LifelineImage = () => {

  return (
    <Box // Box for Text and heartbeat
      sx={{
        marginRight: 13,
        position: "relative"
      }}>

      <Box // Box for heartbeat svg
        sx={{
          position: "absolute",
          top: '16%',
          left: '70px',
          width: '90%',
          opacity: 0.6,

        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="460"
          height="144"
          viewBox="0 0 460 144"
          fill="none"
        >
          <g filter="url(#filter0_d_121_346)">
            <path
              d="M4 79.5H216.5L224 69.5L233 79.5H238.5L240 83L241.5 79.5L263 1L269 135L287.5 69.5L294.5 79.5H462.5"
              stroke="url(#paint0_linear_121_346)"
              strokeWidth="2"
              shapeRendering="crispEdges"
            />
          </g>
          <defs>
            <filter
              id="filter0_d_121_346"
              x="0"
              y="0.73584"
              width="466.5"
              height="142.536"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="4" />
              <feGaussianBlur stdDeviation="2" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
              />
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_121_346" />
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_121_346" result="shape" />
            </filter>
            <linearGradient
              id="paint0_linear_121_346"
              x1="4"
              y1="68"
              x2="462.5"
              y2="68"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="white" stopOpacity="0" />
              <stop offset="0.3" stopColor="white" />
              <stop offset="0.7" stopColor="white" />
              <stop offset="1" stopColor="white" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

      </Box>
      <Typography
        sx={{
          background: 'linear-gradient(180deg, #FFF 0%, rgba(255, 255, 255, 0.44) 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontSize: '4.5rem',
          fontWeight: 500,
        }}>
        LIFELINE
      </Typography>

      <Typography
        sx={{
          background: 'linear-gradient(180deg, #FFF 0%, rgba(255, 255, 255, 0.44) 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontSize: '3rem',
          fontWeight: 500,
        }}>
        For your heart.
      </Typography>
    </Box>
  );
}

export default LifelineImage;