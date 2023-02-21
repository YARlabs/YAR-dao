import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'

const deploy: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { ethers, deployments } = hre
  const { deploy, get } = deployments

  const signers = await ethers.getSigners()
  const deployer = signers[0]
  const votingUsers = signers.slice(99, 199).map(signer => signer.address)

  const VotingsFactoryDeployment = await get('VotingsFactory')
  
  const deployment = await deploy('Dao', {
    contract: 'Dao',
    from: deployer.address,
    args: [
      VotingsFactoryDeployment.address, // _votingsFactory
      votingUsers, // _votingUsers
      ethers.utils.parseUnits('0.1', 18), // 0.1 // _fee
      ethers.utils.parseUnits('0.51', 4), // 51% // _percentageOfVotesToConfirm
      ethers.utils.parseUnits('2', 18), // 2 // _validatorBlockRewards
      ethers.utils.parseUnits('200000', 18), // 200 000 // _validatorStakeAmount
      365 * 24 * 60 * 60, // 1 year // _validatorStakeTimeout
      3 * 24 * 60 * 60, // 3 days // _votingTimeout
    ]
  })
}

deploy.tags = ['Dao']
deploy.dependencies = ['VotingsFactory']
export default deploy
