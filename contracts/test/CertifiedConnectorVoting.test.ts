import { deployments, ethers } from 'hardhat'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { assert, expect } from 'chai'
import {
  CertifiedConnectorVoting__factory,
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


describe(`CertifiedConnectorVoting tests`, () => {
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

  it('CertifiedConnectorVoting regular: create vote [value:true]', async () => {
    const initiator = votingUsers[0]
    const connectorName = 'Connector name'
    const connectorHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(connectorName))
    const value = true
    const createVotingTx = await votingsFactory.connect(initiator).createCertifiedConnectorVoting(connectorHash, value)
    await expect(createVotingTx).to.emit(votingsFactory, 'NewCertifiedConnectorVoting').withArgs(
      anyValue, // contractAddress
      connectorHash, // textHash
      value, // value
    )
  })

  it('CertifiedConnectorVoting regular: create vote [value:false]', async () => {
    const initiator = votingUsers[0]
    const connectorName = 'Connector name'
    const connectorHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(connectorName))
    const value = false
    const createVotingTx = await votingsFactory.connect(initiator).createCertifiedConnectorVoting(connectorHash, value)
    await expect(createVotingTx).to.emit(votingsFactory, 'NewCertifiedConnectorVoting').withArgs(
      anyValue, // contractAddress
      connectorHash, // textHash
      value, // value
    )
  })
  
  it('CertifiedConnectorVoting error: not voting user create voting', async () => {
    const initiator = notVotingUser
    const connectorName = 'Connector name'
    const connectorHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(connectorName))
    const value = true
    await expect(
      votingsFactory.connect(initiator).createCertifiedConnectorVoting(connectorHash, value),
    ).to.be.revertedWith('Dao: only voting user')
  })

  it('CertifiedConnectorVoting regular: accepted [value:true]', async () => {
    const initiator = votingUsers[0]
    const connectorName = 'Connector name'
    const connectorHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(connectorName))
    const value = true
    const createVotingTx = await votingsFactory.connect(initiator).createCertifiedConnectorVoting(connectorHash, value)
    const createVotingReceipt = await createVotingTx.wait()
    const eventCreateVoting = ContractReceiptUtils.getEvent(
      createVotingReceipt.events,
      votingsFactory,
      votingsFactory.filters.NewCertifiedConnectorVoting(),
    )
    const votingAddress = eventCreateVoting.args.contractAddress
    const votingsContract = CertifiedConnectorVoting__factory.connect(votingAddress, provider)
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
    assert(votingFinishedEvent.args.accepted, 'CertifiedConnectorVoting voting not accepted!')
    assert(await dao.certifiedConnectors(connectorHash) == value, 'CertifiedConnectorVoting: Dao not updated!')
  })

  it('CertifiedConnectorVoting regular: accepted [value:false]', async () => {
    const initiator = votingUsers[0]
    const connectorName = 'Connector name'
    const connectorHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(connectorName))
    const value = false
    const createVotingTx = await votingsFactory.connect(initiator).createCertifiedConnectorVoting(connectorHash, value)
    const createVotingReceipt = await createVotingTx.wait()
    const eventCreateVoting = ContractReceiptUtils.getEvent(
      createVotingReceipt.events,
      votingsFactory,
      votingsFactory.filters.NewCertifiedConnectorVoting(),
    )
    const votingAddress = eventCreateVoting.args.contractAddress
    const votingsContract = CertifiedConnectorVoting__factory.connect(votingAddress, provider)
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
    assert(votingFinishedEvent.args.accepted, 'CertifiedConnectorVoting voting not accepted!')
    assert(await dao.certifiedConnectors(connectorHash) == value, 'CertifiedConnectorVoting: Dao not updated!')
  })

  it('CertifiedConnectorVoting regular: rejected', async () => {
    const initiator = votingUsers[0]
    const connectorName = 'Connector name'
    const connectorHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(connectorName))
    const value = true
    const createVotingTx = await votingsFactory.connect(initiator).createCertifiedConnectorVoting(connectorHash, value)
    const createVotingReceipt = await createVotingTx.wait()
    const eventCreateVoting = ContractReceiptUtils.getEvent(
      createVotingReceipt.events,
      votingsFactory,
      votingsFactory.filters.NewCertifiedConnectorVoting(),
    )
    const votingAddress = eventCreateVoting.args.contractAddress
    const votingsContract = CertifiedConnectorVoting__factory.connect(votingAddress, provider)
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
    assert(!votingFinishedEvent.args.accepted, 'CertifiedConnectorVoting voting not rejected!')
    assert(!(await dao.certifiedConnectors(connectorHash)), 'CertifiedConnectorVoting: Dao updated!')
  })

  it('CertifiedConnectorVoting error: double vote', async () => {
    const initiator = votingUsers[0]
    const connectorName = 'Connector name'
    const connectorHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(connectorName))
    const value = true
    const createVotingTx = await votingsFactory.connect(initiator).createCertifiedConnectorVoting(connectorHash, value)
    const createVotingReceipt = await createVotingTx.wait()
    const eventCreateVoting = ContractReceiptUtils.getEvent(
      createVotingReceipt.events,
      votingsFactory,
      votingsFactory.filters.NewCertifiedConnectorVoting(),
    )
    const votingAddress = eventCreateVoting.args.contractAddress
    const votingsContract = CertifiedConnectorVoting__factory.connect(votingAddress, provider)
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

  it('CertifiedConnectorVoting error: vote not voting user', async () => {
    const initiator = votingUsers[0]
    const connectorName = 'Connector name'
    const connectorHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(connectorName))
    const value = true
    const createVotingTx = await votingsFactory.connect(initiator).createCertifiedConnectorVoting(connectorHash, value)
    const createVotingReceipt = await createVotingTx.wait()
    const eventCreateVoting = ContractReceiptUtils.getEvent(
      createVotingReceipt.events,
      votingsFactory,
      votingsFactory.filters.NewCertifiedConnectorVoting(),
    )
    const votingAddress = eventCreateVoting.args.contractAddress
    const votingsContract = CertifiedConnectorVoting__factory.connect(votingAddress, provider)
    // Accept vote
    await expect(votingsContract.connect(notVotingUser).accept()).to.be.revertedWith(
      'Dao: only voting user',
    )
    // Reject vote
    await expect(votingsContract.connect(notVotingUser).reject()).to.be.revertedWith(
      'Dao: only voting user',
    )
  })

  it('CertifiedConnectorVoting error: vote after over', async () => {
    const initiator = votingUsers[0]
    const connectorName = 'Connector name'
    const connectorHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(connectorName))
    const value = true
    const createVotingTx = await votingsFactory.connect(initiator).createCertifiedConnectorVoting(connectorHash, value)
    const createVotingReceipt = await createVotingTx.wait()
    const eventCreateVoting = ContractReceiptUtils.getEvent(
      createVotingReceipt.events,
      votingsFactory,
      votingsFactory.filters.NewCertifiedConnectorVoting(),
    )
    const votingAddress = eventCreateVoting.args.contractAddress
    const votingsContract = CertifiedConnectorVoting__factory.connect(votingAddress, provider)
    const acceptCount = Math.ceil(votingUsersCount / 2) + 1
    for (let i = 0; i < acceptCount; i++) {
      await votingsContract.connect(votingUsers[i]).accept()
    }
    await expect(votingsContract.connect(votingUsers[acceptCount + 1]).accept()).to.be.revertedWith(
      'Voting: is over!',
    )
  })

  it('CertifiedConnectorVoting error: vote after expiry', async () => {
    const initiator = votingUsers[0]
    const connectorName = 'Connector name'
    const connectorHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(connectorName))
    const value = true
    const createVotingTx = await votingsFactory.connect(initiator).createCertifiedConnectorVoting(connectorHash, value)
    const createVotingReceipt = await createVotingTx.wait()
    const eventCreateVoting = ContractReceiptUtils.getEvent(
      createVotingReceipt.events,
      votingsFactory,
      votingsFactory.filters.NewCertifiedConnectorVoting(),
    )
    const votingAddress = eventCreateVoting.args.contractAddress
    const votingsContract = CertifiedConnectorVoting__factory.connect(votingAddress, provider)
    await time.increase(votingTimeout + 1)
    await expect(votingsContract.connect(votingUsers[0]).accept()).to.be.revertedWith(
      'Dao: voting expired!',
    )
  })
})
