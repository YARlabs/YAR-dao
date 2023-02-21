import { deployments, ethers } from 'hardhat'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { assert, expect } from 'chai'
import {
  WithdrawERC20Voting__factory,
  Dao,
  Dao__factory,
  VotingsFactory,
  VotingsFactory__factory,
  IERC20,
  IERC20__factory,
} from '../typechain-types'
import { ContractReceiptUtils } from '../utils/ContractReceiptUtils'
import { anyValue } from '@nomicfoundation/hardhat-chai-matchers/withArgs'
import { Provider } from '@ethersproject/providers'
import { BigNumber, ContractTransaction } from 'ethers'
import { time } from '@nomicfoundation/hardhat-network-helpers'
import {
  CRV3,
  DAI,
  FRAX,
  HBTC,
  LUSD,
  MIM,
  RENBTC,
  SBTC,
  USDC,
  USDT,
  WBTC,
  WETH,
} from '../constants/externalAddresses'
import ERC20MinterV2 from './utils/ERC20MinterV2'

const WITHDRAW_TOKENS_LIST = [
  DAI,
  USDC,
  USDT,
  WETH,
  WBTC,
  CRV3,
  FRAX,
  LUSD,
  MIM,
  RENBTC,
  HBTC,
  SBTC,
]

describe('WithdrawERC20Voting tests', () => {
  for (const tokenAddress of WITHDRAW_TOKENS_LIST) {
    describe(`WithdrawERC20Voting tests ${tokenAddress}`, () => {
      let initSnapshot: string
      let dao: Dao
      let votingsFactory: VotingsFactory

      let provider: Provider
      let owner: SignerWithAddress
      let notVotingUser: SignerWithAddress
      let recipeint: SignerWithAddress
      let donor: SignerWithAddress
      let votingUsers: Array<SignerWithAddress>
      let votingUsersCount: number
      let votingTimeout: number
      let token: IERC20

      before(async () => {
        const accounts = await ethers.getSigners()
        owner = accounts[0]
        votingUsers = accounts.slice(99, 199)
        notVotingUser = accounts[80]
        recipeint = accounts[81]
        donor = accounts[82]

        votingUsersCount = votingUsers.length

        await deployments.fixture(['Dao', 'VotingsFactory'])
        const DaoDeployment = await deployments.get('Dao')
        const VotingsFactoryDeployment = await deployments.get('VotingsFactory')

        provider = ethers.provider

        dao = Dao__factory.connect(DaoDeployment.address, provider)
        votingsFactory = VotingsFactory__factory.connect(VotingsFactoryDeployment.address, provider)
        token = IERC20__factory.connect(tokenAddress, provider)

        votingTimeout = (await dao.votingTimeout()).toNumber()

        initSnapshot = await ethers.provider.send('evm_snapshot', [])
      })

      afterEach(async () => {
        await ethers.provider.send('evm_revert', [initSnapshot])
        initSnapshot = await ethers.provider.send('evm_snapshot', [])
      })

      it('WithdrawERC20Voting regular: create vote', async () => {
        const initiator = votingUsers[0]
        const amount = ethers.utils.parseUnits('1', 18)
        const createVotingTx = await votingsFactory
          .connect(initiator)
          .createWithdrawERC20Voting(recipeint.address, tokenAddress, amount)
        await expect(createVotingTx).to.emit(votingsFactory, 'NewWithdrawERC20Voting').withArgs(
          anyValue, // contractAddress
          recipeint.address, // recipeint
          tokenAddress, // token
          amount, // amount
        )
      })

      it('WithdrawERC20Voting error: create with zero amount', async () => {
        const initiator = votingUsers[0]
        await expect(
          votingsFactory
            .connect(initiator)
            .createWithdrawERC20Voting(recipeint.address, tokenAddress, 0),
        ).to.be.revertedWith('WithdrawERC20Voting: amount = 0')
      })

      it('WithdrawERC20Voting error: not voting user create voting', async () => {
        const initiator = notVotingUser
        const amount = ethers.utils.parseUnits('1', 18)
        await expect(
          votingsFactory
            .connect(initiator)
            .createWithdrawERC20Voting(recipeint.address, tokenAddress, amount),
        ).to.be.revertedWith('Dao: only voting user')
      })

      it('WithdrawERC20Voting regular: accepted', async () => {
        const initiator = votingUsers[0]

        await ERC20MinterV2.mint(tokenAddress, dao.address, 100)
        const amount = await token.balanceOf(dao.address)
        const recipeintBalanceBefore = await token.balanceOf(recipeint.address)

        const createVotingTx = await votingsFactory
          .connect(initiator)
          .createWithdrawERC20Voting(recipeint.address, tokenAddress, amount)
        const createVotingReceipt = await createVotingTx.wait()
        const eventCreateVoting = ContractReceiptUtils.getEvent(
          createVotingReceipt.events,
          votingsFactory,
          votingsFactory.filters.NewWithdrawERC20Voting(),
        )
        const votingAddress = eventCreateVoting.args.contractAddress
        const votingsContract = WithdrawERC20Voting__factory.connect(votingAddress, provider)
        const acceptCount = Math.ceil(votingUsersCount / 2) + 1
        let lastVoteTx: ContractTransaction
        for (let i = 0; i < acceptCount; i++) {
          lastVoteTx = await votingsContract.connect(votingUsers[i]).accept()
        }
        const receipt = await lastVoteTx.wait()
        const votingFinishedEvent = ContractReceiptUtils.getEvent(
          receipt.events,
          votingsContract,
          votingsContract.filters.VotingFinished(),
        )
        assert(votingFinishedEvent.args.accepted, 'WithdrawERC20Voting voting not accepted!')
        assert(
          recipeintBalanceBefore.add(amount).eq(await token.balanceOf(recipeint.address)),
          'WithdrawERC20Voting: token not transfered!',
        )
      })

      it('WithdrawERC20Voting regular: accepted queue', async () => {
        const initiator = votingUsers[0]

        await ERC20MinterV2.mint(tokenAddress, donor.address, 100)
        const amount = await token.balanceOf(donor.address)
        const recipeintBalanceBefore = await token.balanceOf(recipeint.address)

        const createVotingTx = await votingsFactory
          .connect(initiator)
          .createWithdrawERC20Voting(recipeint.address, tokenAddress, amount)
        const createVotingReceipt = await createVotingTx.wait()
        const eventCreateVoting = ContractReceiptUtils.getEvent(
          createVotingReceipt.events,
          votingsFactory,
          votingsFactory.filters.NewWithdrawERC20Voting(),
        )
        const votingAddress = eventCreateVoting.args.contractAddress
        const votingsContract = WithdrawERC20Voting__factory.connect(votingAddress, provider)
        const acceptCount = Math.ceil(votingUsersCount / 2) + 1
        let lastVoteTx: ContractTransaction
        for (let i = 0; i < acceptCount; i++) {
          lastVoteTx = await votingsContract.connect(votingUsers[i]).accept()
        }
        const receipt = await lastVoteTx.wait()
        const votingFinishedEvent = ContractReceiptUtils.getEvent(
          receipt.events,
          votingsContract,
          votingsContract.filters.VotingFinished(),
        )
        assert(votingFinishedEvent.args.accepted, 'WithdrawERC20Voting voting not accepted!')
        assert(
          recipeintBalanceBefore.eq(await token.balanceOf(recipeint.address)),
          'WithdrawERC20Voting: token transfered!',
        )

        await token.connect(donor).transfer(dao.address, amount)

        await dao.connect(initiator).withdrawERC20FromQueue(tokenAddress)

        assert(
          recipeintBalanceBefore.add(amount).eq(await token.balanceOf(recipeint.address)),
          'WithdrawERC20Voting: token not transfered!',
        )
      })

      it('WithdrawVoting regular: multi requests in queue', async () => {
        const initiator = votingUsers[0]

        await ERC20MinterV2.mint(tokenAddress, donor.address, 100000)
        const amount = await token.balanceOf(donor.address)

        const amount1 = amount.mul(2).div(3)
        const amount2 = amount.mul(1).div(3)

        const recipeintBalanceBefore = await token.balanceOf(recipeint.address)

        for (const amount of [amount1, amount2]) {
          const createVotingTx = await votingsFactory
            .connect(initiator)
            .createWithdrawERC20Voting(recipeint.address, tokenAddress, amount)
          const createVotingReceipt = await createVotingTx.wait()
          const eventCreateVoting = ContractReceiptUtils.getEvent(
            createVotingReceipt.events,
            votingsFactory,
            votingsFactory.filters.NewWithdrawERC20Voting(),
          )
          const votingAddress = eventCreateVoting.args.contractAddress
          const votingsContract = WithdrawERC20Voting__factory.connect(votingAddress, provider)
          const acceptCount = Math.ceil(votingUsersCount / 2) + 1
          for (let i = 0; i < acceptCount; i++) {
            await votingsContract.connect(votingUsers[i]).accept()
          }
        }

        await token.connect(donor).transfer(dao.address, amount2)
        await dao.connect(initiator).withdrawERC20FromQueue(tokenAddress)

        assert(
          recipeintBalanceBefore.eq(await token.balanceOf(recipeint.address)),
          'WithdrawERC20Voting: token transfered(1)!',
        )

        await token.connect(donor).transfer(dao.address, amount1)
        await dao.connect(initiator).withdrawERC20FromQueue(tokenAddress)

        assert(
          recipeintBalanceBefore.add(amount1).eq(await token.balanceOf(recipeint.address)),
          'WithdrawERC20Voting: token transfered(2)!',
        )

        await dao.connect(initiator).withdrawERC20FromQueue(tokenAddress)

        assert(
          recipeintBalanceBefore
            .add(amount1)
            .add(amount2)
            .eq(await token.balanceOf(recipeint.address)),
          'WithdrawERC20Voting: token transfered(3)!',
        )
      })

      it('WithdrawERC20Voting error: withdraw queue without voting', async () => {
        const initiator = votingUsers[0]
        await expect(dao.connect(initiator).withdrawFromQueue()).to.be.revertedWith(
          'Dao: not has requests in queue',
        )
      })

      it('WithdrawERC20Voting regular: rejected', async () => {
        const initiator = votingUsers[0]

        await ERC20MinterV2.mint(tokenAddress, dao.address, 100)
        const amount = await token.balanceOf(dao.address)
        const recipeintBalanceBefore = await token.balanceOf(recipeint.address)
        const daoBalanceBefore = await token.balanceOf(dao.address)

        const createVotingTx = await votingsFactory
          .connect(initiator)
          .createWithdrawERC20Voting(recipeint.address, tokenAddress, amount)
        const createVotingReceipt = await createVotingTx.wait()
        const eventCreateVoting = ContractReceiptUtils.getEvent(
          createVotingReceipt.events,
          votingsFactory,
          votingsFactory.filters.NewWithdrawERC20Voting(),
        )
        const votingAddress = eventCreateVoting.args.contractAddress
        const votingsContract = WithdrawERC20Voting__factory.connect(votingAddress, provider)
        const acceptCount = Math.ceil(votingUsersCount / 2) + 1
        const rejectCount = votingUsersCount - acceptCount
        let lastVoteTx: ContractTransaction
        for (let i = 0; i < rejectCount; i++) {
          lastVoteTx = await votingsContract.connect(votingUsers[i]).reject()
        }
        const receipt = await lastVoteTx.wait()
        const votingFinishedEvent = ContractReceiptUtils.getEvent(
          receipt.events,
          votingsContract,
          votingsContract.filters.VotingFinished(),
        )
        assert(!votingFinishedEvent.args.accepted, 'WithdrawERC20Voting: voting not rejected!')
        assert(
          recipeintBalanceBefore.eq(await token.balanceOf(recipeint.address)),
          'WithdrawERC20Voting: token transfered!',
        )
        assert(
          daoBalanceBefore.eq(await token.balanceOf(dao.address)),
          'WithdrawERC20Voting: dao balance changed!',
        )
      })

      it('WithdrawERC20Voting error: double vote', async () => {
        const initiator = votingUsers[0]
        const amount = ethers.utils.parseUnits('1', 18)
        const createVotingTx = await votingsFactory
          .connect(initiator)
          .createWithdrawERC20Voting(recipeint.address, tokenAddress, amount)
        const createVotingReceipt = await createVotingTx.wait()
        const eventCreateVoting = ContractReceiptUtils.getEvent(
          createVotingReceipt.events,
          votingsFactory,
          votingsFactory.filters.NewWithdrawERC20Voting(),
        )
        const votingAddress = eventCreateVoting.args.contractAddress
        const votingsContract = WithdrawERC20Voting__factory.connect(votingAddress, provider)
        // Accept vote
        await votingsContract.connect(votingUsers[0]).accept()
        await expect(
          votingsContract.connect(votingUsers[0]).accept(),
          'Double accept vote',
        ).to.be.revertedWith('Voting: already vote!')
        // Reject vote
        await votingsContract.connect(votingUsers[1]).reject()
        await expect(
          votingsContract.connect(votingUsers[1]).reject(),
          'Double reject vote',
        ).to.be.revertedWith('Voting: already vote!')
      })

      it('WithdrawERC20Voting error: vote not voting user', async () => {
        const initiator = votingUsers[0]
        const amount = ethers.utils.parseUnits('1', 18)
        const createVotingTx = await votingsFactory
          .connect(initiator)
          .createWithdrawERC20Voting(recipeint.address, tokenAddress, amount)
        const createVotingReceipt = await createVotingTx.wait()
        const eventCreateVoting = ContractReceiptUtils.getEvent(
          createVotingReceipt.events,
          votingsFactory,
          votingsFactory.filters.NewWithdrawERC20Voting(),
        )
        const votingAddress = eventCreateVoting.args.contractAddress
        const votingsContract = WithdrawERC20Voting__factory.connect(votingAddress, provider)
        // Accept vote
        await expect(votingsContract.connect(notVotingUser).accept()).to.be.revertedWith(
          'Dao: only voting user',
        )
        // Reject vote
        await expect(votingsContract.connect(notVotingUser).reject()).to.be.revertedWith(
          'Dao: only voting user',
        )
      })

      it('WithdrawERC20Voting error: vote after over', async () => {
        const initiator = votingUsers[0]
        const amount = ethers.utils.parseUnits('1', 18)
        const createVotingTx = await votingsFactory
          .connect(initiator)
          .createWithdrawERC20Voting(recipeint.address, tokenAddress, amount)
        const createVotingReceipt = await createVotingTx.wait()
        const eventCreateVoting = ContractReceiptUtils.getEvent(
          createVotingReceipt.events,
          votingsFactory,
          votingsFactory.filters.NewWithdrawERC20Voting(),
        )
        const votingAddress = eventCreateVoting.args.contractAddress
        const votingsContract = WithdrawERC20Voting__factory.connect(votingAddress, provider)
        const acceptCount = Math.ceil(votingUsersCount / 2) + 1
        for (let i = 0; i < acceptCount; i++) {
          await votingsContract.connect(votingUsers[i]).accept()
        }
        await expect(
          votingsContract.connect(votingUsers[acceptCount + 1]).accept(),
        ).to.be.revertedWith('Voting: is over!')
      })

      it('WithdrawERC20Voting error: vote after expiry', async () => {
        const initiator = votingUsers[0]
        const amount = ethers.utils.parseUnits('1', 18)
        const createVotingTx = await votingsFactory
          .connect(initiator)
          .createWithdrawERC20Voting(recipeint.address, tokenAddress, amount)
        const createVotingReceipt = await createVotingTx.wait()
        const eventCreateVoting = ContractReceiptUtils.getEvent(
          createVotingReceipt.events,
          votingsFactory,
          votingsFactory.filters.NewWithdrawERC20Voting(),
        )
        const votingAddress = eventCreateVoting.args.contractAddress
        const votingsContract = WithdrawERC20Voting__factory.connect(votingAddress, provider)
        await time.increase(votingTimeout + 1)
        await expect(votingsContract.connect(votingUsers[0]).accept()).to.be.revertedWith(
          'Dao: voting expired!',
        )
      })
    })
  }
})
