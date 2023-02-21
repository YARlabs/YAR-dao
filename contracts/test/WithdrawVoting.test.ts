import { deployments, ethers } from 'hardhat'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { assert, expect } from 'chai'
import {
  WithdrawVoting__factory,
  Dao,
  Dao__factory,
  VotingsFactory,
  VotingsFactory__factory,
} from '../typechain-types'
import { ContractReceiptUtils } from '../utils/ContractReceiptUtils'
import { anyValue } from '@nomicfoundation/hardhat-chai-matchers/withArgs'
import { Provider } from '@ethersproject/providers'
import { BigNumber, ContractTransaction } from 'ethers'
import { time } from '@nomicfoundation/hardhat-network-helpers'

describe(`WithdrawVoting tests`, () => {
  let initSnapshot: string
  let dao: Dao
  let votingsFactory: VotingsFactory

  let provider: Provider
  let owner: SignerWithAddress
  let notVotingUser: SignerWithAddress
  let recipeint: SignerWithAddress
  let votingUsers: Array<SignerWithAddress>
  let votingUsersCount: number
  let votingTimeout: number
  let amount: BigNumber

  before(async () => {
    const accounts = await ethers.getSigners()
    owner = accounts[0]
    votingUsers = accounts.slice(99, 199)
    notVotingUser = accounts[80]
    recipeint = accounts[81]

    amount = ethers.utils.parseUnits('1', 18)

    votingUsersCount = votingUsers.length

    await deployments.fixture(['Dao', 'VotingsFactory'])
    const DaoDeployment = await deployments.get('Dao')
    const VotingsFactoryDeployment = await deployments.get('VotingsFactory')

    provider = ethers.provider

    dao = Dao__factory.connect(DaoDeployment.address, provider)
    votingsFactory = VotingsFactory__factory.connect(VotingsFactoryDeployment.address, provider)

    votingTimeout = (await dao.votingTimeout()).toNumber()

    initSnapshot = await ethers.provider.send('evm_snapshot', [])
  })

  afterEach(async () => {
    await ethers.provider.send('evm_revert', [initSnapshot])
    initSnapshot = await ethers.provider.send('evm_snapshot', [])
  })

  it('WithdrawVoting regular: create vote', async () => {
    const initiator = votingUsers[0]
    const createVotingTx = await votingsFactory
      .connect(initiator)
      .createWithdrawVoting(recipeint.address, amount)
    await expect(createVotingTx).to.emit(votingsFactory, 'NewWithdrawVoting').withArgs(
      anyValue, // contractAddress
      recipeint.address, // recipeint
      amount, // amount
    )
  })

  it('WithdrawVoting error: create with zero amount', async () => {
    const initiator = votingUsers[0]
    await expect(
      votingsFactory.connect(initiator).createWithdrawVoting(recipeint.address, 0),
    ).to.be.revertedWith('WithdrawVoting: amount = 0')
  })

  it('WithdrawVoting error: not voting user create voting', async () => {
    const initiator = notVotingUser
    await expect(
      votingsFactory.connect(initiator).createWithdrawVoting(recipeint.address, amount),
    ).to.be.revertedWith('Dao: only voting user')
  })

  it('WithdrawVoting regular: accepted', async () => {
    const initiator = votingUsers[0]

    await initiator.sendTransaction({
      to: dao.address,
      value: amount,
    })

    const recipeintBalanceBefore = await recipeint.getBalance()

    const createVotingTx = await votingsFactory
      .connect(initiator)
      .createWithdrawVoting(recipeint.address, amount)
    const createVotingReceipt = await createVotingTx.wait()
    const eventCreateVoting = ContractReceiptUtils.getEvent(
      createVotingReceipt.events,
      votingsFactory,
      votingsFactory.filters.NewWithdrawVoting(),
    )
    const votingAddress = eventCreateVoting.args.contractAddress
    const votingsContract = WithdrawVoting__factory.connect(votingAddress, provider)
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
    assert(votingFinishedEvent.args.accepted, 'WithdrawVoting voting not accepted!')
    assert(
      recipeintBalanceBefore.add(amount).eq(await recipeint.getBalance()),
      'WithdrawVoting: yar not transfered!',
    )
  })

  it('WithdrawVoting regular: accepted queue', async () => {
    const initiator = votingUsers[0]

    const recipeintBalanceBefore = await recipeint.getBalance()

    const createVotingTx = await votingsFactory
      .connect(initiator)
      .createWithdrawVoting(recipeint.address, amount)
    const createVotingReceipt = await createVotingTx.wait()
    const eventCreateVoting = ContractReceiptUtils.getEvent(
      createVotingReceipt.events,
      votingsFactory,
      votingsFactory.filters.NewWithdrawVoting(),
    )
    const votingAddress = eventCreateVoting.args.contractAddress
    const votingsContract = WithdrawVoting__factory.connect(votingAddress, provider)
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
    assert(votingFinishedEvent.args.accepted, 'WithdrawVoting voting not accepted!')
    assert(
      recipeintBalanceBefore.eq(await recipeint.getBalance()),
      'WithdrawVoting: yar transfered!',
    )

    await initiator.sendTransaction({
      to: dao.address,
      value: amount,
    })

    await dao.connect(initiator).withdrawFromQueue()

    assert(
      recipeintBalanceBefore.add(amount).eq(await recipeint.getBalance()),
      'WithdrawVoting: yar not transfered!',
    )
  })

  it('WithdrawVoting regular: multi requests in queue', async () => {
    const initiator = votingUsers[0]

    const recipeintBalanceBefore = await recipeint.getBalance()

    const amount1 = ethers.utils.parseUnits('200', 18)
    const amount2 = ethers.utils.parseUnits('100', 18)

    for (const amount of [amount1, amount2]) {
      const createVotingTx = await votingsFactory
        .connect(initiator)
        .createWithdrawVoting(recipeint.address, amount)
      const createVotingReceipt = await createVotingTx.wait()
      const eventCreateVoting = ContractReceiptUtils.getEvent(
        createVotingReceipt.events,
        votingsFactory,
        votingsFactory.filters.NewWithdrawVoting(),
      )
      const votingAddress = eventCreateVoting.args.contractAddress
      const votingsContract = WithdrawVoting__factory.connect(votingAddress, provider)
      const acceptCount = Math.ceil(votingUsersCount / 2) + 1
      for (let i = 0; i < acceptCount; i++) {
        await votingsContract.connect(votingUsers[i]).accept()
      }
    }

    await initiator.sendTransaction({
      to: dao.address,
      value: amount2,
    })

    await dao.connect(initiator).withdrawFromQueue()

    assert(
      recipeintBalanceBefore.eq(await recipeint.getBalance()),
      'WithdrawVoting: yar transfered(1)!',
    )

    await initiator.sendTransaction({
      to: dao.address,
      value: amount1,
    })

    await dao.connect(initiator).withdrawFromQueue()

    assert(
      recipeintBalanceBefore.add(amount1).eq(await recipeint.getBalance()),
      'WithdrawVoting: yar transfered(2)!',
    )

    await dao.connect(initiator).withdrawFromQueue()

    assert(
      recipeintBalanceBefore
        .add(amount1)
        .add(amount2)
        .eq(await recipeint.getBalance()),
      'WithdrawVoting: yar transfered(3)!',
    )
  })

  it('WithdrawVoting error: withdraw queue without voting', async () => {
    const initiator = votingUsers[0]
    await expect(dao.connect(initiator).withdrawFromQueue()).to.be.revertedWith(
      'Dao: not has requests in queue',
    )
  })

  it('WithdrawVoting regular: rejected', async () => {
    const initiator = votingUsers[0]

    await initiator.sendTransaction({
      to: dao.address,
      value: amount,
    })

    const daoBalanceBefore = await provider.getBalance(dao.address)
    const recipeintBalanceBefore = await recipeint.getBalance()

    const createVotingTx = await votingsFactory
      .connect(initiator)
      .createWithdrawVoting(recipeint.address, amount)
    const createVotingReceipt = await createVotingTx.wait()
    const eventCreateVoting = ContractReceiptUtils.getEvent(
      createVotingReceipt.events,
      votingsFactory,
      votingsFactory.filters.NewWithdrawVoting(),
    )
    const votingAddress = eventCreateVoting.args.contractAddress
    const votingsContract = WithdrawVoting__factory.connect(votingAddress, provider)
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
    assert(!votingFinishedEvent.args.accepted, 'WithdrawVoting: voting not rejected!')
    assert(
      recipeintBalanceBefore.eq(await recipeint.getBalance()),
      'WithdrawVoting: yar transfered!',
    )
    assert(
      daoBalanceBefore.eq(await provider.getBalance(dao.address)),
      'WithdrawVoting: dao balance changed!',
    )
  })

  it('WithdrawVoting error: double vote', async () => {
    const initiator = votingUsers[0]
    const createVotingTx = await votingsFactory
      .connect(initiator)
      .createWithdrawVoting(recipeint.address, amount)
    const createVotingReceipt = await createVotingTx.wait()
    const eventCreateVoting = ContractReceiptUtils.getEvent(
      createVotingReceipt.events,
      votingsFactory,
      votingsFactory.filters.NewWithdrawVoting(),
    )
    const votingAddress = eventCreateVoting.args.contractAddress
    const votingsContract = WithdrawVoting__factory.connect(votingAddress, provider)
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

  it('WithdrawVoting error: vote not voting user', async () => {
    const initiator = votingUsers[0]
    const createVotingTx = await votingsFactory
      .connect(initiator)
      .createWithdrawVoting(recipeint.address, amount)
    const createVotingReceipt = await createVotingTx.wait()
    const eventCreateVoting = ContractReceiptUtils.getEvent(
      createVotingReceipt.events,
      votingsFactory,
      votingsFactory.filters.NewWithdrawVoting(),
    )
    const votingAddress = eventCreateVoting.args.contractAddress
    const votingsContract = WithdrawVoting__factory.connect(votingAddress, provider)
    // Accept vote
    await expect(votingsContract.connect(notVotingUser).accept()).to.be.revertedWith(
      'Dao: only voting user',
    )
    // Reject vote
    await expect(votingsContract.connect(notVotingUser).reject()).to.be.revertedWith(
      'Dao: only voting user',
    )
  })

  it('WithdrawVoting error: vote after over', async () => {
    const initiator = votingUsers[0]
    const createVotingTx = await votingsFactory
      .connect(initiator)
      .createWithdrawVoting(recipeint.address, amount)
    const createVotingReceipt = await createVotingTx.wait()
    const eventCreateVoting = ContractReceiptUtils.getEvent(
      createVotingReceipt.events,
      votingsFactory,
      votingsFactory.filters.NewWithdrawVoting(),
    )
    const votingAddress = eventCreateVoting.args.contractAddress
    const votingsContract = WithdrawVoting__factory.connect(votingAddress, provider)
    const acceptCount = Math.ceil(votingUsersCount / 2) + 1
    for (let i = 0; i < acceptCount; i++) {
      await votingsContract.connect(votingUsers[i]).accept()
    }
    await expect(votingsContract.connect(votingUsers[acceptCount + 1]).accept()).to.be.revertedWith(
      'Voting: is over!',
    )
  })

  it('WithdrawVoting error: vote after expiry', async () => {
    const initiator = votingUsers[0]
    const createVotingTx = await votingsFactory
      .connect(initiator)
      .createWithdrawVoting(recipeint.address, amount)
    const createVotingReceipt = await createVotingTx.wait()
    const eventCreateVoting = ContractReceiptUtils.getEvent(
      createVotingReceipt.events,
      votingsFactory,
      votingsFactory.filters.NewWithdrawVoting(),
    )
    const votingAddress = eventCreateVoting.args.contractAddress
    const votingsContract = WithdrawVoting__factory.connect(votingAddress, provider)
    await time.increase(votingTimeout + 1)
    await expect(votingsContract.connect(votingUsers[0]).accept()).to.be.revertedWith(
      'Dao: voting expired!',
    )
  })
})
