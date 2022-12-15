export const ProfileLabel = {
  availableTokens: 'Available tokens',
  stakedTokens: 'Staked tokens',
  claimTokens: 'Claim tokens',
};

export const IdContent = {
  nfts: 'nfts',
  walletInfo: 'wallet-info',
  staking: 'staking',
};

export const ProfileSections = {
  NFTInfoTitle: 'My NFTs',
  NFTInfoSubtitle: 'My collected NFTs',
  walletInfoTitle: 'Wallet info',
  walletInfoSubtitle: 'Connection button and available tokens',
  stakingSectionTitle: 'Staking',
  stakingSectionSubtitle: (tokenSymbol) =>
    `Stake $${tokenSymbol} tokens to rate, view and be part of our DAO. Min 1 max 100`,
};

export const profileLoading = {
  approving: 'Approving ...',
  approvingDescription:
    'This transaction needs to be approved, wait until wallet pops up again to finalize staking transaction',
  staking: 'Staking ...',
  unStaking: 'Unstaking ...',
};
