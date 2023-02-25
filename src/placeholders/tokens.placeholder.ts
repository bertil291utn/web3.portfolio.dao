export const tokenMainPage = {
  description: "Gm gm ✋, welcome to BATL DAO - the ultimate spot for all you crypto-heads out there! Here, you can score some sick NFTs and become a part of our badass community. Grab your token now and watch it grow - soon, you'll be able to claim for our dope ERC20 token. Join us on this epic journey and help us create some seriously cool stuff.  So what are you waiting for? Let's make some crypto magic happen!",
  title: 'BATL DAO web3 ',
  buttonLabel: 'gimme my tokens',
};
export const tokenPageLabel = {
  title: 'Claim your 100 free tokens',
  description: (tokenSymbol: string | null) =>
    `With <b>$${tokenSymbol}</b> tokens, you'll able to rank, view repos, buy NFTs and get in touch with Bertil 😂. Furthermore with these tokens you're going to participate in our DAO. <i>(Goerli test network)</i>`,
  buttonLabel: 'gimme my tokens',
};

export const tokenModal = {
  description: 'Your transaction has just started. Wait until is finished',
  claiming: 'Claiming tokens ...',
};

export const getEth = {
  buttonLabel: 'Get GoerliETH',
  URL: 'https://goerlifaucet.com/',
};

export const NFTPage = {
  title: 'Buy or grab a free NFT',
  description: (tokenSymbol: string) =>
    `Grab a free one or buy with $${tokenSymbol} coins. You'll able to rank, view repos and get in touch with Bertil 😂. Furthermore with these tokens you're going to participate in our DAO.`,
  transferringNFT: 'Transferring NFT ...',
};

export const NFTTokensLoading = {
  approving: 'Approving ...',
  claiming: 'Claiming ...',
  approvingDescription:
    'This transaction needs to be approved, wait until wallet pops up again to finalize claiming transaction',
};
