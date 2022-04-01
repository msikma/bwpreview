#!/usr/bin/env node

// StarCraft map preview generator
// © MIT license

const {ArgumentParser} = require('argparse')
const {readJSON} = require('./lib/util')

const pkgData = readJSON(`${__dirname}/package.json`)
const parser = new ArgumentParser({
  description: `Retrieves data from StarCraft's internal webserver.`,
  add_help: true
})
parser.add_argument('-v', '--version', {action: 'version', version: pkgData.version})
parser.add_argument('-d', '--debug', {help: 'turns debugging on (logs the API calls being made)', action: 'store_true'})
parser.add_argument('--get-port', {help: 'prints the port currently used by StarCraft', dest: 'actionGetPort', action: 'store_true'})
parser.add_argument('--get-process', {help: 'prints the process ID currently used by StarCraft', dest: 'actionGetProcess', action: 'store_true'})
parser.add_argument('--get-gateways', {help: 'prints information about available gateways', dest: 'actionGetGateways', action: 'store_true'})
parser.add_argument('--get-ladder-top100', {help: 'prints the current global ladder top 100', dest: 'actionGetLadderTop100', action: 'store_true'})
parser.add_argument('--get-player', {help: 'prints player information by Battle.net ID', dest: 'actionGetPlayer', metavar: 'ID'})
parser.add_argument('--find-players', {help: 'searches the ladder for a name and returns matching players', dest: 'actionFindPlayers', metavar: 'TERM'})
parser.add_argument('--host', {help: 'host to use for making API calls (default: 127.0.0.1)', dest: 'valueHost', metavar: 'HOST', default: '127.0.0.1'})

const args = {...parser.parse_args()}

require('./main.js').main(args, {cwd: process.cwd()})
