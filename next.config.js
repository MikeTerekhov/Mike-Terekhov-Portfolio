/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
    {
        "source": "/TraderIOS",
        "destination": "/projects/trader-ios",
        "permanent": true
    },
    {
        "source": "/ChessPage",
        "destination": "/projects/chess",
        "permanent": true
    },
    {
        "source": "/Pytux",
        "destination": "/projects/pytux",
        "permanent": true
    },
    {
        "source": "/DocRead",
        "destination": "/projects/doc-read",
        "permanent": true
    },
    {
        "source": "/GoosePage",
        "destination": "/projects/goose-chaser",
        "permanent": true
    },
    {
        "source": "/MemoryGame",
        "destination": "/projects/memory-game",
        "permanent": true
    },
    {
        "source": "/JobPage",
        "destination": "/work",
        "permanent": true
    },
    {
        "source": "/QualityPage",
        "destination": "/quality",
        "permanent": true
    },
    {
        "source": "/sports",
        "destination": "/books",
        "permanent": true
    }
];
  },
};

module.exports = nextConfig;
