import { HardhatUserConfig } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'
import '@nomiclabs/hardhat-etherscan'
import 'hardhat-deploy'
import 'hardhat-gas-reporter'
import 'hardhat-tracer'
import 'hardhat-abi-exporter'
import '@nomicfoundation/hardhat-chai-matchers'
import 'hardhat-contract-sizer'


const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: '0.8.17',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
          viaIR: true,
        },
      },
    ],
  },
  networks: {
    hardhat: {
      chainId: 1337,
      forking: {
        url: 'https://mainnet.infura.io/v3/32c869b2294046f4931f3d8b93b2dae0',
        blockNumber: 16370780,
      },
      accounts: {
        count: 200,
        accountsBalance: '1000000000000000000000000000',
      },
      loggingEnabled: true,
    },
    yarTest: {
      chainId: 10226688,
      url: 'https://rpc1.testnet.yarchain.org',
      accounts: [
        '0x983a9c1c23e858a4e13f3d30831d865d0cf600a45db11e255cd4ac8345c661f0'
      ]
    },
  },
  abiExporter: {
    path: './abi',
  },
  gasReporter: {
    enabled: true,
    currency: 'USD',
    gasPrice: 30,
  },
  mocha: {
    timeout: 100000000,
  },
}

export default config
