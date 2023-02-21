import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'

const deploy: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { ethers, deployments } = hre
  const { deploy, get } = deployments

  const signers = await ethers.getSigners()
  const deployer = signers[0]

  const WithdrawVotingImplementationDeployment = await get('WithdrawVotingImplementation')
  const WithdrawERC20VotingImplementationDeployment = await get('WithdrawERC20VotingImplementation')
  const FeeVotingImplementationDeployment = await get('FeeVotingImplementation')
  const PercentageOfVotesToConfirmVotingImplementationDeployment = await get(
    'PercentageOfVotesToConfirmVotingImplementation',
  )
  const VotingTimeoutVotingImplementationDeployment = await get('VotingTimeoutVotingImplementation')
  const ValidatorStakeAmountVotingImplementationDeployment = await get(
    'ValidatorStakeAmountVotingImplementation',
  )
  const ValidatorStakeTimeoutVotingImplementationDeployment = await get(
    'ValidatorStakeTimeoutVotingImplementation',
  )
  const CustomTextVotingImplementationDeployment = await get('CustomTextVotingImplementation')
  const CertifiedConnectorVotingImplementationDeployment = await get(
    'CertifiedConnectorVotingImplementation',
  )
  const UnblockNodeVotingImplementationDeployment = await get('UnblockNodeVotingImplementation')
  const ValidatorBlockRewardsVotingImplementationDeployment = await get(
    'ValidatorBlockRewardsVotingImplementation',
  )

  const deployment = await deploy('VotingsFactory', {
    contract: 'VotingsFactory',
    from: deployer.address,
    args: [
      WithdrawVotingImplementationDeployment.address, // _withdrawVotingImplementation
      WithdrawERC20VotingImplementationDeployment.address, // _withdrawERC20VotingImplementation
      FeeVotingImplementationDeployment.address, // _feesVotingImplementation
      ValidatorStakeAmountVotingImplementationDeployment.address, // _validatorStakeAmountVotingImplementation
      ValidatorStakeTimeoutVotingImplementationDeployment.address, // _validatorStakeTimeoutVotingImplementation
      PercentageOfVotesToConfirmVotingImplementationDeployment.address, // _percentageOfVotesToConfirmVotingImplementation
      VotingTimeoutVotingImplementationDeployment.address, // _votingTimeoutVotingImplementation
      CustomTextVotingImplementationDeployment.address, // _customTextVotingImplementation
      CertifiedConnectorVotingImplementationDeployment.address, // _certifiedConnectorVotingImplementation
      UnblockNodeVotingImplementationDeployment.address, // _unblockNodeVotingImplementation
      ValidatorBlockRewardsVotingImplementationDeployment.address, // _validatorBlockRewardsVotingImplementation
    ],
  })
}

deploy.tags = ['VotingsFactory']
deploy.dependencies = [
  'WithdrawVotingImplementation',
  'WithdrawERC20VotingImplementation',
  'FeeVotingImplementation',
  'PercentageOfVotesToConfirmVotingImplementation',
  'VotingTimeoutVotingImplementation',
  'ValidatorStakeAmountVotingImplementation',
  'ValidatorStakeTimeoutVotingImplementation',
  'CustomTextVotingImplementation',
  'CertifiedConnectorVotingImplementation',
  'UnblockNodeVotingImplementation',
  'ValidatorBlockRewardsVotingImplementation',
]
export default deploy
