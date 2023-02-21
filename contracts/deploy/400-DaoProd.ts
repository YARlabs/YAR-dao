import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'

const deploy: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { ethers, deployments } = hre
  const { deploy, get } = deployments

  const signers = await ethers.getSigners()
  const deployer = signers[0]
  const votingUsers = [
    '0x362D62eDAc5bdeBA614982E8c5E6dE26331d6812',
    '0xEB0017C2B26cBF12d06154f28011bdb0C532C0F7',
    '0xe39EEc47c2Af70638A9E848B8b64A3d9cCc5B9A0',
    '0x31E2Ab6b86Be3c262CdfB61C5704e1dd35B76513',
    '0xE0D18Ee8b031Cf85C4C990f14026A2df1663294d',
    '0x1383CFF17d5d7B497af26158D72c0c9FEf158BBF',
    '0x6006B315e2AD510F26587B3701285C045917cB07',
    '0x0Ae074dc89BFfc44968AC988f50DaF7b3fFFF203',
    '0xF496314E91217eFB1D2e21a50116945Bd6BF45aa',
    '0x706686BE441e637c7be9883EE69C21e4b5a8a5Bd',
  ]

  const VotingsFactoryDeployment = await get('VotingsFactory')

  const deployment = await deploy('DaoProd', {
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
    ],
  })
}

deploy.tags = ['DaoProd']
deploy.dependencies = ['VotingsFactory']
export default deploy
