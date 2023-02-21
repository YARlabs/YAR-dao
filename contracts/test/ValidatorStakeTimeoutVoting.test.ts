import { deployments, ethers } from 'hardhat'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { assert, expect } from 'chai'
import {
  ValidatorStakeTimeoutVoting__factory,
  Dao,
  Dao__factory,
  VotingsFactory,
  VotingsFactory__factory,
} from '../typechain-types'
import { ContractReceiptUtils } from '../utils/ContractReceiptUtils'
import { anyValue } from '@nomicfoundation/hardhat-chai-matchers/withArgs'
import { Provider } from '@ethersproject/providers'
import { ContractTransaction } from 'ethers'
import { time } from '@nomicfoundation/hardhat-network-helpers'


describe(`ValidatorStakeTimeoutVoting tests`, () => {
  let initSnapshot: string
  let dao: Dao
  let votingsFactory: VotingsFactory

  let provider: Provider
  let owner: SignerWithAddress
  let notVotingUser: SignerWithAddress
  let votingUsers: Array<SignerWithAddress>
  let votingUsersCount: number
  let votingTimeout: number

  before(async () => {
    const accounts = await ethers.getSigners()
    owner = accounts[0]
    votingUsers = accounts.slice(99, 199)
    notVotingUser = accounts[80]

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

  it('ValidatorStakeTimeoutVoting regular: create vote', async () => {
    const initiator = votingUsers[0]
    const newValidatorStakeTimeout = 2 * 365 * 24 * 60 * 60
    const createVotingTx = await votingsFactory.connect(initiator).createValidatorStakeTimeoutVoting(newValidatorStakeTimeout)
    await expect(createVotingTx).to.emit(votingsFactory, 'NewValidatorStakeTimeoutVoting').withArgs(
      anyValue, // contractAddress
      newValidatorStakeTimeout, // newValidatorStakeTimeout
    )
  })
  
  it('ValidatorStakeTimeoutVoting error: not voting user create voting', async () => {
    const initiator = notVotingUser
    const newValidatorStakeTimeout = 2 * 365 * 24 * 60 * 60
    await expect(
      votingsFactory.connect(initiator).createValidatorStakeTimeoutVoting(newValidatorStakeTimeout),
    ).to.be.revertedWith('Dao: only voting user')
  })

  it('ValidatorStakeTimeoutVoting regular: accepted', async () => {
    const initiator = votingUsers[0]
    const newValidatorStakeTimeout = 2 * 365 * 24 * 60 * 60
    const createVotingTx = await votingsFactory.connect(initiator).createValidatorStakeTimeoutVoting(newValidatorStakeTimeout)
    const createVotingReceipt = await createVotingTx.wait()
    const eventCreateVoting = ContractReceiptUtils.getEvent(
      createVotingReceipt.events,
      votingsFactory,
      votingsFactory.filters.NewValidatorStakeTimeoutVoting(),
    )
    const votingAddress = eventCreateVoting.args.contractAddress
    const votingsContract = ValidatorStakeTimeoutVoting__factory.connect(votingAddress, provider)
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
    assert(votingFinishedEvent.args.accepted, 'ValidatorStakeTimeoutVoting voting not accepted!')
    assert((await dao.validatorStakeTimeout()).eq(newValidatorStakeTimeout), 'ValidatorStakeTimeoutVoting: Dao not updated!')
  })

  it('ValidatorStakeTimeoutVoting regular: rejected', async () => {
    const initialValidatorStakeTimeout = await dao.validatorStakeTimeout()
    const initiator = votingUsers[0]
    const newValidatorStakeTimeout = 2 * 365 * 24 * 60 * 60
    const createVotingTx = await votingsFactory.connect(initiator).createValidatorStakeTimeoutVoting(newValidatorStakeTimeout)
    const createVotingReceipt = await createVotingTx.wait()
    const eventCreateVoting = ContractReceiptUtils.getEvent(
      createVotingReceipt.events,
      votingsFactory,
      votingsFactory.filters.NewValidatorStakeTimeoutVoting(),
    )
    const votingAddress = eventCreateVoting.args.contractAddress
    const votingsContract = ValidatorStakeTimeoutVoting__factory.connect(votingAddress, provider)
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
    assert(!votingFinishedEvent.args.accepted, 'ValidatorStakeTimeoutVoting: voting not rejected!')
    assert(initialValidatorStakeTimeout.eq(await dao.validatorStakeTimeout()), 'ValidatorStakeTimeoutVoting: Dao updated!')
  })

  it('ValidatorStakeTimeoutVoting error: double vote', async () => {
    const initiator = votingUsers[0]
    const newValidatorStakeTimeout = 2 * 365 * 24 * 60 * 60
    const createVotingTx = await votingsFactory.connect(initiator).createValidatorStakeTimeoutVoting(newValidatorStakeTimeout)
    const createVotingReceipt = await createVotingTx.wait()
    const eventCreateVoting = ContractReceiptUtils.getEvent(
      createVotingReceipt.events,
      votingsFactory,
      votingsFactory.filters.NewValidatorStakeTimeoutVoting(),
    )
    const votingAddress = eventCreateVoting.args.contractAddress
    const votingsContract = ValidatorStakeTimeoutVoting__factory.connect(votingAddress, provider)
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

  it('ValidatorStakeTimeoutVoting error: vote not voting user', async () => {
    const initiator = votingUsers[0]
    const newValidatorStakeTimeout = 2 * 365 * 24 * 60 * 60
    const createVotingTx = await votingsFactory.connect(initiator).createValidatorStakeTimeoutVoting(newValidatorStakeTimeout)
    const createVotingReceipt = await createVotingTx.wait()
    const eventCreateVoting = ContractReceiptUtils.getEvent(
      createVotingReceipt.events,
      votingsFactory,
      votingsFactory.filters.NewValidatorStakeTimeoutVoting(),
    )
    const votingAddress = eventCreateVoting.args.contractAddress
    const votingsContract = ValidatorStakeTimeoutVoting__factory.connect(votingAddress, provider)
    // Accept vote
    await expect(votingsContract.connect(notVotingUser).accept()).to.be.revertedWith(
      'Dao: only voting user',
    )
    // Reject vote
    await expect(votingsContract.connect(notVotingUser).reject()).to.be.revertedWith(
      'Dao: only voting user',
    )
  })

  it('ValidatorStakeTimeoutVoting error: vote after over', async () => {
    const initiator = votingUsers[0]
    const newValidatorStakeTimeout = 2 * 365 * 24 * 60 * 60
    const createVotingTx = await votingsFactory.connect(initiator).createValidatorStakeTimeoutVoting(newValidatorStakeTimeout)
    const createVotingReceipt = await createVotingTx.wait()
    const eventCreateVoting = ContractReceiptUtils.getEvent(
      createVotingReceipt.events,
      votingsFactory,
      votingsFactory.filters.NewValidatorStakeTimeoutVoting(),
    )
    const votingAddress = eventCreateVoting.args.contractAddress
    const votingsContract = ValidatorStakeTimeoutVoting__factory.connect(votingAddress, provider)
    const acceptCount = Math.ceil(votingUsersCount / 2) + 1
    for (let i = 0; i < acceptCount; i++) {
      await votingsContract.connect(votingUsers[i]).accept()
    }
    await expect(votingsContract.connect(votingUsers[acceptCount + 1]).accept()).to.be.revertedWith(
      'Voting: is over!',
    )
  })

  it('ValidatorStakeTimeoutVoting error: vote after expiry', async () => {
    const initiator = votingUsers[0]
    const newValidatorStakeTimeout = 2 * 365 * 24 * 60 * 60
    const createVotingTx = await votingsFactory.connect(initiator).createValidatorStakeTimeoutVoting(newValidatorStakeTimeout)
    const createVotingReceipt = await createVotingTx.wait()
    const eventCreateVoting = ContractReceiptUtils.getEvent(
      createVotingReceipt.events,
      votingsFactory,
      votingsFactory.filters.NewValidatorStakeTimeoutVoting(),
    )
    const votingAddress = eventCreateVoting.args.contractAddress
    const votingsContract = ValidatorStakeTimeoutVoting__factory.connect(votingAddress, provider)
    await time.increase(votingTimeout + 1)
    await expect(votingsContract.connect(votingUsers[0]).accept()).to.be.revertedWith(
      'Dao: voting expired!',
    )
  })
})
